// Стартовые СЛОВА из личного файла kotoba-words.json (без предложений, без тем).
// Поля: kanji (пусто, если только кана), kana (чтение), russian (варианты через «,»/«;»), pos.
// pos: verb | adjective | noun | adverb | expression | other

export const POS_OPTIONS = [
  { value: "verb", label: "Глаголы" },
  { value: "adjective", label: "Прилагательные" },
  { value: "noun", label: "Существительные" },
  { value: "adverb", label: "Наречия" },
  { value: "expression", label: "Выражения" },
  { value: "other", label: "Другое" },
];

export const SEED_WORDS = [
  {
    "kanji": "行く",
    "kana": "いく",
    "russian": "идти, ехать",
    "pos": "verb"
  },
  {
    "kanji": "来る",
    "kana": "くる",
    "russian": "приходить",
    "pos": "verb"
  },
  {
    "kanji": "帰る",
    "kana": "かえる",
    "russian": "возвращаться домой",
    "pos": "verb"
  },
  {
    "kanji": "歩く",
    "kana": "あるく",
    "russian": "идти пешком",
    "pos": "verb"
  },
  {
    "kanji": "走る",
    "kana": "はしる",
    "russian": "бежать",
    "pos": "verb"
  },
  {
    "kanji": "食べる",
    "kana": "たべる",
    "russian": "есть",
    "pos": "verb"
  },
  {
    "kanji": "飲む",
    "kana": "のむ",
    "russian": "пить",
    "pos": "verb"
  },
  {
    "kanji": "作る",
    "kana": "つくる",
    "russian": "делать, готовить",
    "pos": "verb"
  },
  {
    "kanji": "買う",
    "kana": "かう",
    "russian": "покупать",
    "pos": "verb"
  },
  {
    "kanji": "使う",
    "kana": "つかう",
    "russian": "использовать",
    "pos": "verb"
  },
  {
    "kanji": "持つ",
    "kana": "もつ",
    "russian": "держать, брать с собой",
    "pos": "verb"
  },
  {
    "kanji": "取る",
    "kana": "とる",
    "russian": "брать, доставать",
    "pos": "verb"
  },
  {
    "kanji": "",
    "kana": "あげる",
    "russian": "давать (кому-то)",
    "pos": "verb"
  },
  {
    "kanji": "",
    "kana": "もらう",
    "russian": "получать",
    "pos": "verb"
  },
  {
    "kanji": "",
    "kana": "する",
    "russian": "делать",
    "pos": "verb"
  },
  {
    "kanji": "",
    "kana": "なる",
    "russian": "становиться",
    "pos": "verb"
  },
  {
    "kanji": "分かる",
    "kana": "わかる",
    "russian": "понимать",
    "pos": "verb"
  },
  {
    "kanji": "知る",
    "kana": "しる",
    "russian": "знать",
    "pos": "verb"
  },
  {
    "kanji": "思う",
    "kana": "おもう",
    "russian": "думать, полагать",
    "pos": "verb"
  },
  {
    "kanji": "",
    "kana": "ある",
    "russian": "быть (о вещах)",
    "pos": "verb"
  },
  {
    "kanji": "",
    "kana": "いる",
    "russian": "быть (о людях, животных)",
    "pos": "verb"
  },
  {
    "kanji": "読む",
    "kana": "よむ",
    "russian": "читать",
    "pos": "verb"
  },
  {
    "kanji": "書く",
    "kana": "かく",
    "russian": "писать",
    "pos": "verb"
  },
  {
    "kanji": "話す",
    "kana": "はなす",
    "russian": "говорить, разговаривать",
    "pos": "verb"
  },
  {
    "kanji": "言う",
    "kana": "いう",
    "russian": "сказать",
    "pos": "verb"
  },
  {
    "kanji": "見る",
    "kana": "みる",
    "russian": "смотреть",
    "pos": "verb"
  },
  {
    "kanji": "見える",
    "kana": "みえる",
    "russian": "быть видимым",
    "pos": "verb"
  },
  {
    "kanji": "聞く",
    "kana": "きく",
    "russian": "слушать, спрашивать",
    "pos": "verb"
  },
  {
    "kanji": "聞こえる",
    "kana": "きこえる",
    "russian": "быть слышным",
    "pos": "verb"
  },
  {
    "kanji": "忘れる",
    "kana": "わすれる",
    "russian": "забывать",
    "pos": "verb"
  },
  {
    "kanji": "見つける",
    "kana": "みつける",
    "russian": "находить",
    "pos": "verb"
  },
  {
    "kanji": "見つかる",
    "kana": "みつかる",
    "russian": "находиться (само)",
    "pos": "verb"
  },
  {
    "kanji": "探す",
    "kana": "さがす",
    "russian": "искать",
    "pos": "verb"
  },
  {
    "kanji": "調べる",
    "kana": "しらべる",
    "russian": "выяснять, проверять",
    "pos": "verb"
  },
  {
    "kanji": "借りる",
    "kana": "かりる",
    "russian": "брать взаймы",
    "pos": "verb"
  },
  {
    "kanji": "着く",
    "kana": "つく",
    "russian": "прибывать",
    "pos": "verb"
  },
  {
    "kanji": "寄る",
    "kana": "よる",
    "russian": "заходить по пути",
    "pos": "verb"
  },
  {
    "kanji": "過ごす",
    "kana": "すごす",
    "russian": "проводить (время)",
    "pos": "verb"
  },
  {
    "kanji": "覚める",
    "kana": "さめる",
    "russian": "просыпаться (目が〜)",
    "pos": "verb"
  },
  {
    "kanji": "覚ます",
    "kana": "さます",
    "russian": "будить, прогонять сон",
    "pos": "verb"
  },
  {
    "kanji": "片付ける",
    "kana": "かたづける",
    "russian": "прибирать, раскладывать",
    "pos": "verb"
  },
  {
    "kanji": "止む",
    "kana": "やむ",
    "russian": "прекращаться (о дожде)",
    "pos": "verb"
  },
  {
    "kanji": "開ける",
    "kana": "あける",
    "russian": "открывать",
    "pos": "verb"
  },
  {
    "kanji": "閉める",
    "kana": "しめる",
    "russian": "закрывать",
    "pos": "verb"
  },
  {
    "kanji": "鳴る",
    "kana": "なる",
    "russian": "звонить, звучать",
    "pos": "verb"
  },
  {
    "kanji": "始まる",
    "kana": "はじまる",
    "russian": "начинаться (само)",
    "pos": "verb"
  },
  {
    "kanji": "終わる",
    "kana": "おわる",
    "russian": "заканчиваться (само)",
    "pos": "verb"
  },
  {
    "kanji": "疲れる",
    "kana": "つかれる",
    "russian": "уставать",
    "pos": "verb"
  },
  {
    "kanji": "泳ぐ",
    "kana": "およぐ",
    "russian": "плавать",
    "pos": "verb"
  },
  {
    "kanji": "着る",
    "kana": "きる",
    "russian": "надевать (сверху)",
    "pos": "verb"
  },
  {
    "kanji": "間に合う",
    "kana": "まにあう",
    "russian": "успевать",
    "pos": "verb"
  },
  {
    "kanji": "壊れる",
    "kana": "こわれる",
    "russian": "ломаться (само)",
    "pos": "verb"
  },
  {
    "kanji": "壊す",
    "kana": "こわす",
    "russian": "ломать",
    "pos": "verb"
  },
  {
    "kanji": "手伝う",
    "kana": "てつだう",
    "russian": "помогать",
    "pos": "verb"
  },
  {
    "kanji": "洗う",
    "kana": "あらう",
    "russian": "мыть",
    "pos": "verb"
  },
  {
    "kanji": "考える",
    "kana": "かんがえる",
    "russian": "думать, обдумывать",
    "pos": "verb"
  },
  {
    "kanji": "出かける",
    "kana": "でかける",
    "russian": "выбираться из дома",
    "pos": "verb"
  },
  {
    "kanji": "出る",
    "kana": "でる",
    "russian": "выходить (сам)",
    "pos": "verb"
  },
  {
    "kanji": "出す",
    "kana": "だす",
    "russian": "доставать, отправлять",
    "pos": "verb"
  },
  {
    "kanji": "入る",
    "kana": "はいる",
    "russian": "входить",
    "pos": "verb"
  },
  {
    "kanji": "入れる",
    "kana": "いれる",
    "russian": "класть внутрь",
    "pos": "verb"
  },
  {
    "kanji": "起きる",
    "kana": "おきる",
    "russian": "вставать, подниматься",
    "pos": "verb"
  },
  {
    "kanji": "寝る",
    "kana": "ねる",
    "russian": "ложиться спать",
    "pos": "verb"
  },
  {
    "kanji": "休む",
    "kana": "やすむ",
    "russian": "отдыхать",
    "pos": "verb"
  },
  {
    "kanji": "座る",
    "kana": "すわる",
    "russian": "садиться",
    "pos": "verb"
  },
  {
    "kanji": "待つ",
    "kana": "まつ",
    "russian": "ждать",
    "pos": "verb"
  },
  {
    "kanji": "急ぐ",
    "kana": "いそぐ",
    "russian": "спешить",
    "pos": "verb"
  },
  {
    "kanji": "切る",
    "kana": "きる",
    "russian": "резать",
    "pos": "verb"
  },
  {
    "kanji": "会う",
    "kana": "あう",
    "russian": "встречаться",
    "pos": "verb"
  },
  {
    "kanji": "別れる",
    "kana": "わかれる",
    "russian": "расставаться, прощаться",
    "pos": "verb"
  },
  {
    "kanji": "答える",
    "kana": "こたえる",
    "russian": "отвечать",
    "pos": "verb"
  },
  {
    "kanji": "教える",
    "kana": "おしえる",
    "russian": "учить, объяснять",
    "pos": "verb"
  },
  {
    "kanji": "笑う",
    "kana": "わらう",
    "russian": "смеяться",
    "pos": "verb"
  },
  {
    "kanji": "喜ぶ",
    "kana": "よろこぶ",
    "russian": "радоваться",
    "pos": "verb"
  },
  {
    "kanji": "遊ぶ",
    "kana": "あそぶ",
    "russian": "играть, развлекаться",
    "pos": "verb"
  },
  {
    "kanji": "困る",
    "kana": "こまる",
    "russian": "быть в затруднении",
    "pos": "verb"
  },
  {
    "kanji": "気づく",
    "kana": "きづく",
    "russian": "замечать, осознавать",
    "pos": "verb"
  },
  {
    "kanji": "戻る",
    "kana": "もどる",
    "russian": "возвращаться обратно",
    "pos": "verb"
  },
  {
    "kanji": "泊まる",
    "kana": "とまる",
    "russian": "ночевать, останавливаться",
    "pos": "verb"
  },
  {
    "kanji": "遅れる",
    "kana": "おくれる",
    "russian": "опаздывать",
    "pos": "verb"
  },
  {
    "kanji": "降る",
    "kana": "ふる",
    "russian": "идти (о дожде, снеге)",
    "pos": "verb"
  },
  {
    "kanji": "育てる",
    "kana": "そだてる",
    "russian": "выращивать, растить",
    "pos": "verb"
  },
  {
    "kanji": "捕まえる",
    "kana": "つかまえる",
    "russian": "ловить",
    "pos": "verb"
  },
  {
    "kanji": "",
    "kana": "しまう",
    "russian": "делать до конца; увы (〜てしまう)",
    "pos": "verb"
  },
  {
    "kanji": "勉強する",
    "kana": "べんきょうする",
    "russian": "учиться, заниматься",
    "pos": "verb"
  },
  {
    "kanji": "掃除する",
    "kana": "そうじする",
    "russian": "убираться (чистить)",
    "pos": "verb"
  },
  {
    "kanji": "洗濯する",
    "kana": "せんたくする",
    "russian": "стирать",
    "pos": "verb"
  },
  {
    "kanji": "買い物する",
    "kana": "かいものする",
    "russian": "делать покупки",
    "pos": "verb"
  },
  {
    "kanji": "散歩する",
    "kana": "さんぽする",
    "russian": "гулять",
    "pos": "verb"
  },
  {
    "kanji": "予約する",
    "kana": "よやくする",
    "russian": "бронировать",
    "pos": "verb"
  },
  {
    "kanji": "質問する",
    "kana": "しつもんする",
    "russian": "задавать вопрос",
    "pos": "verb"
  },
  {
    "kanji": "緊張する",
    "kana": "きんちょうする",
    "russian": "нервничать",
    "pos": "verb"
  },
  {
    "kanji": "結婚する",
    "kana": "けっこんする",
    "russian": "жениться, выходить замуж",
    "pos": "verb"
  },
  {
    "kanji": "高い",
    "kana": "たかい",
    "russian": "дорогой; высокий",
    "pos": "adjective"
  },
  {
    "kanji": "白い",
    "kana": "しろい",
    "russian": "белый",
    "pos": "adjective"
  },
  {
    "kanji": "黒い",
    "kana": "くろい",
    "russian": "чёрный",
    "pos": "adjective"
  },
  {
    "kanji": "面白い",
    "kana": "おもしろい",
    "russian": "интересный",
    "pos": "adjective"
  },
  {
    "kanji": "新しい",
    "kana": "あたらしい",
    "russian": "новый",
    "pos": "adjective"
  },
  {
    "kanji": "古い",
    "kana": "ふるい",
    "russian": "старый",
    "pos": "adjective"
  },
  {
    "kanji": "大きい",
    "kana": "おおきい",
    "russian": "большой",
    "pos": "adjective"
  },
  {
    "kanji": "小さい",
    "kana": "ちいさい",
    "russian": "маленький",
    "pos": "adjective"
  },
  {
    "kanji": "広い",
    "kana": "ひろい",
    "russian": "просторный, широкий",
    "pos": "adjective"
  },
  {
    "kanji": "難しい",
    "kana": "むずかしい",
    "russian": "трудный",
    "pos": "adjective"
  },
  {
    "kanji": "楽しい",
    "kana": "たのしい",
    "russian": "весёлый, приятный",
    "pos": "adjective"
  },
  {
    "kanji": "嬉しい",
    "kana": "うれしい",
    "russian": "радостный",
    "pos": "adjective"
  },
  {
    "kanji": "涼しい",
    "kana": "すずしい",
    "russian": "прохладный",
    "pos": "adjective"
  },
  {
    "kanji": "冷たい",
    "kana": "つめたい",
    "russian": "холодный (на ощупь)",
    "pos": "adjective"
  },
  {
    "kanji": "暖かい",
    "kana": "あたたかい",
    "russian": "тёплый",
    "pos": "adjective"
  },
  {
    "kanji": "暑い",
    "kana": "あつい",
    "russian": "жаркий",
    "pos": "adjective"
  },
  {
    "kanji": "寒い",
    "kana": "さむい",
    "russian": "холодный (о погоде)",
    "pos": "adjective"
  },
  {
    "kanji": "甘い",
    "kana": "あまい",
    "russian": "сладкий",
    "pos": "adjective"
  },
  {
    "kanji": "忙しい",
    "kana": "いそがしい",
    "russian": "занятой",
    "pos": "adjective"
  },
  {
    "kanji": "悪い",
    "kana": "わるい",
    "russian": "плохой",
    "pos": "adjective"
  },
  {
    "kanji": "",
    "kana": "いい / よい",
    "russian": "хороший",
    "pos": "adjective"
  },
  {
    "kanji": "",
    "kana": "おいしい",
    "russian": "вкусный",
    "pos": "adjective"
  },
  {
    "kanji": "短い",
    "kana": "みじかい",
    "russian": "короткий",
    "pos": "adjective"
  },
  {
    "kanji": "近い",
    "kana": "ちかい",
    "russian": "близкий",
    "pos": "adjective"
  },
  {
    "kanji": "静か",
    "kana": "しずか",
    "russian": "тихий, спокойный",
    "pos": "adjective"
  },
  {
    "kanji": "簡単",
    "kana": "かんたん",
    "russian": "простой",
    "pos": "adjective"
  },
  {
    "kanji": "",
    "kana": "きれい",
    "russian": "красивый, чистый",
    "pos": "adjective"
  },
  {
    "kanji": "有名",
    "kana": "ゆうめい",
    "russian": "известный",
    "pos": "adjective"
  },
  {
    "kanji": "元気",
    "kana": "げんき",
    "russian": "бодрый, здоровый",
    "pos": "adjective"
  },
  {
    "kanji": "便利",
    "kana": "べんり",
    "russian": "удобный",
    "pos": "adjective"
  },
  {
    "kanji": "大変",
    "kana": "たいへん",
    "russian": "тяжёлый, непростой",
    "pos": "adjective"
  },
  {
    "kanji": "好き",
    "kana": "すき",
    "russian": "любимый, нравится",
    "pos": "adjective"
  },
  {
    "kanji": "駅",
    "kana": "えき",
    "russian": "станция, вокзал",
    "pos": "noun"
  },
  {
    "kanji": "本屋",
    "kana": "ほんや",
    "russian": "книжный магазин",
    "pos": "noun"
  },
  {
    "kanji": "喫茶店",
    "kana": "きっさてん",
    "russian": "кафе",
    "pos": "noun"
  },
  {
    "kanji": "電車",
    "kana": "でんしゃ",
    "russian": "поезд, электричка",
    "pos": "noun"
  },
  {
    "kanji": "空",
    "kana": "そら",
    "russian": "небо",
    "pos": "noun"
  },
  {
    "kanji": "顔",
    "kana": "かお",
    "russian": "лицо",
    "pos": "noun"
  },
  {
    "kanji": "思い出",
    "kana": "おもいで",
    "russian": "воспоминание",
    "pos": "noun"
  },
  {
    "kanji": "教室",
    "kana": "きょうしつ",
    "russian": "класс, аудитория",
    "pos": "noun"
  },
  {
    "kanji": "授業",
    "kana": "じゅぎょう",
    "russian": "урок, занятие",
    "pos": "noun"
  },
  {
    "kanji": "目覚まし時計",
    "kana": "めざましどけい",
    "russian": "будильник",
    "pos": "noun"
  },
  {
    "kanji": "お弁当",
    "kana": "おべんとう",
    "russian": "бэнто, обед с собой",
    "pos": "noun"
  },
  {
    "kanji": "風",
    "kana": "かぜ",
    "russian": "ветер",
    "pos": "noun"
  },
  {
    "kanji": "動画",
    "kana": "どうが",
    "russian": "видео",
    "pos": "noun"
  },
  {
    "kanji": "財布",
    "kana": "さいふ",
    "russian": "кошелёк",
    "pos": "noun"
  },
  {
    "kanji": "田舎",
    "kana": "いなか",
    "russian": "деревня, глубинка",
    "pos": "noun"
  },
  {
    "kanji": "野菜",
    "kana": "やさい",
    "russian": "овощи",
    "pos": "noun"
  },
  {
    "kanji": "川",
    "kana": "かわ",
    "russian": "река",
    "pos": "noun"
  },
  {
    "kanji": "虫",
    "kana": "むし",
    "russian": "насекомое",
    "pos": "noun"
  },
  {
    "kanji": "星",
    "kana": "ほし",
    "russian": "звезда",
    "pos": "noun"
  },
  {
    "kanji": "夏休み",
    "kana": "なつやすみ",
    "russian": "летние каникулы",
    "pos": "noun"
  },
  {
    "kanji": "昼休み",
    "kana": "ひるやすみ",
    "russian": "обеденный перерыв",
    "pos": "noun"
  },
  {
    "kanji": "時計",
    "kana": "とけい",
    "russian": "часы",
    "pos": "noun"
  },
  {
    "kanji": "図書館",
    "kana": "としょかん",
    "russian": "библиотека",
    "pos": "noun"
  },
  {
    "kanji": "公園",
    "kana": "こうえん",
    "russian": "парк",
    "pos": "noun"
  },
  {
    "kanji": "学校",
    "kana": "がっこう",
    "russian": "школа",
    "pos": "noun"
  },
  {
    "kanji": "学生",
    "kana": "がくせい",
    "russian": "студент, учащийся",
    "pos": "noun"
  },
  {
    "kanji": "先生",
    "kana": "せんせい",
    "russian": "учитель",
    "pos": "noun"
  },
  {
    "kanji": "友達",
    "kana": "ともだち",
    "russian": "друг",
    "pos": "noun"
  },
  {
    "kanji": "音楽",
    "kana": "おんがく",
    "russian": "музыка",
    "pos": "noun"
  },
  {
    "kanji": "天気",
    "kana": "てんき",
    "russian": "погода",
    "pos": "noun"
  },
  {
    "kanji": "気持ち",
    "kana": "きもち",
    "russian": "чувство, настроение",
    "pos": "noun"
  },
  {
    "kanji": "言葉",
    "kana": "ことば",
    "russian": "слово, речь",
    "pos": "noun"
  },
  {
    "kanji": "店",
    "kana": "みせ",
    "russian": "магазин, заведение",
    "pos": "noun"
  },
  {
    "kanji": "家",
    "kana": "いえ",
    "russian": "дом",
    "pos": "noun"
  },
  {
    "kanji": "山",
    "kana": "やま",
    "russian": "гора",
    "pos": "noun"
  },
  {
    "kanji": "海",
    "kana": "うみ",
    "russian": "море",
    "pos": "noun"
  },
  {
    "kanji": "道",
    "kana": "みち",
    "russian": "дорога",
    "pos": "noun"
  },
  {
    "kanji": "部屋",
    "kana": "へや",
    "russian": "комната",
    "pos": "noun"
  },
  {
    "kanji": "今朝",
    "kana": "けさ",
    "russian": "сегодня утром",
    "pos": "adverb"
  },
  {
    "kanji": "今晩",
    "kana": "こんばん",
    "russian": "сегодня вечером",
    "pos": "adverb"
  },
  {
    "kanji": "昨日",
    "kana": "きのう",
    "russian": "вчера",
    "pos": "adverb"
  },
  {
    "kanji": "今日",
    "kana": "きょう",
    "russian": "сегодня",
    "pos": "adverb"
  },
  {
    "kanji": "明日",
    "kana": "あした",
    "russian": "завтра",
    "pos": "adverb"
  },
  {
    "kanji": "一昨日",
    "kana": "おととい",
    "russian": "позавчера",
    "pos": "adverb"
  },
  {
    "kanji": "明後日",
    "kana": "あさって",
    "russian": "послезавтра",
    "pos": "adverb"
  },
  {
    "kanji": "先週",
    "kana": "せんしゅう",
    "russian": "на прошлой неделе",
    "pos": "adverb"
  },
  {
    "kanji": "今週",
    "kana": "こんしゅう",
    "russian": "на этой неделе",
    "pos": "adverb"
  },
  {
    "kanji": "来週",
    "kana": "らいしゅう",
    "russian": "на следующей неделе",
    "pos": "adverb"
  },
  {
    "kanji": "先月",
    "kana": "せんげつ",
    "russian": "в прошлом месяце",
    "pos": "adverb"
  },
  {
    "kanji": "来月",
    "kana": "らいげつ",
    "russian": "в следующем месяце",
    "pos": "adverb"
  },
  {
    "kanji": "去年",
    "kana": "きょねん",
    "russian": "в прошлом году",
    "pos": "adverb"
  },
  {
    "kanji": "今年",
    "kana": "ことし",
    "russian": "в этом году",
    "pos": "adverb"
  },
  {
    "kanji": "来年",
    "kana": "らいねん",
    "russian": "в следующем году",
    "pos": "adverb"
  },
  {
    "kanji": "毎日",
    "kana": "まいにち",
    "russian": "каждый день",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "とても",
    "russian": "очень",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "いつも",
    "russian": "всегда",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "よく",
    "russian": "часто; хорошо",
    "pos": "adverb"
  },
  {
    "kanji": "少し",
    "kana": "すこし",
    "russian": "немного",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "ずっと",
    "russian": "всё время; намного",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "たぶん",
    "russian": "наверное",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "また",
    "russian": "снова, опять",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "やっと",
    "russian": "наконец",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "すぐに",
    "russian": "сразу",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "ゆっくり",
    "russian": "неспешно, спокойно",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "あまり〜ない",
    "russian": "не очень",
    "pos": "adverb"
  },
  {
    "kanji": "全然〜ない",
    "kana": "ぜんぜん〜ない",
    "russian": "совсем не",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "たくさん",
    "russian": "много",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "もう",
    "russian": "уже",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "まだ",
    "russian": "ещё",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "これから",
    "russian": "отныне, с этого момента",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "それから",
    "russian": "затем, после этого",
    "pos": "adverb"
  },
  {
    "kanji": "久しぶりに",
    "kana": "ひさしぶりに",
    "russian": "впервые за долгое время",
    "pos": "adverb"
  },
  {
    "kanji": "一度",
    "kana": "いちど",
    "russian": "один раз, однажды",
    "pos": "adverb"
  },
  {
    "kanji": "立つ",
    "kana": "たつ",
    "russian": "стоять",
    "pos": "verb"
  },
  {
    "kanji": "飛ぶ",
    "kana": "とぶ",
    "russian": "летать; прыгать",
    "pos": "verb"
  },
  {
    "kanji": "押す",
    "kana": "おす",
    "russian": "нажимать; толкать",
    "pos": "verb"
  },
  {
    "kanji": "引く",
    "kana": "ひく",
    "russian": "тянуть",
    "pos": "verb"
  },
  {
    "kanji": "消す",
    "kana": "けす",
    "russian": "выключать; стирать",
    "pos": "verb"
  },
  {
    "kanji": "つける",
    "kana": "つける",
    "russian": "включать",
    "pos": "verb"
  },
  {
    "kanji": "貸す",
    "kana": "かす",
    "russian": "одалживать (кому-то)",
    "pos": "verb"
  },
  {
    "kanji": "返す",
    "kana": "かえす",
    "russian": "возвращать (что-то)",
    "pos": "verb"
  },
  {
    "kanji": "送る",
    "kana": "おくる",
    "russian": "отправлять; провожать",
    "pos": "verb"
  },
  {
    "kanji": "選ぶ",
    "kana": "えらぶ",
    "russian": "выбирать",
    "pos": "verb"
  },
  {
    "kanji": "決める",
    "kana": "きめる",
    "russian": "решать",
    "pos": "verb"
  },
  {
    "kanji": "集める",
    "kana": "あつめる",
    "russian": "собирать",
    "pos": "verb"
  },
  {
    "kanji": "並ぶ",
    "kana": "ならぶ",
    "russian": "выстраиваться в ряд",
    "pos": "verb"
  },
  {
    "kanji": "生まれる",
    "kana": "うまれる",
    "russian": "рождаться",
    "pos": "verb"
  },
  {
    "kanji": "死ぬ",
    "kana": "しぬ",
    "russian": "умирать",
    "pos": "verb"
  },
  {
    "kanji": "泣く",
    "kana": "なく",
    "russian": "плакать",
    "pos": "verb"
  },
  {
    "kanji": "怒る",
    "kana": "おこる",
    "russian": "сердиться",
    "pos": "verb"
  },
  {
    "kanji": "驚く",
    "kana": "おどろく",
    "russian": "удивляться",
    "pos": "verb"
  },
  {
    "kanji": "止める",
    "kana": "とめる",
    "russian": "останавливать (что-то)",
    "pos": "verb"
  },
  {
    "kanji": "続ける",
    "kana": "つづける",
    "russian": "продолжать",
    "pos": "verb"
  },
  {
    "kanji": "働く",
    "kana": "はたらく",
    "russian": "работать",
    "pos": "verb"
  },
  {
    "kanji": "住む",
    "kana": "すむ",
    "russian": "жить, проживать",
    "pos": "verb"
  },
  {
    "kanji": "呼ぶ",
    "kana": "よぶ",
    "russian": "звать",
    "pos": "verb"
  },
  {
    "kanji": "見せる",
    "kana": "みせる",
    "russian": "показывать",
    "pos": "verb"
  },
  {
    "kanji": "習う",
    "kana": "ならう",
    "russian": "учиться (у кого-то)",
    "pos": "verb"
  },
  {
    "kanji": "覚える",
    "kana": "おぼえる",
    "russian": "запоминать",
    "pos": "verb"
  },
  {
    "kanji": "頼む",
    "kana": "たのむ",
    "russian": "просить",
    "pos": "verb"
  },
  {
    "kanji": "売る",
    "kana": "うる",
    "russian": "продавать",
    "pos": "verb"
  },
  {
    "kanji": "払う",
    "kana": "はらう",
    "russian": "платить",
    "pos": "verb"
  },
  {
    "kanji": "動く",
    "kana": "うごく",
    "russian": "двигаться",
    "pos": "verb"
  },
  {
    "kanji": "運ぶ",
    "kana": "はこぶ",
    "russian": "нести, перевозить",
    "pos": "verb"
  },
  {
    "kanji": "届く",
    "kana": "とどく",
    "russian": "доходить, доставляться",
    "pos": "verb"
  },
  {
    "kanji": "練習する",
    "kana": "れんしゅうする",
    "russian": "тренироваться",
    "pos": "verb"
  },
  {
    "kanji": "準備する",
    "kana": "じゅんびする",
    "russian": "готовиться",
    "pos": "verb"
  },
  {
    "kanji": "説明する",
    "kana": "せつめいする",
    "russian": "объяснять",
    "pos": "verb"
  },
  {
    "kanji": "心配する",
    "kana": "しんぱいする",
    "russian": "беспокоиться",
    "pos": "verb"
  },
  {
    "kanji": "約束する",
    "kana": "やくそくする",
    "russian": "обещать",
    "pos": "verb"
  },
  {
    "kanji": "旅行する",
    "kana": "りょこうする",
    "russian": "путешествовать",
    "pos": "verb"
  },
  {
    "kanji": "安い",
    "kana": "やすい",
    "russian": "дешёвый",
    "pos": "adjective"
  },
  {
    "kanji": "長い",
    "kana": "ながい",
    "russian": "длинный",
    "pos": "adjective"
  },
  {
    "kanji": "低い",
    "kana": "ひくい",
    "russian": "низкий",
    "pos": "adjective"
  },
  {
    "kanji": "狭い",
    "kana": "せまい",
    "russian": "тесный, узкий",
    "pos": "adjective"
  },
  {
    "kanji": "重い",
    "kana": "おもい",
    "russian": "тяжёлый",
    "pos": "adjective"
  },
  {
    "kanji": "軽い",
    "kana": "かるい",
    "russian": "лёгкий",
    "pos": "adjective"
  },
  {
    "kanji": "強い",
    "kana": "つよい",
    "russian": "сильный",
    "pos": "adjective"
  },
  {
    "kanji": "弱い",
    "kana": "よわい",
    "russian": "слабый",
    "pos": "adjective"
  },
  {
    "kanji": "速い",
    "kana": "はやい",
    "russian": "быстрый",
    "pos": "adjective"
  },
  {
    "kanji": "遅い",
    "kana": "おそい",
    "russian": "медленный; поздний",
    "pos": "adjective"
  },
  {
    "kanji": "遠い",
    "kana": "とおい",
    "russian": "далёкий",
    "pos": "adjective"
  },
  {
    "kanji": "多い",
    "kana": "おおい",
    "russian": "многочисленный",
    "pos": "adjective"
  },
  {
    "kanji": "少ない",
    "kana": "すくない",
    "russian": "немногочисленный",
    "pos": "adjective"
  },
  {
    "kanji": "赤い",
    "kana": "あかい",
    "russian": "красный",
    "pos": "adjective"
  },
  {
    "kanji": "青い",
    "kana": "あおい",
    "russian": "синий",
    "pos": "adjective"
  },
  {
    "kanji": "若い",
    "kana": "わかい",
    "russian": "молодой",
    "pos": "adjective"
  },
  {
    "kanji": "辛い",
    "kana": "からい",
    "russian": "острый",
    "pos": "adjective"
  },
  {
    "kanji": "汚い",
    "kana": "きたない",
    "russian": "грязный",
    "pos": "adjective"
  },
  {
    "kanji": "痛い",
    "kana": "いたい",
    "russian": "болит, больной",
    "pos": "adjective"
  },
  {
    "kanji": "危ない",
    "kana": "あぶない",
    "russian": "опасный",
    "pos": "adjective"
  },
  {
    "kanji": "優しい",
    "kana": "やさしい",
    "russian": "добрый; лёгкий",
    "pos": "adjective"
  },
  {
    "kanji": "暗い",
    "kana": "くらい",
    "russian": "тёмный",
    "pos": "adjective"
  },
  {
    "kanji": "大切",
    "kana": "たいせつ",
    "russian": "важный",
    "pos": "adjective"
  },
  {
    "kanji": "大丈夫",
    "kana": "だいじょうぶ",
    "russian": "в порядке, ничего страшного",
    "pos": "adjective"
  },
  {
    "kanji": "上手",
    "kana": "じょうず",
    "russian": "умелый",
    "pos": "adjective"
  },
  {
    "kanji": "下手",
    "kana": "へた",
    "russian": "неумелый",
    "pos": "adjective"
  },
  {
    "kanji": "暇",
    "kana": "ひま",
    "russian": "свободный (о времени)",
    "pos": "adjective"
  },
  {
    "kanji": "親切",
    "kana": "しんせつ",
    "russian": "добрый, любезный",
    "pos": "adjective"
  },
  {
    "kanji": "必要",
    "kana": "ひつよう",
    "russian": "нужный, необходимый",
    "pos": "adjective"
  },
  {
    "kanji": "安全",
    "kana": "あんぜん",
    "russian": "безопасный",
    "pos": "adjective"
  },
  {
    "kanji": "水",
    "kana": "みず",
    "russian": "вода",
    "pos": "noun"
  },
  {
    "kanji": "お茶",
    "kana": "おちゃ",
    "russian": "чай",
    "pos": "noun"
  },
  {
    "kanji": "ご飯",
    "kana": "ごはん",
    "russian": "рис; еда",
    "pos": "noun"
  },
  {
    "kanji": "肉",
    "kana": "にく",
    "russian": "мясо",
    "pos": "noun"
  },
  {
    "kanji": "魚",
    "kana": "さかな",
    "russian": "рыба",
    "pos": "noun"
  },
  {
    "kanji": "卵",
    "kana": "たまご",
    "russian": "яйцо",
    "pos": "noun"
  },
  {
    "kanji": "果物",
    "kana": "くだもの",
    "russian": "фрукты",
    "pos": "noun"
  },
  {
    "kanji": "手",
    "kana": "て",
    "russian": "рука",
    "pos": "noun"
  },
  {
    "kanji": "足",
    "kana": "あし",
    "russian": "нога",
    "pos": "noun"
  },
  {
    "kanji": "目",
    "kana": "め",
    "russian": "глаз",
    "pos": "noun"
  },
  {
    "kanji": "頭",
    "kana": "あたま",
    "russian": "голова",
    "pos": "noun"
  },
  {
    "kanji": "体",
    "kana": "からだ",
    "russian": "тело",
    "pos": "noun"
  },
  {
    "kanji": "犬",
    "kana": "いぬ",
    "russian": "собака",
    "pos": "noun"
  },
  {
    "kanji": "猫",
    "kana": "ねこ",
    "russian": "кошка",
    "pos": "noun"
  },
  {
    "kanji": "鳥",
    "kana": "とり",
    "russian": "птица",
    "pos": "noun"
  },
  {
    "kanji": "花",
    "kana": "はな",
    "russian": "цветок",
    "pos": "noun"
  },
  {
    "kanji": "木",
    "kana": "き",
    "russian": "дерево",
    "pos": "noun"
  },
  {
    "kanji": "雨",
    "kana": "あめ",
    "russian": "дождь",
    "pos": "noun"
  },
  {
    "kanji": "雪",
    "kana": "ゆき",
    "russian": "снег",
    "pos": "noun"
  },
  {
    "kanji": "車",
    "kana": "くるま",
    "russian": "машина",
    "pos": "noun"
  },
  {
    "kanji": "自転車",
    "kana": "じてんしゃ",
    "russian": "велосипед",
    "pos": "noun"
  },
  {
    "kanji": "病院",
    "kana": "びょういん",
    "russian": "больница",
    "pos": "noun"
  },
  {
    "kanji": "銀行",
    "kana": "ぎんこう",
    "russian": "банк",
    "pos": "noun"
  },
  {
    "kanji": "会社",
    "kana": "かいしゃ",
    "russian": "компания, фирма",
    "pos": "noun"
  },
  {
    "kanji": "仕事",
    "kana": "しごと",
    "russian": "работа",
    "pos": "noun"
  },
  {
    "kanji": "名前",
    "kana": "なまえ",
    "russian": "имя",
    "pos": "noun"
  },
  {
    "kanji": "手紙",
    "kana": "てがみ",
    "russian": "письмо",
    "pos": "noun"
  },
  {
    "kanji": "お金",
    "kana": "おかね",
    "russian": "деньги",
    "pos": "noun"
  },
  {
    "kanji": "時間",
    "kana": "じかん",
    "russian": "время",
    "pos": "noun"
  },
  {
    "kanji": "今",
    "kana": "いま",
    "russian": "сейчас",
    "pos": "noun"
  },
  {
    "kanji": "春",
    "kana": "はる",
    "russian": "весна",
    "pos": "noun"
  },
  {
    "kanji": "夏",
    "kana": "なつ",
    "russian": "лето",
    "pos": "noun"
  },
  {
    "kanji": "秋",
    "kana": "あき",
    "russian": "осень",
    "pos": "noun"
  },
  {
    "kanji": "冬",
    "kana": "ふゆ",
    "russian": "зима",
    "pos": "noun"
  },
  {
    "kanji": "色",
    "kana": "いろ",
    "russian": "цвет",
    "pos": "noun"
  },
  {
    "kanji": "声",
    "kana": "こえ",
    "russian": "голос",
    "pos": "noun"
  },
  {
    "kanji": "宿題",
    "kana": "しゅくだい",
    "russian": "домашнее задание",
    "pos": "noun"
  },
  {
    "kanji": "漢字",
    "kana": "かんじ",
    "russian": "кандзи, иероглифы",
    "pos": "noun"
  },
  {
    "kanji": "英語",
    "kana": "えいご",
    "russian": "английский язык",
    "pos": "noun"
  },
  {
    "kanji": "日本語",
    "kana": "にほんご",
    "russian": "японский язык",
    "pos": "noun"
  },
  {
    "kanji": "一緒に",
    "kana": "いっしょに",
    "russian": "вместе",
    "pos": "adverb"
  },
  {
    "kanji": "初めて",
    "kana": "はじめて",
    "russian": "впервые",
    "pos": "adverb"
  },
  {
    "kanji": "本当に",
    "kana": "ほんとうに",
    "russian": "по-настоящему, действительно",
    "pos": "adverb"
  },
  {
    "kanji": "特に",
    "kana": "とくに",
    "russian": "особенно",
    "pos": "adverb"
  },
  {
    "kanji": "例えば",
    "kana": "たとえば",
    "russian": "например",
    "pos": "adverb"
  },
  {
    "kanji": "もっと",
    "kana": "もっと",
    "russian": "больше, ещё",
    "pos": "adverb"
  },
  {
    "kanji": "一番",
    "kana": "いちばん",
    "russian": "самый, больше всего",
    "pos": "adverb"
  },
  {
    "kanji": "全部",
    "kana": "ぜんぶ",
    "russian": "всё, целиком",
    "pos": "adverb"
  },
  {
    "kanji": "",
    "kana": "おはよう",
    "russian": "доброе утро",
    "pos": "expression"
  },
  {
    "kanji": "",
    "kana": "こんにちは",
    "russian": "здравствуйте",
    "pos": "expression"
  },
  {
    "kanji": "",
    "kana": "こんばんは",
    "russian": "добрый вечер",
    "pos": "expression"
  },
  {
    "kanji": "",
    "kana": "ありがとう",
    "russian": "спасибо",
    "pos": "expression"
  },
  {
    "kanji": "",
    "kana": "すみません",
    "russian": "извините; спасибо (за беспокойство)",
    "pos": "expression"
  },
  {
    "kanji": "",
    "kana": "ごめんなさい",
    "russian": "простите",
    "pos": "expression"
  },
  {
    "kanji": "",
    "kana": "さようなら",
    "russian": "до свидания",
    "pos": "expression"
  },
  {
    "kanji": "",
    "kana": "おやすみなさい",
    "russian": "спокойной ночи",
    "pos": "expression"
  },
  {
    "kanji": "",
    "kana": "いただきます",
    "russian": "«приятного аппетита» (перед едой)",
    "pos": "expression"
  },
  {
    "kanji": "",
    "kana": "ごちそうさま",
    "russian": "спасибо за еду (после)",
    "pos": "expression"
  },
  {
    "kanji": "",
    "kana": "はじめまして",
    "russian": "приятно познакомиться",
    "pos": "expression"
  },
  {
    "kanji": "お願いします",
    "kana": "おねがいします",
    "russian": "пожалуйста (прошу)",
    "pos": "expression"
  },

  // --- ещё ~100 частых прилагательных (i- и な-) ---
  { "kanji": "美しい", "kana": "うつくしい", "russian": "красивый, прекрасный", "pos": "adjective" },
  { "kanji": "悲しい", "kana": "かなしい", "russian": "грустный", "pos": "adjective" },
  { "kanji": "寂しい", "kana": "さびしい", "russian": "одинокий, тоскливо", "pos": "adjective" },
  { "kanji": "怖い", "kana": "こわい", "russian": "страшный", "pos": "adjective" },
  { "kanji": "眠い", "kana": "ねむい", "russian": "сонный", "pos": "adjective" },
  { "kanji": "厳しい", "kana": "きびしい", "russian": "строгий, суровый", "pos": "adjective" },
  { "kanji": "素晴らしい", "kana": "すばらしい", "russian": "замечательный, великолепный", "pos": "adjective" },
  { "kanji": "珍しい", "kana": "めずらしい", "russian": "редкий, необычный", "pos": "adjective" },
  { "kanji": "細かい", "kana": "こまかい", "russian": "мелкий, подробный", "pos": "adjective" },
  { "kanji": "太い", "kana": "ふとい", "russian": "толстый", "pos": "adjective" },
  { "kanji": "細い", "kana": "ほそい", "russian": "тонкий, узкий", "pos": "adjective" },
  { "kanji": "深い", "kana": "ふかい", "russian": "глубокий", "pos": "adjective" },
  { "kanji": "浅い", "kana": "あさい", "russian": "мелкий (неглубокий)", "pos": "adjective" },
  { "kanji": "丸い", "kana": "まるい", "russian": "круглый", "pos": "adjective" },
  { "kanji": "硬い", "kana": "かたい", "russian": "твёрдый, жёсткий", "pos": "adjective" },
  { "kanji": "柔らかい", "kana": "やわらかい", "russian": "мягкий", "pos": "adjective" },
  { "kanji": "明るい", "kana": "あかるい", "russian": "светлый; жизнерадостный", "pos": "adjective" },
  { "kanji": "正しい", "kana": "ただしい", "russian": "правильный", "pos": "adjective" },
  { "kanji": "苦しい", "kana": "くるしい", "russian": "мучительный, тяжело", "pos": "adjective" },
  { "kanji": "", "kana": "ひどい", "russian": "ужасный, жестокий", "pos": "adjective" },
  { "kanji": "", "kana": "すごい", "russian": "потрясающий, круто", "pos": "adjective" },
  { "kanji": "可愛い", "kana": "かわいい", "russian": "милый", "pos": "adjective" },
  { "kanji": "", "kana": "かっこいい", "russian": "крутой, стильный", "pos": "adjective" },
  { "kanji": "気持ちいい", "kana": "きもちいい", "russian": "приятный (по ощущениям)", "pos": "adjective" },
  { "kanji": "", "kana": "つまらない", "russian": "скучный, неинтересный", "pos": "adjective" },
  { "kanji": "酸っぱい", "kana": "すっぱい", "russian": "кислый", "pos": "adjective" },
  { "kanji": "苦い", "kana": "にがい", "russian": "горький", "pos": "adjective" },
  { "kanji": "", "kana": "しょっぱい", "russian": "солёный", "pos": "adjective" },
  { "kanji": "賢い", "kana": "かしこい", "russian": "умный", "pos": "adjective" },
  { "kanji": "恥ずかしい", "kana": "はずかしい", "russian": "стыдно, неловко", "pos": "adjective" },
  { "kanji": "詳しい", "kana": "くわしい", "russian": "подробный; сведущий", "pos": "adjective" },
  { "kanji": "", "kana": "うまい", "russian": "вкусный; умелый", "pos": "adjective" },
  { "kanji": "", "kana": "まずい", "russian": "невкусный; неудачный", "pos": "adjective" },
  { "kanji": "", "kana": "うるさい", "russian": "шумный, надоедливый", "pos": "adjective" },
  { "kanji": "", "kana": "きつい", "russian": "тесный; тяжёлый (о нагрузке)", "pos": "adjective" },
  { "kanji": "緩い", "kana": "ゆるい", "russian": "свободный, слабый (не тугой)", "pos": "adjective" },
  { "kanji": "薄い", "kana": "うすい", "russian": "тонкий; бледный, слабый", "pos": "adjective" },
  { "kanji": "濃い", "kana": "こい", "russian": "густой, крепкий (о вкусе)", "pos": "adjective" },
  { "kanji": "面倒くさい", "kana": "めんどうくさい", "russian": "хлопотный, лень возиться", "pos": "adjective" },
  { "kanji": "賑やか", "kana": "にぎやか", "russian": "оживлённый, людный", "pos": "adjective" },
  { "kanji": "素敵", "kana": "すてき", "russian": "чудесный, прекрасный", "pos": "adjective" },
  { "kanji": "嫌い", "kana": "きらい", "russian": "нелюбимый, неприятный", "pos": "adjective" },
  { "kanji": "", "kana": "いや", "russian": "противный, неохота", "pos": "adjective" },
  { "kanji": "得意", "kana": "とくい", "russian": "хорошо удаётся, конёк", "pos": "adjective" },
  { "kanji": "苦手", "kana": "にがて", "russian": "плохо даётся, не любит", "pos": "adjective" },
  { "kanji": "普通", "kana": "ふつう", "russian": "обычный", "pos": "adjective" },
  { "kanji": "十分", "kana": "じゅうぶん", "russian": "достаточный", "pos": "adjective" },
  { "kanji": "退屈", "kana": "たいくつ", "russian": "скучный", "pos": "adjective" },
  { "kanji": "複雑", "kana": "ふくざつ", "russian": "сложный, запутанный", "pos": "adjective" },
  { "kanji": "地味", "kana": "じみ", "russian": "невзрачный, скромный", "pos": "adjective" },
  { "kanji": "派手", "kana": "はで", "russian": "яркий, броский", "pos": "adjective" },
  { "kanji": "真面目", "kana": "まじめ", "russian": "серьёзный, добросовестный", "pos": "adjective" },
  { "kanji": "失礼", "kana": "しつれい", "russian": "невежливый; извините", "pos": "adjective" },
  { "kanji": "残念", "kana": "ざんねん", "russian": "жаль, досадно", "pos": "adjective" },
  { "kanji": "危険", "kana": "きけん", "russian": "опасный", "pos": "adjective" },
  { "kanji": "特別", "kana": "とくべつ", "russian": "особенный", "pos": "adjective" },
  { "kanji": "自由", "kana": "じゆう", "russian": "свободный", "pos": "adjective" },
  { "kanji": "不便", "kana": "ふべん", "russian": "неудобный", "pos": "adjective" },
  { "kanji": "変", "kana": "へん", "russian": "странный", "pos": "adjective" },
  { "kanji": "無理", "kana": "むり", "russian": "невозможный, чересчур", "pos": "adjective" },
  { "kanji": "駄目", "kana": "だめ", "russian": "нельзя, никуда не годится", "pos": "adjective" },
  { "kanji": "楽", "kana": "らく", "russian": "лёгкий, комфортный", "pos": "adjective" },
  { "kanji": "豊か", "kana": "ゆたか", "russian": "богатый, обильный", "pos": "adjective" },
  { "kanji": "完璧", "kana": "かんぺき", "russian": "идеальный", "pos": "adjective" },
  { "kanji": "正確", "kana": "せいかく", "russian": "точный", "pos": "adjective" },
  { "kanji": "丈夫", "kana": "じょうぶ", "russian": "крепкий, прочный", "pos": "adjective" },
  { "kanji": "幸せ", "kana": "しあわせ", "russian": "счастливый", "pos": "adjective" },
  { "kanji": "貧乏", "kana": "びんぼう", "russian": "бедный", "pos": "adjective" },
  { "kanji": "急", "kana": "きゅう", "russian": "внезапный, срочный", "pos": "adjective" },
  { "kanji": "丁寧", "kana": "ていねい", "russian": "вежливый, аккуратный", "pos": "adjective" },
  { "kanji": "立派", "kana": "りっぱ", "russian": "великолепный, достойный", "pos": "adjective" },
  { "kanji": "確か", "kana": "たしか", "russian": "точный; наверняка", "pos": "adjective" },
  { "kanji": "明らか", "kana": "あきらか", "russian": "очевидный", "pos": "adjective" },
  { "kanji": "大事", "kana": "だいじ", "russian": "важный, ценный", "pos": "adjective" },
  { "kanji": "不安", "kana": "ふあん", "russian": "тревожный, беспокойный", "pos": "adjective" },
  { "kanji": "面倒", "kana": "めんどう", "russian": "хлопотный, обременительный", "pos": "adjective" },
  { "kanji": "迷惑", "kana": "めいわく", "russian": "беспокойство, помеха", "pos": "adjective" },
  { "kanji": "邪魔", "kana": "じゃま", "russian": "помеха, мешающий", "pos": "adjective" },
  { "kanji": "新鮮", "kana": "しんせん", "russian": "свежий", "pos": "adjective" },
  { "kanji": "健康", "kana": "けんこう", "russian": "здоровый", "pos": "adjective" },
  { "kanji": "熱心", "kana": "ねっしん", "russian": "усердный", "pos": "adjective" },
  { "kanji": "貴重", "kana": "きちょう", "russian": "ценный", "pos": "adjective" },

  // --- союзы и частицы (связки): «однако», «зато», «потому что» и т.д. ---
  { "kanji": "", "kana": "しかし", "russian": "однако, но", "pos": "other" },
  { "kanji": "", "kana": "でも", "russian": "но, однако", "pos": "other" },
  { "kanji": "", "kana": "けれど", "russian": "но, однако", "pos": "other" },
  { "kanji": "", "kana": "だから", "russian": "поэтому, так что", "pos": "other" },
  { "kanji": "", "kana": "それで", "russian": "и поэтому, и вот", "pos": "other" },
  { "kanji": "", "kana": "そして", "russian": "и, затем", "pos": "other" },
  { "kanji": "", "kana": "それに", "russian": "к тому же, вдобавок", "pos": "other" },
  { "kanji": "", "kana": "または", "russian": "или", "pos": "other" },
  { "kanji": "", "kana": "あるいは", "russian": "или, либо", "pos": "other" },
  { "kanji": "", "kana": "つまり", "russian": "то есть, иными словами", "pos": "other" },
  { "kanji": "", "kana": "ところで", "russian": "кстати, между прочим", "pos": "other" },
  { "kanji": "", "kana": "ところが", "russian": "однако (неожиданно), но", "pos": "other" },
  { "kanji": "", "kana": "なぜなら", "russian": "потому что (в начале фразы)", "pos": "other" },
  { "kanji": "", "kana": "したがって", "russian": "следовательно, поэтому", "pos": "other" },
  { "kanji": "", "kana": "ただし", "russian": "однако, при этом", "pos": "other" },
  { "kanji": "", "kana": "それとも", "russian": "или же (в вопросе)", "pos": "other" },
  { "kanji": "", "kana": "すると", "russian": "и тогда, после чего", "pos": "other" },
  { "kanji": "", "kana": "じゃあ", "russian": "ну тогда, итак", "pos": "other" },
  { "kanji": "", "kana": "さて", "russian": "итак, ну а теперь", "pos": "other" },
  { "kanji": "", "kana": "ちなみに", "russian": "кстати, к слову", "pos": "other" },
  { "kanji": "その代わり", "kana": "そのかわり", "russian": "зато, взамен", "pos": "other" },
  { "kanji": "一方", "kana": "いっぽう", "russian": "с другой стороны", "pos": "other" },
  { "kanji": "", "kana": "けど", "russian": "но, хотя (разг.)", "pos": "other" },
  { "kanji": "", "kana": "から", "russian": "потому что; из, от", "pos": "other" },
  { "kanji": "", "kana": "ので", "russian": "потому что, так как", "pos": "other" },
  { "kanji": "", "kana": "のに", "russian": "хотя, несмотря на", "pos": "other" },
  { "kanji": "", "kana": "し", "russian": "и к тому же, да и", "pos": "other" },
  { "kanji": "", "kana": "だけ", "russian": "только", "pos": "other" },
  { "kanji": "", "kana": "しか〜ない", "russian": "только (с отрицанием)", "pos": "other" },
  { "kanji": "", "kana": "ばかり", "russian": "только и; около", "pos": "other" },
  { "kanji": "", "kana": "くらい", "russian": "примерно, около", "pos": "other" },
  { "kanji": "", "kana": "ほど", "russian": "настолько; около", "pos": "other" },
  { "kanji": "", "kana": "など", "russian": "и тому подобное", "pos": "other" },
  { "kanji": "", "kana": "とか", "russian": "типа; и то и сё", "pos": "other" },
  { "kanji": "", "kana": "まで", "russian": "до, вплоть до", "pos": "other" },
  { "kanji": "", "kana": "より", "russian": "чем (при сравнении)", "pos": "other" },
  { "kanji": "", "kana": "もし", "russian": "если (в условии)", "pos": "other" },

  // --- первостепенные глаголы (нуждаться, менять, помогать и т.д.) ---
  { "kanji": "要る", "kana": "いる", "russian": "нуждаться, требоваться", "pos": "verb" },
  { "kanji": "始める", "kana": "はじめる", "russian": "начинать (что-то)", "pos": "verb" },
  { "kanji": "続く", "kana": "つづく", "russian": "продолжаться (само)", "pos": "verb" },
  { "kanji": "生きる", "kana": "いきる", "russian": "жить, быть живым", "pos": "verb" },
  { "kanji": "変える", "kana": "かえる", "russian": "менять (что-то)", "pos": "verb" },
  { "kanji": "変わる", "kana": "かわる", "russian": "меняться (само)", "pos": "verb" },
  { "kanji": "感じる", "kana": "かんじる", "russian": "чувствовать", "pos": "verb" },
  { "kanji": "信じる", "kana": "しんじる", "russian": "верить", "pos": "verb" },
  { "kanji": "助ける", "kana": "たすける", "russian": "помогать, спасать", "pos": "verb" },
  { "kanji": "直す", "kana": "なおす", "russian": "чинить, исправлять", "pos": "verb" },
  { "kanji": "歌う", "kana": "うたう", "russian": "петь", "pos": "verb" },
  { "kanji": "楽しむ", "kana": "たのしむ", "russian": "наслаждаться", "pos": "verb" },
  { "kanji": "触る", "kana": "さわる", "russian": "трогать, касаться", "pos": "verb" },
  { "kanji": "電話する", "kana": "でんわする", "russian": "звонить (по телефону)", "pos": "verb" },

  // --- нужное прилагательное ---
  { "kanji": "欲しい", "kana": "ほしい", "russian": "хочу, желаемый (о вещи)", "pos": "adjective" },

  // --- люди и описание человека ---
  { "kanji": "人", "kana": "ひと", "russian": "человек", "pos": "noun" },
  { "kanji": "男", "kana": "おとこ", "russian": "мужчина", "pos": "noun" },
  { "kanji": "女", "kana": "おんな", "russian": "женщина", "pos": "noun" },
  { "kanji": "子供", "kana": "こども", "russian": "ребёнок", "pos": "noun" },
  { "kanji": "大人", "kana": "おとな", "russian": "взрослый", "pos": "noun" },
  { "kanji": "家族", "kana": "かぞく", "russian": "семья", "pos": "noun" },
  { "kanji": "お母さん", "kana": "おかあさん", "russian": "мама", "pos": "noun" },
  { "kanji": "お父さん", "kana": "おとうさん", "russian": "папа", "pos": "noun" },
  { "kanji": "性格", "kana": "せいかく", "russian": "характер", "pos": "noun" },
  { "kanji": "髪", "kana": "かみ", "russian": "волосы", "pos": "noun" },
  { "kanji": "背", "kana": "せ", "russian": "рост", "pos": "noun" },

  // --- цвета ---
  { "kanji": "黄色", "kana": "きいろ", "russian": "жёлтый", "pos": "noun" },
  { "kanji": "緑", "kana": "みどり", "russian": "зелёный", "pos": "noun" },
  { "kanji": "茶色", "kana": "ちゃいろ", "russian": "коричневый", "pos": "noun" },
  { "kanji": "紫", "kana": "むらさき", "russian": "фиолетовый", "pos": "noun" },
  { "kanji": "灰色", "kana": "はいいろ", "russian": "серый", "pos": "noun" },
  { "kanji": "", "kana": "ピンク", "russian": "розовый", "pos": "noun" },
  { "kanji": "", "kana": "オレンジ", "russian": "оранжевый", "pos": "noun" },

  // --- ежедневные слова ---
  { "kanji": "朝", "kana": "あさ", "russian": "утро", "pos": "noun" },
  { "kanji": "昼", "kana": "ひる", "russian": "день, полдень", "pos": "noun" },
  { "kanji": "夜", "kana": "よる", "russian": "ночь, вечер", "pos": "noun" },
  { "kanji": "週末", "kana": "しゅうまつ", "russian": "выходные", "pos": "noun" },
  { "kanji": "電話", "kana": "でんわ", "russian": "телефон", "pos": "noun" },
  { "kanji": "服", "kana": "ふく", "russian": "одежда", "pos": "noun" },
  { "kanji": "靴", "kana": "くつ", "russian": "обувь", "pos": "noun" },
  { "kanji": "台所", "kana": "だいどころ", "russian": "кухня", "pos": "noun" },
  { "kanji": "お風呂", "kana": "おふろ", "russian": "ванна", "pos": "noun" },
  { "kanji": "", "kana": "テレビ", "russian": "телевизор", "pos": "noun" },
];
