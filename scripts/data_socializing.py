# -*- coding: utf-8 -*-
"""Socializing topic definition."""

SOCIALIZING_DATA = {
    "id": "socializing",
    "titleEn": "Small Talk & Making Friends",
    "titleVi": "Giao Tiếp Xã Giao & Kết Bạn",
    "icon": "💬",
    "description": "Luyện kỹ năng bắt chuyện tự nhiên, phá băng (Ice Breaking), nói về sở thích, ẩm thực văn hóa và trao đổi thông tin liên lạc.",
    "scenarios": [
        {
            "id": "socializing-freetalk",
            "order": 0,
            "section": "🌟 THỰC CHIẾN TỰ DO (OPEN ROLEPLAY)",
            "titleEn": "Socializing Free Talk (Không Giới Hạn)",
            "titleVi": "Thực chiến kết bạn & Small Talk tự do",
            "situation": "Phòng thực chiến tự do: AI đóng vai Một người bạn quốc tế thân thiện, cởi mở (Friendly Global Companion). Bạn có thể trò chuyện về bất kỳ điều gì: cuộc sống, sở thích, âm nhạc, phim ảnh, du lịch, chia sẻ cảm xúc hoặc luyện kỹ năng giữ nhịp hội thoại tự nhiên!",
            "isFreeTalk": True,
            "defaultRoles": {
                "ai": {
                    "id": "ai",
                    "name": "Alex",
                    "titleEn": "Friendly Conversationalist",
                    "titleVi": "Người bạn quốc tế",
                    "avatar": "💬"
                },
                "user": {
                    "id": "user",
                    "name": "You",
                    "titleEn": "Learner",
                    "titleVi": "Bạn (Người trò chuyện)",
                    "avatar": "👤"
                }
            },
            "initialMessageEn": "Hey there! How has your week been treating you so far?",
            "initialMessageVi": "Chào bạn! Tuần này của bạn trôi qua thế nào rồi, mọi thứ ổn chứ?",
            "vocabulary": [
                {
                    "id": "vocab-so0-1",
                    "word": "break the ice",
                    "partOfSpeech": "idiom",
                    "ipa": "/breɪk ði aɪs/",
                    "meaningVi": "phá vỡ bầu không khí ngại ngùng ban đầu",
                    "synonyms": ["start a conversation (bắt chuyện)", "warm up (làm nóng không khí)"],
                    "antonyms": ["awkward silence (sự im lặng ngượng ngùng)"],
                    "collocations": [
                        "great way to break the ice: cách tuyệt vời để mở đầu câu chuyện",
                        "icebreaker game: trò chơi phá băng"
                    ],
                    "exampleEn": "Talking about food is always the best way to break the ice with foreigners.",
                    "exampleVi": "Nói về đồ ăn luôn là cách tốt nhất để phá băng khi trò chuyện với người nước ngoài."
                },
                {
                    "id": "vocab-so0-2",
                    "word": "be into something",
                    "partOfSpeech": "idiom phr",
                    "ipa": "/biː ˈɪntuː ˈsʌmθɪŋ/",
                    "meaningVi": "rất mê / cực kỳ thích một thú vui nào đó",
                    "synonyms": ["be passionate about (đam mê)", "be a huge fan of (là fan cứng của)"],
                    "antonyms": ["not my cup of tea (không phải gu của tôi)"],
                    "collocations": [
                        "I'm really into photography: Tôi cực kỳ mê chụp ảnh",
                        "What are you into?: Bạn có sở thích gì?"
                    ],
                    "exampleEn": "Lately I've been really into hiking and discovering new coffee spots.",
                    "exampleVi": "Dạo gần đây tôi rất mê đi leo núi và khám phá các quán cà phê mới."
                },
                {
                    "id": "vocab-so0-3",
                    "word": "stay in touch",
                    "partOfSpeech": "idiom",
                    "ipa": "/steɪ ɪn tʌtʃ/",
                    "meaningVi": "giữ liên lạc với nhau",
                    "synonyms": ["keep in touch (giữ liên lạc)", "stay connected (kết nối)"],
                    "antonyms": ["lose touch (mất liên lạc)"],
                    "collocations": [
                        "Let's stay in touch: Chúng mình hãy giữ liên lạc nhé",
                        "keep each other posted: cập nhật tin tức cho nhau"
                    ],
                    "exampleEn": "It was so wonderful chatting with you. Let's definitely stay in touch!",
                    "exampleVi": "Thật tuyệt vời khi được trò chuyện cùng bạn. Nhất định tụi mình phải giữ liên lạc nhé!"
                }
            ],
            "sampleDialogue": [],
            "suggestedHints": [
                "Pretty good, thanks! How about yourself?",
                "What do you usually do in your free time?",
                "Have you ever traveled to Vietnam or Southeast Asia?",
                "What kind of music or movies are you into lately?"
            ]
        },
        {
            "id": "socializing-scenario-1",
            "order": 1,
            "section": "🤝 Làm quen & Phá băng (Breaking the Ice)",
            "titleEn": "Breaking the Ice at an Event / Hostel",
            "titleVi": "Bắt chuyện làm quen tại Sự kiện / Hostel",
            "situation": "Bạn đang tham gia một buổi giao lưu quốc tế hoặc phòng sinh hoạt chung tại hostel. Bạn chủ động bắt chuyện với người ngồi cạnh để làm quen.",
            "defaultRoles": {
                "ai": {
                    "id": "ai",
                    "name": "Sarah",
                    "titleEn": "New Acquaintance",
                    "titleVi": "Người bạn mới (Sarah)",
                    "avatar": "✨"
                },
                "user": {
                    "id": "user",
                    "name": "You",
                    "titleEn": "You",
                    "titleVi": "Bạn",
                    "avatar": "👤"
                }
            },
            "initialMessageEn": "Hi there! Mind if I sit here? It's pretty lively tonight, isn't it?",
            "initialMessageVi": "Chào bạn! Tôi ngồi đây được chứ? Tối nay không khí ở đây nhộn nhịp ghê nhỉ?",
            "vocabulary": [
                {
                    "id": "vocab-so1-1",
                    "word": "What brings you here?",
                    "partOfSpeech": "phrase",
                    "ipa": "/wʌt brɪŋz juː hɪr/",
                    "meaningVi": "Cơ duyên nào đưa bạn đến đây? / Điều gì đưa bạn tới đây?",
                    "synonyms": ["Why are you in town? (Sao bạn lại ở thành phố này?)"],
                    "antonyms": [],
                    "collocations": ["What brings you to this event?: Cơ duyên nào đưa bạn tới sự kiện này?"],
                    "exampleEn": "So, what brings you to Tokyo? Vacation or work?",
                    "exampleVi": "Thế điều gì đưa bạn tới Tokyo vậy? Đi du lịch hay công tác?"
                },
                {
                    "id": "vocab-so1-2",
                    "word": "originally from",
                    "partOfSpeech": "phrase",
                    "ipa": "/əˈrɪdʒənəli frɑːm/",
                    "meaningVi": "quê gốc ở / xuất thân từ",
                    "synonyms": ["come from (đến từ)", "hail from (quê quán tại)"],
                    "antonyms": [],
                    "collocations": [
                        "I'm originally from Da Nang, Vietnam: Tôi quê gốc ở Đà Nẵng, Việt Nam"
                    ],
                    "exampleEn": "I'm originally from Australia, but I've lived here for two years.",
                    "exampleVi": "Tôi quê gốc ở Úc, nhưng tôi đã sống ở đây được hai năm rồi."
                },
                {
                    "id": "vocab-so1-3",
                    "word": "solo traveler",
                    "partOfSpeech": "n",
                    "ipa": "/ˈsoʊloʊ ˈtrævlər/",
                    "meaningVi": "người đi du lịch một mình",
                    "synonyms": ["traveling alone (đi một mình)"],
                    "antonyms": ["group tour (đi tour theo đoàn)"],
                    "collocations": ["backpacking solo: đi phượt bụi một mình"],
                    "exampleEn": "Are you traveling with friends, or are you a solo traveler?",
                    "exampleVi": "Bạn đi cùng bạn bè hay là bạn đi du lịch một mình thế?"
                }
            ],
            "sampleDialogue": [
                {
                    "speaker": "ai",
                    "roleName": "Sarah",
                    "textEn": "Hi there! Mind if I sit here? It's pretty lively tonight, isn't it?",
                    "textVi": "Chào bạn! Tôi ngồi đây được chứ? Tối nay không khí ở đây nhộn nhịp ghê nhỉ?"
                },
                {
                    "speaker": "user",
                    "roleName": "You",
                    "textEn": "Not at all, please have a seat! Yeah, the vibe here is awesome. My name is Alex, by the way.",
                    "textVi": "Không sao đâu, bạn cứ ngồi tự nhiên! Công nhận, không khí ở đây tuyệt thật. À, tôi tên là Alex."
                },
                {
                    "speaker": "ai",
                    "roleName": "Sarah",
                    "textEn": "Nice to meet you, Alex! I'm Sarah from Melbourne. What brings you to this meetup?",
                    "textVi": "Rất vui được gặp bạn, Alex! Tôi là Sarah đến từ Melbourne. Điều gì đưa bạn đến buổi giao lưu này thế?"
                },
                {
                    "speaker": "user",
                    "roleName": "You",
                    "textEn": "Nice to meet you Sarah! I'm originally from Vietnam. I'm a software engineer and I'm here for a tech conference and a bit of traveling.",
                    "textVi": "Rất vui được biết bạn, Sarah! Tôi đến từ Việt Nam. Tôi là kỹ sư phần mềm, tới đây để dự hội thảo công nghệ và tiện thể đi du lịch một chút."
                },
                {
                    "speaker": "ai",
                    "roleName": "Sarah",
                    "textEn": "Oh, that's so cool! How long have you been here, and how are you finding the city so far?",
                    "textVi": "Ôi xịn thế! Bạn đã ở đây được bao lâu rồi, và bạn cảm nhận về thành phố này thế nào?"
                },
                {
                    "speaker": "user",
                    "roleName": "You",
                    "textEn": "Just arrived two days ago! The public transport is amazing, but I'm still trying to find good local food spots.",
                    "textVi": "Tôi vừa tới đây hai ngày trước thôi! Giao thông công cộng cực kỳ tiện lợi, nhưng tôi vẫn đang mò mẫm tìm mấy quán ăn ngon địa phương."
                },
                {
                    "speaker": "ai",
                    "roleName": "Sarah",
                    "textEn": "You asked the right person! I found an incredible ramen place just around the block. I can pin it on the map for you!",
                    "textVi": "Hỏi đúng người rồi đấy! Tôi vừa phát hiện một quán mì ramen ngon xuất sắc ngay góc phố bên cạnh. Để tôi thả ghim vị trí trên bản đồ cho bạn nhé!"
                }
            ],
            "suggestedHints": [
                "Not at all, please have a seat! I'm Alex.",
                "Nice to meet you! Where are you from?",
                "What brings you to the city? Are you on vacation?",
                "How long have you been traveling around here?"
            ]
        },
        {
            "id": "socializing-scenario-2",
            "order": 2,
            "section": "🏖️ Đời sống & Sở thích (Lifestyle & Hobbies)",
            "titleEn": "Weekend Plans, Hobbies & Music",
            "titleVi": "Kế hoạch cuối tuần, Sở thích & Âm nhạc",
            "situation": "Trò chuyện thân mật về những việc hay làm vào cuối tuần, gu âm nhạc, sở thích thể thao hoặc những chuyến đi dã ngoại.",
            "defaultRoles": {
                "ai": {
                    "id": "ai",
                    "name": "Sarah",
                    "titleEn": "Friend",
                    "titleVi": "Bạn bè (Sarah)",
                    "avatar": "🎶"
                },
                "user": {
                    "id": "user",
                    "name": "You",
                    "titleEn": "You",
                    "titleVi": "Bạn",
                    "avatar": "👤"
                }
            },
            "initialMessageEn": "So Alex, what do you usually like to do when you're not coding or working?",
            "initialMessageVi": "Thế Alex này, những lúc không phải ngồi gõ code hay làm việc thì bạn thường thích làm gì?",
            "vocabulary": [
                {
                    "id": "vocab-so2-1",
                    "word": "unwind",
                    "partOfSpeech": "v",
                    "ipa": "/ʌnˈwaɪnd/",
                    "meaningVi": "thư giãn, xả hơi sau giờ làm việc căng thẳng",
                    "synonyms": ["relax (thư giãn)", "chill out (nghỉ ngơi)", "decompress (giảm áp lực)"],
                    "antonyms": ["stress out (căng thẳng)"],
                    "collocations": [
                        "great way to unwind: cách tuyệt vời để xả stress",
                        "unwind after a long day: thư giãn sau một ngày dài"
                    ],
                    "exampleEn": "Listening to acoustic music is how I unwind in the evening.",
                    "exampleVi": "Nghe nhạc acoustic là cách tôi xả stress vào buổi tối."
                },
                {
                    "id": "vocab-so2-2",
                    "word": "binge-watch",
                    "partOfSpeech": "v",
                    "ipa": "/ˈbɪndʒ wɑːtʃ/",
                    "meaningVi": "cày phim liên tục nhiều tập một lúc",
                    "synonyms": ["marathon a series (xem marathon cả bộ phim)"],
                    "antonyms": [],
                    "collocations": ["binge-watch a TV show on Netflix: cày trọn bộ phim trên Netflix"],
                    "exampleEn": "I ended up binge-watching the entire season on Sunday.",
                    "exampleVi": "Chủ nhật vừa rồi tôi đã cày hết trọn bộ cả một mùa phim."
                },
                {
                    "id": "vocab-so2-3",
                    "word": "outdoor enthusiast",
                    "partOfSpeech": "n phr",
                    "ipa": "/ˈaʊtdɔːr ɪnˈθuːziæst/",
                    "meaningVi": "người đam mê các hoạt động ngoài trời",
                    "synonyms": ["nature lover (người yêu thiên nhiên)"],
                    "antonyms": ["homebody / couch potato (người thích ở lì trong nhà)"],
                    "collocations": ["hiking and camping: đi bộ leo núi và cắm trại"],
                    "exampleEn": "Are you more of an outdoor enthusiast or do you prefer staying in?",
                    "exampleVi": "Bạn thuộc tuýp người thích hoạt động ngoài trời hay thích ở nhà hơn?"
                }
            ],
            "sampleDialogue": [
                {
                    "speaker": "ai",
                    "roleName": "Sarah",
                    "textEn": "So Alex, what do you usually like to do when you're not coding or working?",
                    "textVi": "Thế Alex này, những lúc không phải ngồi gõ code hay làm việc thì bạn thường thích làm gì?"
                },
                {
                    "speaker": "user",
                    "roleName": "You",
                    "textEn": "Well, to unwind, I love going for a run along the river, and on lazy Sundays I usually brew some coffee and binge-watch sci-fi series.",
                    "textVi": "À, để xả stress thì tôi thích chạy bộ dọc bờ sông, còn mấy ngày Chủ nhật lười biếng thì tôi hay tự pha cà phê rồi cày phim khoa học viễn tưởng."
                },
                {
                    "speaker": "ai",
                    "roleName": "Sarah",
                    "textEn": "No way, you like sci-fi too? Have you seen 'Interstellar' or 'Black Mirror'?",
                    "textVi": "Không thể nào, bạn cũng mê phim viễn tưởng á? Bạn xem 'Interstellar' hay 'Black Mirror' chưa?"
                },
                {
                    "speaker": "user",
                    "roleName": "You",
                    "textEn": "'Interstellar' is actually one of my all-time favorites! The soundtrack by Hans Zimmer gives me chills every time.",
                    "textVi": "'Interstellar' thực ra là một trong những bộ phim tôi thích nhất mọi thời đại luôn! Nhạc phim của Hans Zimmer lần nào nghe cũng sởn gai ốc."
                },
                {
                    "speaker": "ai",
                    "roleName": "Sarah",
                    "textEn": "100% agreed! We clearly share the same taste in cinema. Any big plans for this upcoming weekend?",
                    "textVi": "Đồng ý 100% luôn! Gu phim ảnh của chúng mình hợp nhau ghê. Cuối tuần sắp tới bạn có kế hoạch lớn gì chưa?"
                },
                {
                    "speaker": "user",
                    "roleName": "You",
                    "textEn": "I'm thinking of checking out the contemporary art museum and maybe a jazz bar on Saturday night.",
                    "textVi": "Tôi đang tính đi xem bảo tàng nghệ thuật đương đại và có thể sẽ ghé một quán bar nhạc jazz vào tối thứ Bảy."
                }
            ],
            "suggestedHints": [
                "In my free time, I really enjoy playing guitar and jogging.",
                "To be honest, I'm a bit of a homebody on weekends.",
                "Have you seen any good movies or TV shows lately?",
                "What kind of music do you listen to when you focus?"
            ]
        },
        {
            "id": "socializing-scenario-3",
            "order": 3,
            "section": "📲 Giữ liên lạc & Kết nối (Staying in Touch)",
            "titleEn": "Exchanging Contacts & Saying Goodbye",
            "titleVi": "Trao đổi liên lạc & Chào tạm biệt",
            "situation": "Sau một cuộc trò chuyện thú vị, bạn chủ động xin phương thức liên lạc (Instagram, LinkedIn, WhatsApp) để giữ liên lạc và hẹn gặp lại.",
            "defaultRoles": {
                "ai": {
                    "id": "ai",
                    "name": "Sarah",
                    "titleEn": "Friend",
                    "titleVi": "Bạn bè (Sarah)",
                    "avatar": "📲"
                },
                "user": {
                    "id": "user",
                    "name": "You",
                    "titleEn": "You",
                    "titleVi": "Bạn",
                    "avatar": "👤"
                }
            },
            "initialMessageEn": "Oh look at the time, it's almost 10 PM already! Time really flew by.",
            "initialMessageVi": "Ôi nhìn đồng hồ kìa, gần 10 giờ tối rồi đấy! Thời gian trôi nhanh thật sự.",
            "vocabulary": [
                {
                    "id": "vocab-so3-1",
                    "word": "time flies",
                    "partOfSpeech": "idiom",
                    "ipa": "/taɪm flaɪz/",
                    "meaningVi": "thời gian trôi qua quá nhanh",
                    "synonyms": ["time flies when you're having fun (thời gian trôi vèo khi đang vui)"],
                    "antonyms": [],
                    "collocations": ["Time really flies: Thời gian trôi nhanh thật đấy"],
                    "exampleEn": "Time flies when you have great conversations.",
                    "exampleVi": "Thời gian trôi vèo khi bạn có những cuộc trò chuyện tuyệt vời."
                },
                {
                    "id": "vocab-so3-2",
                    "word": "socials",
                    "partOfSpeech": "n (plural)",
                    "ipa": "/ˈsoʊʃlz/",
                    "meaningVi": "các tài khoản mạng xã hội (Instagram, Facebook, v.v.)",
                    "synonyms": ["social media handles (tài khoản mạng xã hội)"],
                    "antonyms": [],
                    "collocations": [
                        "swap socials: đổi tài khoản mạng xã hội cho nhau",
                        "Are you on Instagram?: Bạn có dùng Instagram không?"
                    ],
                    "exampleEn": "Do you want to swap socials so we can stay in touch?",
                    "exampleVi": "Bạn có muốn đổi tài khoản mạng xã hội để chúng mình giữ liên lạc không?"
                },
                {
                    "id": "vocab-so3-3",
                    "word": "catch up",
                    "partOfSpeech": "v phr",
                    "ipa": "/kætʃ ʌp/",
                    "meaningVi": "gặp nhau tán gẫu / cập nhật tin tức của nhau",
                    "synonyms": ["meet up (gặp gỡ)", "hang out (đi chơi cùng nhau)"],
                    "antonyms": [],
                    "collocations": [
                        "catch up over coffee: gặp nhau cà phê tán gẫu",
                        "catch up later: nói chuyện lại sau nhé"
                    ],
                    "exampleEn": "Let's definitely catch up for coffee sometime next week!",
                    "exampleVi": "Nhất định tuần tới chúng mình phải hẹn nhau đi cà phê tán gẫu nhé!"
                }
            ],
            "sampleDialogue": [
                {
                    "speaker": "ai",
                    "roleName": "Sarah",
                    "textEn": "Oh look at the time, it's almost 10 PM already! Time really flew by.",
                    "textVi": "Ôi nhìn đồng hồ kìa, gần 10 giờ tối rồi đấy! Thời gian trôi nhanh thật sự."
                },
                {
                    "speaker": "user",
                    "roleName": "You",
                    "textEn": "Yeah, it really did! I had a great time talking with you tonight.",
                    "textVi": "Ừ, nhanh thật đấy! Tối nay tôi đã có một buổi trò chuyện rất vui với bạn."
                },
                {
                    "speaker": "ai",
                    "roleName": "Sarah",
                    "textEn": "Me too, Alex! Are you on Instagram or WhatsApp? Let's connect so we don't lose touch.",
                    "textVi": "Tôi cũng vậy, Alex! Bạn có dùng Instagram hay WhatsApp không? Kết nối đi để không bị mất liên lạc nhé."
                },
                {
                    "speaker": "user",
                    "roleName": "You",
                    "textEn": "Definitely! My Instagram is @alex_dev, or you can scan my QR code right here.",
                    "textVi": "Chắc chắn rồi! Instagram của tôi là @alex_dev, hoặc bạn quét mã QR của tôi ngay đây này."
                },
                {
                    "speaker": "ai",
                    "roleName": "Sarah",
                    "textEn": "Awesome, scanned and followed! Send me a message if you want to grab that coffee this Saturday.",
                    "textVi": "Tuyệt cú mèo, đã quét và bấm theo dõi rồi nhé! Cứ nhắn cho tôi nếu bạn muốn đi cà phê vào thứ Bảy này nhé."
                },
                {
                    "speaker": "user",
                    "roleName": "You",
                    "textEn": "Will do! Have a safe trip back to your hotel, Sarah. Good night!",
                    "textVi": "Nhất trí luôn! Về khách sạn an toàn nhé Sarah. Chúc bạn ngủ ngon!"
                }
            ],
            "suggestedHints": [
                "It was really great meeting you today!",
                "Are you on Instagram or WhatsApp? Let's swap socials.",
                "Here is my QR code, you can scan it right now.",
                "Let's grab a coffee before you leave town!"
            ]
        }
    ]
}
