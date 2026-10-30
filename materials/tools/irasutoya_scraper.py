# -*- coding: utf-8 -*-
"""Irasutoya Image Scraper and Cacher.

Automatically searches https://www.irasutoya.com/ for Japanese/English keywords,
retrieves high-resolution transparent PNG images, and caches them locally.
"""

import os
import sys
import json
import time
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
CACHE_DIR = os.path.join(SCRIPT_DIR, "cached_images", "irasutoya")

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# Mapping of asset key to list of Japanese search terms (in order of priority)
HOTEL_ASSET_QUERIES = {
    # Characters
    "char_receptionist": ["ホテル フロント 女性", "ホテルの受付", "ホテルマン 女性", "フロントスタッフ"],
    "char_guest": ["旅行者 女性 スーツケース", "旅行 スーツケース 女性", "観光客 女性", "旅行者 女性"],
    "char_housekeeper": ["ホテル 客室清掃員", "ベッドメイキング", "ホテル 清掃", "掃除 スタッフ"],
    "char_technician": ["水道 修理 作業員", "修理 作業員", "配管工", "作業服 男性 修理"],

    # Vocabularies
    "vocab_reservation": ["予約席", "ネット予約 パソコン", "予約 パソコン", "予約"],
    "vocab_key_card": ["カードキー", "ホテルのカードキー", "ホテル 鍵"],
    "vocab_sea_view": ["オーシャンビュー", "ホテルの部屋 海", "窓 海 リゾート", "海の景色"],
    "vocab_breakfast": ["朝食", "朝食 バイキング", "ホテル モーニング"],
    "vocab_housekeeping": ["ベッドメイキング", "客室清掃", "ホテルの清掃", "掃除"],
    "vocab_bed_sheets": ["シーツ 交換", "ベッドシーツ", "布団 シーツ", "シーツ"],
    "vocab_room_service": ["ルームサービス", "ホテル ルームサービス", "料理 運ぶ"],
    "vocab_amenities": ["シャンプー リンス", "アメニティ グッズ", "洗面用具", "歯ブラシ"],
    "vocab_clogged_toilet": ["トイレ つまり", "トイレ ラバーカップ", "トイレ 故障", "洋式トイレ"],
    "vocab_leaking_water": ["水漏れ 配水管", "水漏れ 水道", "水道 パイプ 水漏れ", "水漏れ"],
    "vocab_water_pressure": ["シャワー 浴びる", "シャワーヘッド", "シャワー お風呂"],
    "vocab_check_out": ["ホテルのチェックアウト", "領収書 ホテル", "レジ 会計 ホテル", "レシート"],
    "deco_hotel": ["ホテル", "ホテル 外観"]
}

WORKPLACE_ASSET_QUERIES = {
    # Characters
    "char_office_man_a": ["会社員 若手 男性", "会社員 スーツ 男性", "サラリーマン"],
    "char_office_man_b": ["会社員 パソコン 男性", "デスクワーク 男性", "物流 事務"],
    "char_career_lead": ["ベテラン 社員 男性", "上司 指導 男性", "会社員 ベテラン"],
    "char_colleague_leaving": ["会社員 挨拶 笑顔", "会社員 男性 笑顔", "転職 挨拶"],
    
    # Vocabularies
    "vocab_freight_forwarding": ["コンテナ船", "貨物船", "貿易船", "コンテナ 港"],
    "vocab_cut_off_time": ["時計 締め切り", "時間 焦る", "締め切り 走る", "時計"],
    "vocab_freelance": ["フリーランス パソコン", "ノマドワーカー", "カフェ ノートパソコン"],
    "vocab_remote_work": ["テレワーク", "在宅勤務", "リモートワーク パソコン"],
    "vocab_colleague": ["同僚 会社員", "同僚 相談", "会社員 雑談", "オフィス 相談"],
    "vocab_deadline": ["締め切り 追われる", "納期 焦る", "締め切り パソコン", "仕事 間に合わない"],
    "vocab_work_life_balance": ["ワークライフバランス", "定時退社", "仕事と私生活", "天秤"],
    "vocab_promotion": ["昇進", "キャリアアップ", "出世", "階段 男"],
    "vocab_salary": ["給料袋", "ボーナス", "給与明細", "お金 封筒"],
    "vocab_networking": ["飲み会 乾杯 サラリーマン", "仕事 飲み会", "異業種交流会", "名刺交換"],
    "vocab_internship": ["インターンシップ", "新入社員 メモ", "研修 社員", "スーツ 若者"],
    "vocab_resign": ["退職届", "辞表", "退職 挨拶", "転職"],
    
    # Decorative
    "deco_workplace": ["オフィスビル", "物流センター", "オフィス 職場", "ビル 街"]
}

