# -*- coding: utf-8 -*-
"""Workplace topic definition."""

WORKPLACE_DATA = {
    "id": "workplace",
    "titleEn": "Tech & Workplace Communication",
    "titleVi": "Giao Tiếp Công Sở & Kỹ Thuật",
    "icon": "💻",
    "description": "Luyện giao tiếp môi trường công nghệ & quốc tế: Daily Standup, nhờ review code/debug, đàm phán dời deadline và làm rõ yêu cầu spec.",
    "scenarios": [
        {
            "id": "workplace-freetalk",
            "order": 0,
            "section": "🌟 THỰC CHIẾN TỰ DO (OPEN ROLEPLAY)",
            "titleEn": "Workplace Free Talk (Không Giới Hạn)",
            "titleVi": "Thực chiến công sở & IT tự do",
            "situation": "Phòng thực chiến tự do: AI đóng vai Kỹ sư trưởng & Trưởng nhóm kỹ thuật (Engineering Lead). Bạn có thể thảo luận bất kỳ vấn đề công việc nào: kiến trúc hệ thống, báo cáo tiến độ sprint, thảo luận giải pháp kỹ thuật, phỏng vấn thử hoặc giải quyết mâu thuẫn trong dự án!",
            "isFreeTalk": True,
            "defaultRoles": {
                "ai": {
                    "id": "ai",
                    "name": "Engineering Lead",
                    "titleEn": "Tech Lead / Manager",
                    "titleVi": "Trưởng nhóm Kỹ thuật",
                    "avatar": "💻"
                },
                "user": {
                    "id": "user",
                    "name": "Developer",
                    "titleEn": "Software Engineer",
                    "titleVi": "Kỹ sư phần mềm (Bạn)",
                    "avatar": "👤"
                }
            },
            "initialMessageEn": "Morning team! Ready to sync up on our current sprint goals and roadmap?",
            "initialMessageVi": "Chào buổi sáng cả đội! Mọi người đã sẵn sàng đồng bộ tiến độ mục tiêu sprint và lộ trình dự án chưa?",
            "vocabulary": [
                {
                    "id": "vocab-w0-1",
                    "word": "blocker",
                    "partOfSpeech": "n",
                    "ipa": "/ˈblɑːkər/",
                    "meaningVi": "vướng mắc lớn khiến công việc bị ách tắc không thể tiếp tục",
                    "synonyms": ["impediment (trở ngại)", "roadblock (rào cản tiến độ)"],
                    "antonyms": ["smooth progress (tiến độ thuận lợi)"],
                    "collocations": [
                        "hit a blocker: vấp phải điểm nghẽn",
                        "unblock someone: tháo gỡ vướng mắc cho ai đó"
                    ],
                    "exampleEn": "Do you have any blockers that might jeopardize the sprint release?",
                    "exampleVi": "Bạn có vướng mắc nào có thể gây ảnh hưởng xấu tới đợt bàn giao sprint không?"
                },
                {
                    "id": "vocab-w0-2",
                    "word": "pull request",
                    "partOfSpeech": "n phr",
                    "ipa": "/pʊl rɪˈkwest/",
                    "meaningVi": "yêu cầu hợp nhất mã nguồn (PR)",
                    "synonyms": ["merge request (yêu cầu gộp code)"],
                    "antonyms": [],
                    "collocations": [
                        "open a pull request: mở một PR mới",
                        "review a pull request: đánh giá duyệt code PR",
                        "merge into main: gộp code vào nhánh chính"
                    ],
                    "exampleEn": "I just submitted the pull request for the authentication module.",
                    "exampleVi": "Tôi vừa tạo yêu cầu pull request cho mô-đun xác thực người dùng."
                },
                {
                    "id": "vocab-w0-3",
                    "word": "trade-off",
                    "partOfSpeech": "n",
                    "ipa": "/ˈtreɪd ɔːf/",
                    "meaningVi": "sự đánh đổi (giữa tốc độ, chi phí và chất lượng)",
                    "synonyms": ["compromise (sự thỏa hiệp)", "pros and cons (ưu và nhược điểm)"],
                    "antonyms": [],
                    "collocations": [
                        "engineering trade-off: sự đánh đổi về mặt kỹ thuật",
                        "weigh the trade-offs: cân nhắc các yếu tố được mất"
                    ],
                    "exampleEn": "There is a performance trade-off between caching in memory and querying the database directly.",
                    "exampleVi": "Có sự đánh đổi về mặt hiệu năng giữa việc lưu bộ nhớ đệm và truy vấn trực tiếp cơ sở dữ liệu."
                }
            ],
            "sampleDialogue": [],
            "suggestedHints": [
                "Yesterday I completed the API integration, today I'm writing tests.",
                "I have a blocker related to third-party authentication credentials.",
                "Could someone help me review my pull request before the end of the day?",
                "We might need to adjust the deadline due to an unexpected database migration issue."
            ]
        },
        {
            "id": "workplace-scenario-1",
            "order": 1,
            "section": "📋 Họp nhanh hàng ngày (Daily Standup)",
            "titleEn": "Daily Standup & Status Update",
            "titleVi": "Báo cáo họp Standup hàng ngày",
            "situation": "Bạn tham gia buổi họp Scrum 15 phút hàng ngày với team quốc tế. Bạn báo cáo: Hôm qua làm gì, hôm nay làm gì, và có vướng mắc (blocker) gì cần hỗ trợ hay không.",
            "defaultRoles": {
                "ai": {
                    "id": "ai",
                    "name": "Scrum Master",
                    "titleEn": "Scrum Master",
                    "titleVi": "Điều phối viên Scrum",
                    "avatar": "⏱️"
                },
                "user": {
                    "id": "user",
                    "name": "Developer",
                    "titleEn": "Software Engineer",
                    "titleVi": "Kỹ sư phần mềm (Bạn)",
                    "avatar": "👤"
                }
            },
            "initialMessageEn": "Good morning everyone! Let's kick off our daily standup. Alex, do you want to start?",
            "initialMessageVi": "Chào buổi sáng mọi người! Bắt đầu buổi standup hàng ngày nhé. Alex, bạn có muốn bắt đầu trước không?",
            "vocabulary": [
                {
                    "id": "vocab-w1-1",
                    "word": "on track",
                    "partOfSpeech": "idiom phr",
                    "ipa": "/ɑːn træk/",
                    "meaningVi": "đang đúng tiến độ dự kiến",
                    "synonyms": ["on schedule (đúng lịch trình)"],
                    "antonyms": ["behind schedule (chậm tiến độ)", "off track (lệch hướng)"],
                    "collocations": [
                        "everything is on track: mọi thứ đều đang đúng tiến độ",
                        "keep things on track: giữ cho công việc đi đúng hướng"
                    ],
                    "exampleEn": "The payment gateway integration is currently on track.",
                    "exampleVi": "Tích hợp cổng thanh toán hiện đang đi đúng tiến độ."
                },
                {
                    "id": "vocab-w1-2",
                    "word": "wrap up",
                    "partOfSpeech": "v phr",
                    "ipa": "/ræp ʌp/",
                    "meaningVi": "hoàn thành dứt điểm / chốt xong việc gì đó",
                    "synonyms": ["finish up (kết thúc)", "finalize (chốt xong)", "complete (hoàn thành)"],
                    "antonyms": ["kick off (bắt đầu triển khai)"],
                    "collocations": [
                        "wrap up the task: giải quyết xong xuôi công việc",
                        "wrap up the meeting: kết thúc cuộc họp"
                    ],
                    "exampleEn": "I expect to wrap up the unit tests by early afternoon.",
                    "exampleVi": "Tôi dự kiến sẽ hoàn thành dứt điểm phần unit test vào đầu giờ chiều."
                },
                {
                    "id": "vocab-w1-3",
                    "word": "dependency",
                    "partOfSpeech": "n",
                    "ipa": "/dɪˈpendənsi/",
                    "meaningVi": "sự phụ thuộc / điều kiện phụ thuộc vào team khác",
                    "synonyms": ["prerequisite (điều kiện tiên quyết)"],
                    "antonyms": ["independent (độc lập)"],
                    "collocations": [
                        "waiting on a dependency: đang chờ phần việc phụ thuộc từ bên khác",
                        "external dependency: phụ thuộc từ đối tác bên ngoài"
                    ],
                    "exampleEn": "My task has a dependency on the backend endpoint being deployed first.",
                    "exampleVi": "Công việc của tôi bị phụ thuộc vào việc API đầu cuối của backend phải được deploy trước."
                }
            ],
            "sampleDialogue": [
                {
                    "speaker": "ai",
                    "roleName": "Scrum Master",
                    "textEn": "Good morning everyone! Let's kick off our daily standup. Alex, do you want to start?",
                    "textVi": "Chào buổi sáng mọi người! Bắt đầu buổi standup hàng ngày nhé. Alex, bạn có muốn bắt đầu trước không?"
                },
                {
                    "speaker": "user",
                    "roleName": "Developer",
                    "textEn": "Sure! Yesterday, I finished implementing the search filter component and submitted the pull request for review.",
                    "textVi": "Được chứ! Hôm qua tôi đã làm xong component bộ lọc tìm kiếm và đã gửi pull request để mọi người review."
                },
                {
                    "speaker": "ai",
                    "roleName": "Scrum Master",
                    "textEn": "Nice work. And what's on your plate for today?",
                    "textVi": "Làm tốt lắm. Thế hôm nay kế hoạch của bạn là gì?"
                },
                {
                    "speaker": "user",
                    "roleName": "Developer",
                    "textEn": "Today, I'll be working on writing unit tests for the speech recognition module, and I plan to wrap that up by 3 PM.",
                    "textVi": "Hôm nay tôi sẽ viết unit test cho mô-đun nhận diện giọng nói, và dự kiến sẽ xong trước 3 giờ chiều."
                },
                {
                    "speaker": "ai",
                    "roleName": "Scrum Master",
                    "textEn": "Sounds like a solid plan. Any blockers or dependencies slowing you down?",
                    "textVi": "Kế hoạch rất rõ ràng. Có blocker hay phụ thuộc nào đang làm chậm tiến độ của bạn không?"
                },
                {
                    "speaker": "user",
                    "roleName": "Developer",
                    "textEn": "No major blockers. I just need someone from the backend team to review my PR when they have 10 minutes free.",
                    "textVi": "Không có vướng mắc gì lớn. Tôi chỉ cần một bạn bên team backend tranh thủ xem giúp tôi cái PR khi có 10 phút rảnh thôi."
                },
                {
                    "speaker": "ai",
                    "roleName": "Scrum Master",
                    "textEn": "I'll take a look at your PR right after this call. Thanks Alex!",
                    "textVi": "Tôi sẽ xem qua PR của bạn ngay sau cuộc gọi này nhé. Cảm ơn Alex!"
                }
            ],
            "suggestedHints": [
                "Yesterday I finished the user authentication flow.",
                "Today I'm planning to work on the UI components and bug fixes.",
                "I'm blocked by the missing API documentation from the DevOps team.",
                "Everything is on track for tomorrow's demo."
            ]
        },
        {
            "id": "workplace-scenario-2",
            "order": 2,
            "section": "🤝 Hỗ trợ & Review code (Collaboration & Code Review)",
            "titleEn": "Asking for Code Review & Pairing",
            "titleVi": "Nhờ Review Code & Hỗ trợ kỹ thuật",
            "situation": "Bạn gặp một bug hóc búa liên quan đến bộ nhớ hoặc bất đồng bộ. Bạn nhắn tin cho Senior Engineer nhờ họ xem qua Pull Request và pair programming cùng bạn 15 phút.",
            "defaultRoles": {
                "ai": {
                    "id": "ai",
                    "name": "Senior Engineer",
                    "titleEn": "Senior Software Engineer",
                    "titleVi": "Kỹ sư thâm niên (David)",
                    "avatar": "👨‍💻"
                },
                "user": {
                    "id": "user",
                    "name": "Developer",
                    "titleEn": "Developer",
                    "titleVi": "Kỹ sư phần mềm (Bạn)",
                    "avatar": "👤"
                }
            },
            "initialMessageEn": "Hey Alex! Do you have a minute? You pinged me on Slack earlier.",
            "initialMessageVi": "Chào Alex! Bạn có rảnh một lát không? Lúc nãy bạn có nhắn cho tôi trên Slack.",
            "vocabulary": [
                {
                    "id": "vocab-w2-1",
                    "word": "pair programming",
                    "partOfSpeech": "n phr",
                    "ipa": "/per ˈproʊɡræmɪŋ/",
                    "meaningVi": "lập trình đôi (hai lập trình viên cùng ngồi soi code)",
                    "synonyms": ["pairing session (buổi làm việc đôi)"],
                    "antonyms": ["solo coding (tự làm một mình)"],
                    "collocations": [
                        "hop on a quick pair programming call: vào một cuộc gọi lập trình đôi nhanh"
                    ],
                    "exampleEn": "Would you mind hopping on a 15-minute pairing session to look at this bug?",
                    "exampleVi": "Bạn có phiền vào cuộc gọi đôi 15 phút để cùng xem con bug này được không?"
                },
                {
                    "id": "vocab-w2-2",
                    "word": "reproduce",
                    "partOfSpeech": "v",
                    "ipa": "/ˌriːprəˈduːs/",
                    "meaningVi": "tái hiện lại lỗi (bug)",
                    "synonyms": ["replicate (tái lập lại hiện tượng)"],
                    "antonyms": [],
                    "collocations": [
                        "steps to reproduce: các bước để tái hiện lỗi",
                        "hard to reproduce: lỗi chập chờn khó tái hiện"
                    ],
                    "exampleEn": "I was able to reproduce the crash consistently on mobile Safari.",
                    "exampleVi": "Tôi đã tái hiện được lỗi crash một cách ổn định trên trình duyệt Safari điện thoại."
                },
                {
                    "id": "vocab-w2-3",
                    "word": "edge case",
                    "partOfSpeech": "n",
                    "ipa": "/edʒ keɪs/",
                    "meaningVi": "trường hợp biên / ngoại lệ hiếm khi xảy ra nhưng vẫn gây lỗi",
                    "synonyms": ["corner case (trường hợp góc hiểm)", "boundary condition (điều kiện biên)"],
                    "antonyms": ["happy path (luồng chuẩn thuận lợi)"],
                    "collocations": [
                        "handle edge cases: xử lý các trường hợp ngoại lệ",
                        "uncovered edge case: trường hợp biên chưa được kiểm thử"
                    ],
                    "exampleEn": "Make sure your function handles edge cases like empty strings or null inputs.",
                    "exampleVi": "Hãy đảm bảo hàm của bạn xử lý được các trường hợp biên như chuỗi rỗng hay giá trị null."
                }
            ],
            "sampleDialogue": [
                {
                    "speaker": "ai",
                    "roleName": "Senior Engineer",
                    "textEn": "Hey Alex! Do you have a minute? You pinged me on Slack earlier.",
                    "textVi": "Chào Alex! Bạn có rảnh một lát không? Lúc nãy bạn có nhắn cho tôi trên Slack."
                },
                {
                    "speaker": "user",
                    "roleName": "Developer",
                    "textEn": "Hey David, thanks for getting back to me! I opened PR #142 for the audio recording feature, and I'm running into a strange race condition on mobile.",
                    "textVi": "Chào David, cảm ơn bạn đã phản hồi! Tôi vừa mở PR số 142 cho tính năng ghi âm giọng nói, và đang gặp hiện tượng race condition khá lạ trên mobile."
                },
                {
                    "speaker": "ai",
                    "roleName": "Senior Engineer",
                    "textEn": "Interesting. Were you able to reproduce it consistently in local development?",
                    "textVi": "Thú vị đấy. Bạn có tái hiện được lỗi một cách ổn định ở môi trường dev local không?"
                },
                {
                    "speaker": "user",
                    "roleName": "Developer",
                    "textEn": "Yes, it happens whenever a user taps the mic button twice in rapid succession before the stream initializes.",
                    "textVi": "Có, nó xảy ra bất cứ khi nào người dùng bấm nút mic 2 lần liên tiếp thật nhanh trước khi luồng âm thanh kịp khởi tạo."
                },
                {
                    "speaker": "ai",
                    "roleName": "Senior Engineer",
                    "textEn": "Classic edge case! It sounds like the state cleanup isn't canceling the previous audio stream promise. Want to share your screen?",
                    "textVi": "Đúng ca edge case kinh điển rồi! Nghe có vẻ như hàm cleanup state chưa hủy promise của luồng audio trước đó. Bạn chia sẻ màn hình đi?"
                },
                {
                    "speaker": "user",
                    "roleName": "Developer",
                    "textEn": "Sure, sharing my screen now! Look at lines 45 to 60 in speech.ts.",
                    "textVi": "Vâng, tôi chia sẻ màn hình ngay đây! Bạn nhìn dòng 45 đến 60 trong file speech.ts nhé."
                }
            ],
            "suggestedHints": [
                "Could you take a quick look at my pull request when you have time?",
                "I'm running into an unexpected issue with this API endpoint.",
                "Would you mind hopping on a quick 10-minute call to pair on this bug?",
                "Could you give me your thoughts on this architecture decision?"
            ]
        },
        {
            "id": "workplace-scenario-3",
            "order": 3,
            "section": "⏳ Tiến độ & Đàm phán Deadline (Deadlines & Scoping)",
            "titleEn": "Discussing Deadlines & Pushing Back",
            "titleVi": "Báo trễ tiến độ & Đàm phán dời Deadline",
            "situation": "Do phát sinh vấn đề bảo mật phức tạp từ bên thứ ba, bạn nhận thấy không thể bàn giao tính năng đúng hạn thứ Sáu này. Bạn trao đổi với Project Manager một cách chuyên nghiệp, đưa ra phương án giải quyết và đề xuất dời deadline.",
            "defaultRoles": {
                "ai": {
                    "id": "ai",
                    "name": "Project Manager",
                    "titleEn": "Project Manager",
                    "titleVi": "Quản lý Dự án (Emily)",
                    "avatar": "📊"
                },
                "user": {
                    "id": "user",
                    "name": "Developer",
                    "titleEn": "Developer",
                    "titleVi": "Kỹ sư phần mềm (Bạn)",
                    "avatar": "👤"
                }
            },
            "initialMessageEn": "Hi Alex, just checking in regarding Friday's release. Are we still on track to deploy the user export feature?",
            "initialMessageVi": "Chào Alex, tôi muốn kiểm tra chút về đợt phát hành thứ Sáu này. Tính năng xuất dữ liệu người dùng có còn đúng tiến độ để deploy không bạn?",
            "vocabulary": [
                {
                    "id": "vocab-w3-1",
                    "word": "push back",
                    "partOfSpeech": "v phr",
                    "ipa": "/pʊʃ bæk/",
                    "meaningVi": "lùi lại / hoãn lại (thời hạn, deadline)",
                    "synonyms": ["postpone (hoãn lại)", "extend the deadline (gia hạn deadline)", "delay (làm chậm)"],
                    "antonyms": ["move up (đẩy sớm lịch)", "expedite (đẩy nhanh tiến độ)"],
                    "collocations": [
                        "push back the release date: lùi ngày phát hành",
                        "push back on requirements: thương lượng giảm bớt yêu cầu"
                    ],
                    "exampleEn": "I recommend pushing back the deployment by two days to ensure proper security testing.",
                    "exampleVi": "Tôi đề xuất lùi ngày triển khai lại hai ngày để đảm bảo kiểm thử bảo mật kỹ càng."
                },
                {
                    "id": "vocab-w3-2",
                    "word": "scope",
                    "partOfSpeech": "n",
                    "ipa": "/skoʊp/",
                    "meaningVi": "phạm vi công việc / tính năng của dự án",
                    "synonyms": ["project boundaries (ranh giới dự án)"],
                    "antonyms": [],
                    "collocations": [
                        "scope creep: tình trạng phạm vi dự án phình to mất kiểm soát",
                        "reduce the scope: cắt giảm bớt phạm vi tính năng"
                    ],
                    "exampleEn": "We could reduce the scope for this release and ship the advanced filters in phase 2.",
                    "exampleVi": "Chúng ta có thể cắt giảm phạm vi cho đợt release này và dời tính năng lọc nâng cao sang giai đoạn 2."
                },
                {
                    "id": "vocab-w3-3",
                    "word": "unforeseen",
                    "partOfSpeech": "adj",
                    "ipa": "/ˌʌnfɔːrˈsiːn/",
                    "meaningVi": "không lường trước được / bất ngờ phát sinh",
                    "synonyms": ["unexpected (bất ngờ)", "unanticipated (chưa tính tới)"],
                    "antonyms": ["foreseen (đã dự tính trước)", "anticipated (trong dự liệu)"],
                    "collocations": [
                        "unforeseen technical complication: trục trặc kỹ thuật phát sinh ngoài dự kiến",
                        "unforeseen bug: lỗi bất ngờ"
                    ],
                    "exampleEn": "Due to some unforeseen complications with the legacy database, we need more testing time.",
                    "exampleVi": "Do một số trục trặc kỹ thuật phát sinh ngoài dự kiến với cơ sở dữ liệu cũ, chúng tôi cần thêm thời gian để kiểm thử."
                }
            ],
            "sampleDialogue": [
                {
                    "speaker": "ai",
                    "roleName": "Project Manager",
                    "textEn": "Hi Alex, just checking in regarding Friday's release. Are we still on track to deploy the user export feature?",
                    "textVi": "Chào Alex, tôi muốn kiểm tra chút về đợt phát hành thứ Sáu này. Tính năng xuất dữ liệu người dùng có còn đúng tiến độ để deploy không bạn?"
                },
                {
                    "speaker": "user",
                    "roleName": "Developer",
                    "textEn": "Hi Emily, thanks for checking in. To be transparent, we hit an unforeseen technical complication with data privacy compliance yesterday.",
                    "textVi": "Chào Emily, cảm ơn bạn đã quan tâm. Để thẳng thắn và minh bạch thì hôm qua chúng tôi vấp phải một trục trặc kỹ thuật phát sinh ngoài dự kiến liên quan đến bảo mật quyền riêng tư dữ liệu."
                },
                {
                    "speaker": "ai",
                    "roleName": "Project Manager",
                    "textEn": "Oh, that sounds critical. What does this mean for our Friday delivery timeline?",
                    "textVi": "Ôi, nghe có vẻ nghiêm trọng đấy. Thế điều này ảnh hưởng thế nào đến mốc bàn giao thứ Sáu của chúng ta?"
                },
                {
                    "speaker": "user",
                    "roleName": "Developer",
                    "textEn": "If we rush it for Friday, there is a high risk of leaking sensitive fields. I strongly recommend either pushing back the release to Tuesday, or reducing the scope to export public profiles only for now.",
                    "textVi": "Nếu cố ép phát hành vào thứ Sáu, nguy cơ rò rỉ các trường dữ liệu nhạy cảm là rất cao. Tôi tha thiết đề xuất hoặc là lùi ngày phát hành sang thứ Ba, hoặc giảm phạm vi chỉ cho xuất dữ liệu hồ sơ công khai trước."
                },
                {
                    "speaker": "ai",
                    "roleName": "Project Manager",
                    "textEn": "I appreciate you flagging this early. Quality and security always come first. Let's push back the release to Tuesday next week so you have enough breathing room to test.",
                    "textVi": "Tôi rất cảm kích vì bạn đã báo sớm vấn đề này. Chất lượng và bảo mật luôn luôn là ưu tiên hàng đầu. Chúng ta sẽ lùi lịch sang thứ Ba tuần sau để các bạn có đủ thời gian kiểm thử an tâm nhé."
                },
                {
                    "speaker": "user",
                    "roleName": "Developer",
                    "textEn": "Thank you Emily! I'll update the Jira ticket status and share a detailed test plan by tomorrow morning.",
                    "textVi": "Cảm ơn Emily! Tôi sẽ cập nhật trạng thái trên Jira và gửi kế hoạch kiểm thử chi tiết trước sáng mai nhé."
                }
            ],
            "suggestedHints": [
                "To be transparent, we ran into an unforeseen complication with the legacy code.",
                "I recommend pushing back the deployment date by two days.",
                "Alternatively, we could descope the complex filtering for this sprint.",
                "I appreciate your understanding. I will keep you posted on our progress."
            ]
        }
    ]
}