def search_irasutoya(query):
    """Search irasutoya.com and return the highest resolution transparent PNG URL."""
    encoded = urllib.parse.quote(query)
    search_url = f"https://www.irasutoya.com/search?q={encoded}"
    req = urllib.request.Request(search_url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            html = resp.read().decode('utf-8')
            soup = BeautifulSoup(html, 'html.parser')
            
            # Find post links
            post_urls = []
            for a in soup.select('.box a'):
                href = a.get('href')
                if href and 'blog-post' in href and href not in post_urls:
                    post_urls.append(href)
            
            if not post_urls:
                return None
            
            # Check up to 3 post URLs to get a good PNG
            import re
            fallback_img = None
            for post_url in post_urls[:3]:
                post_req = urllib.request.Request(post_url, headers=HEADERS)
                try:
                    with urllib.request.urlopen(post_req, timeout=12) as post_resp:
                        post_html = post_resp.read().decode('utf-8')
                        post_soup = BeautifulSoup(post_html, 'html.parser')
                        entry = post_soup.select_one('.entry')
                        if entry:
                            for img in entry.select('img'):
                                src = img.get('src', '')
                                if src and ('googleusercontent.com' in src or 'bp.blogspot.com' in src):
                                    high_res = re.sub(r'/s\d+(-[a-z0-9]+)?/', '/s800/', src)
                                    if '.png' in src.lower():
                                        return high_res
                                    elif not fallback_img:
                                        fallback_img = high_res
                except Exception as e:
                    continue
            if fallback_img:
                return fallback_img
    except Exception as e:
        print(f"Error querying '{query}': {e}")
    return None

def download_image(url, save_path):
    """Download image to target path."""
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            content = resp.read()
            with open(save_path, 'wb') as f:
                f.write(content)
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

def get_or_download_asset(asset_key, queries=None):
    """Get path to cached image, or search & download if not present."""
    os.makedirs(CACHE_DIR, exist_ok=True)
    target_path = os.path.join(CACHE_DIR, f"{asset_key}.png")
    
    if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
        return target_path
    
    query_list = queries or WORKPLACE_ASSET_QUERIES.get(asset_key) or HOTEL_ASSET_QUERIES.get(asset_key, [asset_key])
    for q in query_list:
        print(f"Searching Irasutoya for [{asset_key}] using query: '{q}'...")
        img_url = search_irasutoya(q)
        if img_url:
            print(f"Found image URL: {img_url}")
            success = download_image(img_url, target_path)
            if success and os.path.getsize(target_path) > 1000:
                print(f"-> Successfully saved: {target_path} ({os.path.getsize(target_path)} bytes)")
                time.sleep(0.5) # courteous pause
                return target_path
        time.sleep(0.3)
    
    print(f"WARNING: Could not find Irasutoya image for {asset_key}")
    return None

def download_all_hotel_assets():
    """Download all needed hotel assets and return a dictionary of paths."""
    print("=== Downloading all Hotel Irasutoya Assets ===")
    asset_paths = {}
    for key, queries in HOTEL_ASSET_QUERIES.items():
        path = get_or_download_asset(key, queries)
        asset_paths[key] = path
    print("=== Finished downloading Hotel Assets ===")
    return asset_paths

def download_all_workplace_assets():
    """Download all needed workplace assets and return a dictionary of paths."""
    print("=== Downloading all Workplace Irasutoya Assets ===")
    asset_paths = {}
    for key, queries in WORKPLACE_ASSET_QUERIES.items():
        path = get_or_download_asset(key, queries)
        asset_paths[key] = path
    print("=== Finished downloading Workplace Assets ===")
    return asset_paths

if __name__ == "__main__":
    if len(sys.argv) > 1 and "hotel" in sys.argv:
        download_all_hotel_assets()
    else:
        download_all_workplace_assets()
    download_all_hotel_assets()
