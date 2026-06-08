"""
Kanye West — Complete Album & Song Encyclopedia
每张专辑的创作背景 + 每首歌的采样故事和主题表达
"""

# ═══════════════════════════════════════════════════════════
# ALBUM INTRODUCTIONS
# ═══════════════════════════════════════════════════════════

ALBUM_INTROS = {
    "The College Dropout": {
        "era": "2004 · Roc-A-Fella / Def Jam",
        "bio": "Kanye West的首张录音室专辑，彻底改变了嘻哈的面貌。在2002年一场几乎致命的车祸后，Kanye用被钢丝固定的下巴录制了Through the Wire，向世界宣告他的到来。这张专辑打破了当时嘻哈界Gangsta Rap的垄断，用'Chipmunk Soul'——将经典Soul/R&B人声加速变调的技法——重新定义了嘻哈采样艺术。",
        "theme": "辍学、信仰、家庭、社会批判、自我证明",
        "sound": "Chipmunk Soul · 加速人声采样 · 福音和声 · 温暖管弦编排",
        "legacy": "Grammy最佳说唱专辑 · 滚石500大第74位 · 定义了2000年代嘻哈的转折点",
    },
    "Late Registration": {
        "era": "2005 · Roc-A-Fella / Def Jam",
        "bio": "Kanye与电影配乐大师Jon Brion合作，将好莱坞级别的管弦编排注入嘻哈。如果说College Dropout是宿舍里的天才制作，那Late Registration就是走进交响乐大厅的宣言。弦乐四重奏、小号、钢琴、竖琴——这些在嘻哈中罕见的乐器被Kanye和Brion编织成华丽的声景。",
        "theme": "名利、钻石、种族、母爱、街头生活",
        "sound": "交响嘻哈 · Jon Brion管弦编排 · 现场乐器 · 多段式结构",
        "legacy": "Grammy最佳说唱专辑 · Pitchfork 9.5 · '嘻哈与古典的完美联姻'",
    },
    "Graduation": {
        "era": "2007 · Roc-A-Fella / Def Jam",
        "bio": "辍学三部曲的终章。Kanye选择了更电子化、更适合体育馆的声音——合成器、电子鼓、Daft Punk采样。发行日与50 Cent的Curtis正面对决，最终以95.7万首周销量碾压式获胜。这一刻标志着嘻哈从Gangsta时代正式进入Kanye时代。",
        "theme": "成功、野心、成名后的空虚、自我怀疑、兄弟情谊",
        "sound": "体育馆嘻哈 · 电子合成器 · 渐强式编曲 · Murakami视觉艺术",
        "legacy": "Grammy最佳说唱专辑 · 首周95.7万 · 终结Gangsta Rap统治地位",
    },
    "808s and Heartbreak": {
        "era": "2008 · Roc-A-Fella / Def Jam",
        "bio": "母亲Donda West去世、与未婚妻Alexis Phifer分手——2007-2008是Kanye人生最黑暗的时期。他用Roland TR-808鼓机和Auto-Tune人声创造了一张彻底颠覆嘻哈规则的情感唱片。当时被嘻哈纯粹主义者嘲笑，十年后被公认为'定义了接下来十年流行音乐声音的专辑'。没有这张专辑就没有Drake、The Weeknd、Post Malone、Juice WRLD。",
        "theme": "失去、孤独、心碎、麻木、自我毁灭、对母亲的悼念",
        "sound": "808鼓机 · Auto-Tune人声 · 极简电子 · 部落打击乐 · 冰冷合成器",
        "legacy": "改变了流行音乐的声音 · Pitchfork 7.6→10年后再评9.0 · 定义了Emo Rap",
    },
    "My Beautiful Dark Twisted Fantasy": {
        "era": "2010 · Roc-A-Fella / Def Jam",
        "bio": "2009年VMA抢话筒事件后，Kanye被全美唾弃。他自我流放到夏威夷，召集了嘻哈史上最豪华的'梦之队'——JAY-Z、Rick Ross、Nicki Minaj、Bon Iver、Pusha T、Kid Cudi、RZA、Justin Vernon——在Avex Honolulu Studios进行了一场疯狂的创作营。每首歌都被打磨成史诗般的作品，将极简主义和极繁主义同时推向极致。被广泛认为是21世纪最伟大的专辑。",
        "theme": "名声、权力、欲望、自我毁灭、救赎、美国梦的黑暗面",
        "sound": "极繁主义 · 前卫摇滚采样 · 交响编排 · 长篇结构 · 多层次人声叠加",
        "legacy": "Pitchfork 10.0满分 · 滚石500大第17位 · '21世纪最伟大的专辑'",
    },
    "Yeezus": {
        "era": "2013 · Def Jam",
        "bio": "Kanye最激进、最极端的作品。受Minimalism建筑、Daft Punk的电子音乐、Chicago Acid House、以及工业摇滚影响。Rick Rubin在最后时刻被请来做了'极简手术'——砍掉所有多余的元素，只留下最原始的骨架。无传统封面设计（透明CD盒+红色胶带）。这是一张反专辑的专辑。",
        "theme": "种族、愤怒、欲望、消费主义、权力滥用、黑人身份政治",
        "sound": "工业嘻哈 · Minimalism · Acid House · 失真合成器 · 极简编排",
        "legacy": "Pitchfork 9.5 · 开启了工业Trap时代 · 'Kanye的朋克专辑'",
    },
    "The Life of Pablo": {
        "era": "2016 · G.O.O.D. Music / Def Jam",
        "bio": "Kanye最混乱、最分裂、也可能最诚实的专辑。标题改了三次（SWISH→Waves→TLOP），发行后仍在持续更新。这是Kanye的精神分裂式自画像——一半是福音信徒，一半是欲望的奴隶。'which/one'这个封面概念完美概括了这张专辑：Kanye West vs Pablo，圣徒vs罪人。",
        "theme": "信仰vs欲望、家庭vs名利、躁郁症、社交媒体时代的名人困境",
        "sound": "福音采样 · Trap 808 · 碎片化结构 · 多段变速 · 低保真美学",
        "legacy": "定义了Streaming时代的专辑 · 持续更新开创'活专辑'概念 · 最私人的Kanye作品",
    },
    "Ye": {
        "era": "2018 · G.O.O.D. Music / Def Jam",
        "bio": "在怀俄明州Jackson Hole的群山中，Kanye用短短几周录制了这张23分钟的迷你专辑。这是在TMZ奴隶制言论风波后的回应，也是他公开谈论躁郁症的作品。封面由Kanye在前往专辑试听会的路上用iPhone拍摄的怀俄明日落。7首歌、23分钟——这是他最短的专辑，也是最脆弱的一张。",
        "theme": "心理健康、婚姻、躁郁症、言论自由、黑人身份、暴力",
        "sound": "怀俄明之声 · 阳光色调 · 灵魂采样 · 简约编排 · 温暖和声",
        "legacy": "'Kanye最脆弱的作品' · 推动了黑人心理健康讨论 · 7首歌23分钟的极简宣言",
    },
    "Jesus Is King": {
        "era": "2019 · G.O.O.D. Music / Def Jam",
        "bio": "Kanye的福音专辑。在经历了2018年的精神危机和2019年的Coachella Sunday Service系列演出后，Kanye宣布从此只做福音音乐。他组建了Sunday Service Choir——一个数百人的合唱团。这张专辑是他的信/仰告白，所有歌词围绕上帝、救赎和信/仰展开。",
        "theme": "信仰、救赎、上帝、家庭、守安息日、属灵争战",
        "sound": "福音合唱 · 管风琴 · 极简Trap · Sunday Service Choir · 圣经典故",
        "legacy": "Grammy最佳福音专辑 · 开创Sunday Service运动 · Kanye的音乐信仰宣言",
    },
    "Donda": {
        "era": "2021 · G.O.O.D. Music / Def Jam",
        "bio": "以母亲Donda West命名的专辑。Kanye在亚特兰大的Mercedes-Benz Stadium住了数周，将体育场改造成录音室和生活空间。三场大型试听会——每场Kanye都在不断修改专辑。这是Kanye最长、最庞大、最自我沉溺的作品。27首歌，108分钟，宛如一场葬礼、一场复活、一场驱魔。",
        "theme": "母亲、信仰、救赎、婚姻破裂、重生、遗产",
        "sound": "体育场嘻哈 · 福音采样 · 黑暗Trap · 长篇 · 管风琴 · 人声堆叠",
        "legacy": "27首歌的史诗级作品 · 体育场试听会开创了新的专辑发布形式 · 献给母亲的音乐纪念碑",
    },
    "Donda 2": {
        "era": "2022 · Stem Player Exclusive",
        "bio": "Kanye以Stem Player独占形式发行的专辑，完全绕过了传统流媒体平台。由Future担任执行制作人。这张专辑以更私密、更Raw的方式呈现了Kanye在离婚后的情感状态。专辑在不断更新中，只通过Kanye自有的Stem Player设备获取——这是他对音乐产业控制权的又一次挑战。",
        "theme": "离婚、孤独、父亲身份、重生、对音乐产业的批判",
        "sound": "Stem Player分离混音 · Future风格Trap · Raw未完成感 · 实验性编排",
        "legacy": "绕过了所有流媒体平台 · Stem Player独占发行 · 音乐人自主发行的实验",
    },
    "Vultures 1": {
        "era": "2024 · YZY",
        "bio": "Kanye与Ty Dolla $ign的联合专辑三部曲第一章。在经历了2022-2023年的争议和品牌解约后，Kanye以独立姿态回归。专辑延续了黑暗、极简的Trap风格，Ty Dolla $ign的R&B和声为Kanye的粗暴制作提供了柔和的平衡。",
        "theme": "生存、背叛、独立宣言、争议后的重建、街头法则",
        "sound": "暗黑Trap · Ty Dolla $ign R&B和声 · 极简808 · 独立厂牌美学",
        "legacy": "独立发行的宣言 · 与Ty Dolla $ign的化学反应 · 争议后的回归之作",
    },
    "Vultures 2": {
        "era": "2024 · YZY",
        "bio": "Vultures三部曲的第二章。相比Vol.1的黑暗粗糙，Vol.2更富旋律性和实验性。Kanye继续与Ty Dolla $ign探索暗黑Trap的边界，同时加入了更多旋律驱动的编排。专辑中出现了更多客串——Future、Young Thug、Lil Wayne等——像是在召集一支黑暗军团。",
        "theme": "忠诚、权力、暗黑浪漫、兄弟情义、对抗世界",
        "sound": "旋律Trap · 多客串 · 暗黑氛围 · Ty Dolla和声贯穿",
        "legacy": "Vultures三部曲的中章 · 旋律化转型 · 全明星客串阵容",
    },
    "Bully": {
        "era": "2025 · YZY Independent",
        "bio": "Kanye的第14张录音室专辑。在2024-2025年的多重风波后，Kanye以一个'霸凌者'的身份回归——但这里的'Bully'更像是一种反讽，专辑实际探讨的是脆弱、父亲身份和成长。Ye声称这张专辑完全没有使用AI，是对纯粹人声制作的回归。18首歌跨越多个风格，是他最自我反思的作品之一。",
        "theme": "反讽、父亲、成长、脆弱中的力量、艺术纯粹性",
        "sound": "回归人声 · 多元风格融合 · 纯粹制作 · 独立发行",
        "legacy": "YE的自我反思 · No AI宣言 · 最个人化的晚期作品",
    },
}

# ═══════════════════════════════════════════════════════════
# SONG DESCRIPTIONS — themes, sample stories, context
# ═══════════════════════════════════════════════════════════

SONG_DESCRIPTIONS = {
    # ── THE COLLEGE DROPOUT ──
    "k001": {"theme": "开场。Kanye以'辍学生'身份宣告自己的到来。", "context": "采样学校毕业典礼的环境音，直接点题。"},
    "k002": {"theme": "对黑人社区的系统性压迫。'We wasn't supposed to make it past 25'——在贩毒、暴力和贫困中长大的孩子们被社会遗忘。", "context": "采样Jimmy Castor Bunch的I Just Wanna Stop，将70年代Funk的律动与当代社会议题对照。"},
    "k003": {"theme": "过渡桥梁。毕业典礼的氛围音乐。", "context": "引用了Edward Elgar的Pomp and Circumstance毕业进行曲。"},
    "k004": {"theme": "消费主义陷阱。用时尚消费批判美国的物质主义——人们为了看起来有钱而花钱，却不知道真正的贫穷是什么。Syleena Johnson重新演唱了Lauryn Hill的Mystery of Iniquity。", "context": "Lauryn Hill的Mystery of Iniquity采样，因版权问题由Syleena Johnson重新演唱——但这反而让歌曲有了全新的层次。"},
    "k005": {"theme": "逃离。一首关于离开街头生活的灵魂短章。", "context": "传统福音歌曲I'll Fly Away的重新演绎。"},
    "k006": {"theme": "打工人的困境。Kanye讲述在Gap做售货员的经历——有才华却被困在最低工资的工作里。GLC和Consequence的verse同样真实。", "context": "采样Marvin Gaye的Distant Lover，将爱情歌曲转变为对梦想的渴望。"},
    "k007": {"theme": "信仰的力量。这是Kanye最轰动的作品之一——一首关于耶稣的说唱歌曲在充斥着暴力和物质的嘻哈界杀出重围。'如果你敢谈论上帝，你的唱片就没法在电台播'——但他偏偏这么做了。", "context": "ARC Choir的Walk With Me人声采样、Curtis Mayfield的歌词引用、Lou Donaldson的鼓break——三层采样交织成一首福音说唱圣歌。"},
    "k008": {"theme": "忠诚与承诺。Jay-Z贡献verse，J. Ivy带来震撼的口语诗歌桥段。关于在成功后不忘记那些一起走过来的人。", "context": "Blackjack的Maybe It's the Power of Love采样。"},
    "k009": {"theme": "嘻哈文化中的智力对弈。Talib Kweli和Common——两位最具知识性的MC——加入Kanye进行了一场歌词的比拼。", "context": "引用Notorious B.I.G.的Warning。"},
    "k010": {"theme": "讽刺性的健身视频风格歌曲。用幽默批判女性外貌焦虑和消费文化对女性的物化。", "context": "先锋性的'chipmunk soul'制作风格在这首歌达到顶峰。"},
    "k011": {"theme": "慢节奏的浪漫。Jamie Foxx翻唱Luther Vandross的A House Is Not a Home，Twista贡献了当时最快的rap verse。", "context": "采样Luther Vandross的A House Is Not a Home。"},
    "k012": {"theme": "街头生存法则。Ludacris客串，关于在混乱中保持自己的节奏。", "context": "采样Jackie Moore的Precious Precious。"},
    "k014": {"theme": "教育系统的讽刺。用Aretha Franklin的采样来批判美国教育系统对黑人学生的系统性压制。", "context": "采样Aretha Franklin的Spirit in the Dark + Kool & the Gang。"},
    "k017": {"theme": "最后的宣言。Mos Def、Freeway和哈莱姆男孩合唱团加入，只用两个词——'两个词'——来表达一切。", "context": "采样Mandrill的Peace and Love Movement IV。"},
    "k018": {"theme": "车祸后录制的歌曲。2002年10月Kanye遭遇几乎致命的车祸，下颚用钢丝固定。他就这样录了这首歌——在钢丝间唱出了The Fire（火）被误听为The Wire（钢丝）的经典双关。这是他的诞生故事。", "context": "采样Chaka Khan的Through the Fire——一首关于坚持爱情的歌，被Kanye变成了关于坚持生命的歌。"},
    "k019": {"theme": "家族生意。Kanye细数了家族的秘密和温暖——不完美但真实的家庭生活。", "context": "采样The Dells和The Chakachas。"},
    "k020": {"theme": "最后的演说。12分钟的史诗级收尾，Kanye讲述了自己被Roc-A-Fella签下的全过程——从被无视到被认可，完整的奋斗史。", "context": "引用Bette Midler的Mr. Rockefeller。"},

    # ── LATE REGISTRATION ──
    "k021": {"theme": "醒来。Kanye与Jon Brion合作的开场序曲，如同电影的片头配乐。", "context": "Natalie Cole的人声温柔地唤醒听众——这将是完全不同的听觉体验。"},
    "k022": {"theme": "Kanye最具同理心的作品之一。关于单亲妈妈在贫困中抚养孩子的艰辛。Adam Levine的hook提升了歌曲的流行质感。'And I'll try to make ends meet before I go to sleep'——这首歌词写出了无数底层家庭的真实。", "context": "Natalie Cole的Someone That I Used to Love采样。"},
    "k023": {"theme": "飞翔。Lupe Fiasco贡献了他职业生涯最标志性的guest verse——关于从街头飞向天空。Kanye用Curtis Mayfield的Move On Up作为基底，构建了一首关于野心的赞歌。", "context": "采样Curtis Mayfield的Move On Up小号hook——这是Kanye最广为人知的采样之一。"},
    "k024": {"theme": "拜金女的讽刺。表面是派对歌曲，深层是对物质主义关系的批判。Jamie Foxx的Ray Charles模仿已经成为流行文化的瞬间。", "context": "采样Ray Charles的I Got a Woman。"},
    "k026": {"theme": "慢下来。Paul Wall和GLC加入，一首关于在加速的世界中保持冷静的慢节奏经典。休斯顿汽车文化——slow、low、candy paint。", "context": "采样Hank Crawford的Wildflower。"},
    "k027": {"theme": "回家的路。Common贡献了一段灵魂说唱。关于在迷失后找到归途。", "context": "采样Gil Scott-Heron的Home Is Where the Hatred Is。"},
    "k028": {"theme": "毒品对黑人社区的摧毁。The Game贡献了激烈的verse——关于Crack如何撕裂社区的世代创伤。", "context": "采样New York Community Choir。"},
    "k029": {"theme": "爱与失去。Kanye讲述了一段失败的感情——用Bill Withers的Rosie作为底色，将男性脆弱赤裸裸地展现。", "context": "采样Bill Withers的Rosie。"},
    "k030": {"theme": "被拉下来的恐惧。Brandy的和声是这首歌的灵魂——关于当你试图向上爬时，总有人想把你拽回原地。", "context": "原创作曲——这是Late Registration中少数没有采样的歌曲。"},
    "k031": {"theme": "成瘾的隐喻。用爱情来比喻对名利的沉迷——越陷越深，无法自拔。", "context": "采样Etta James的My Funny Valentine。"},
    "k033": {"theme": "血腥钻石。JAY-Z贡献了关于非洲冲突钻石的经典verse。这首歌将嘻哈的'炫富'传统彻底颠倒——你的钻石沾着谁的血？", "context": "采样Shirley Bassey的Diamonds Are Forever。"},
    "k034": {"theme": "我们是多数。Nas、Really Doe加入——一场关于嘻哈社群力量的大型声明。7分钟的史诗。", "context": "采样Orange Krush的Action。"},
    "k036": {"theme": "献给母亲。Kanye为Donda West写的歌。'I wanna be there when you're 87, sitting on the porch watching the sun set'——这是专辑中最温暖、最私人的时刻。", "context": "采样Donal Leace的Today Won't Come Again。"},
    "k037": {"theme": "庆祝。专辑中最欢快的时刻——关于成功的纯粹喜悦。", "context": "采样The Kay-Gees的Heavenly Dream。"},
    "k039": {"theme": "离开。Consequence和Cam'Ron加入——长达6分钟的多段式叙事。", "context": "双重采样：Otis Redding的It's Too Late + Joe Farrell的Upon This Rock。"},
    "k040": {"theme": "Diamonds from Sierra Leone的原始版本——在加入JAY-Z之前的solo版本。更私密，更内省。", "context": "采样Shirley Bassey的Diamonds Are Forever。"},
    "k041": {"theme": "迟到。专辑的隐藏曲目——关于时间、拖延和最终抵达。", "context": "采样The Whatnauts的I'll Erase Away Your Pain——完美的专辑收尾。"},

    # ── GRADUATION ──
    "k042": {"theme": "毕业。从宿舍到世界舞台，Kanye用Elton John的采样宣告毕业。", "context": "采样Elton John的Someone Saved My Life Tonight。"},
    "k043": {"theme": "冠军。用Steely Dan的Kid Charlemagne采样——关于一个曾是冠军却最终堕落的人。Kanye将自己映射到这个叙事中：成名后的自我迷失。", "context": "采样Steely Dan的Kid Charlemagne——这是Kanye最得意的采样之一。"},
    "k044": {"theme": "更强大。采样Daft Punk。Kanye专程飞到Daft Punk的工作室，当面展示了这首歌——他们立刻同意授权。这首歌成为了2007年全球最火的歌曲之一。", "context": "采样Daft Punk的Harder Better Faster Stronger。"},
    "k045": {"theme": "我在想什么？关于成名的代价——当你拥有了所有想要的，然后呢？", "context": "采样Labi Siffre的My Song。"},
    "k046": {"theme": "好生活。T-Pain加入——一首关于庆祝成功的合成器驱动的体育馆赞歌。采样Michael Jackson的P.Y.T.。", "context": "采样Michael Jackson的PYT Pretty Young Thing。"},
    "k047": {"theme": "你不能告诉我任何事。极致自信的宣言——在Graduation击败Curtis之后，这首歌获得了全新的含义。", "context": "原创作曲——DJ Toomp与Kanye的Beat合作。"},
    "k048": {"theme": "竞争和野心。Lil Wayne贡献verse——一首关于体育、竞争和想要成为最好的歌。", "context": "采样Mountain的Long Red——Woodstock传奇现场的人声采样。"},
    "k049": {"theme": "沉迷。与Mos Def合作——用Can的德国迷幻摇滚采样来刻画酒精中毒的缓慢坠落。缓慢的节奏模仿了醉酒时的眩晕感。", "context": "采样Can的Sing Swan Song——德国Krautrock传奇。"},
    "k050": {"theme": "闪光灯。关于名利场的诱惑和危险。Dwele的和声为这首歌增添了灵魂。", "context": "原创作曲——Eric Hudson和Kanye的Beat合作。"},
    "k051": {"theme": "我就是我。DJ Premier贡献了标志性的Scratch。关于接受自己的一切——包括不完美的部分。", "context": "双重采样：Prince Phillip Mitchell + Public Enemy的Bring the Noise。"},
    "k052": {"theme": "荣耀。用Laura Nyro的采样来描绘梦想实现的瞬间——但这荣耀是短暂的。", "context": "采样Laura Nyro的Save the Country + Mountain的Long Red。"},
    "k053": {"theme": "回家。与Chris Martin（Coldplay）合作。关于芝加哥——Kanye的家乡。用Homecoming的隐喻来描述他的成名之旅。", "context": "原创作曲——但根植于Kanye早期Mixtape时代的Home版本。"},
    "k054": {"theme": "大哥。关于Kanye和JAY-Z的关系——仰望与被仰望，兄弟般的竞争与敬仰。", "context": "原创作曲——Graduation的完美收尾。"},

    # ── 808S & HEARTBREAK ──
    "k056": {"theme": "开场。808心跳。将近6分钟的长度，以极简的808鼓机开启Kanye最黑暗的篇章。", "context": "整张专辑的原点——Roland TR-808鼓机是这张专辑的声音基石。"},
    "k057": {"theme": "心碎欢迎你。Kid Cudi的和声。Kanye用Auto-Tune唱出了他看到朋友拥有幸福家庭的痛苦——因为他刚刚失去了母亲。", "context": "原创作曲——808鼓机+Auto-Tune人声的实验。"},
    "k058": {"theme": "无情。专辑中最热门的单曲。用冰冷的Auto-Tune传达最大的情感痛苦——'How could you be so heartless?'。", "context": "原创作曲——这首歌定义了接下来十年流行音乐的声音方向。"},
    "k059": {"theme": "令人惊叹。Jeezy加入——关于在黑暗中寻找力量。Kanye在这首歌中触及了成瘾和自毁倾向。", "context": "原创作曲——808低沉的低音和Auto-Tune交织。"},
    "k060": {"theme": "爱的禁闭。部落打击乐驱动的节奏。Kanye用'Love Lockdown'来描述他无法逃\/脱的情感囚/禁。", "context": "原创作曲——鼓点是这首歌的灵魂。"},
    "k061": {"theme": "偏执。Kid Cudi贡献标志性hook。关于失去信任——当你的世界崩塌后，你开始怀疑一切。", "context": "原创作曲——Auto-Tune的冰冷感与偏执的主题完美匹配。"},
    "k062": {"theme": "机器人警察。用机器人的隐喻来描述情感麻木——当你受到太多伤害后，你变得像机器人一样无法感受。", "context": "采样Patrick Doyle为电影Great Expectations创作的Kissing in the Rain配乐。"},
    "k063": {"theme": "街灯。专辑中最具电影感的一首。如夜晚独自驾车穿过空旷的街道。'Seems like street lights, glowing, happen to be just like moments, passing in front of me'。", "context": "原创作曲——这是808s中最安静也最震撼的歌曲。"},
    "k064": {"theme": "坏消息。用Nina Simone式的编排来传达接到坏消息的瞬间。", "context": "编排借鉴了Nina Simone的处理方式——稀疏的钢琴配合痛苦的人声。"},
    "k065": {"theme": "在我的噩梦中见到你。Lil Wayne加入——关于分手后依然被对方的存在所困扰。", "context": "原创作曲——808和电子合成器的融合。"},
    "k066": {"theme": "最冷的冬天。专辑的终曲。Kanye将Tears for Fears的Memories Fade改编为一首关于失去母亲的挽歌。'Goodbye my friend, will I ever love again?'——这不是在问前任，而是在问命运。", "context": "借鉴Tears for Fears的Memories Fade编排。"},
    "k067": {"theme": "匹诺曹的故事。隐藏曲目——Kanye的即兴现场录音。关于名人不被允许说真话。'I want to be a real boy'——像匹诺曹一样渴望真实。", "context": "现场录音——最Raw的Kanye。"},

    # ── MBDTF ──
    "k068": {"theme": "黑暗幻想。专辑的开场宣言。Nicki Minaj贡献了一段英式口音的童话朗诵——像格林童话的暗黑版。Bon Iver的变调人声问出了专辑的核心问题：'Can we get much higher?'。", "context": "采样Mike Oldfield的In High Places（Jon Anderson演唱），将前卫摇滚的人声变调为嘻哈的hook。"},
    "k069": {"theme": "华丽。Kid Cudi和Raekwon加入。关于美国监狱-工业复合体和种族主义。用Turtles的迷幻吉他采样包装了最尖锐的社会批判。", "context": "采样The Turtles的You Showed Me——60年代迷幻流行被转变为种族正义的宣言。"},
    "k070": {"theme": "权力。专辑最具爆发力的单曲。Kanye用King Crimson的前卫摇滚+Continent Number 6的Funk+James Brown的鼓构建了一首关于权力滥用的史诗。'No one man should have all that power'——但他在唱的就是自己。", "context": "三层采样：Continent Number 6的Afro-Strut + King Crimson的21st Century Schizoid Man + Cold Grits的鼓break。"},
    "k071": {"theme": "灯光之前。弦乐间奏。极简主义的管弦之美——为接下来的史诗做准备。", "context": "原创作曲——由交响乐队录制。"},
    "k072": {"theme": "所有灯光。11位歌手/rapper叠加录制——Rihanna、Kid Cudi、Alicia Keys、Elton John、Fergie等。关于家暴的社会议题，被华丽的编排包裹。", "context": "主要依靠现场乐器而非采样——管乐、弦乐、打击乐的极致编排。"},
    "k073": {"theme": "怪物。Nicki Minaj贡献了嘻哈史上最传奇的guest verse之一。JAY-Z、Rick Ross、Bon Iver全部在列。关于名流变成怪物——每个人都在这首歌里扮演着'怪物'角色。", "context": "原创作曲——建立在合成器和鼓编程之上。"},
    "k074": {"theme": "震撼。Swizz Beatz、JAY-Z、Pusha T、CyHi the Prynce、RZA——全明星阵容。关于名利的荒谬——'so appalled'就是被自己创造的怪物吓到。", "context": "采样Manfred Mann's Earth Band的You Are I Am。"},
    "k075": {"theme": "穿新裙子的魔鬼。Rick Ross贡献了定义其职业生涯的verse。用Smokey Robinson的人声采样来包装关于欲望与诱惑的叙事——魔鬼总是穿着最美的衣裳。", "context": "采样Smokey Robinson的Will You Love Me Tomorrow——经典灵魂被升华为情欲的暗黑面。"},
    "k076": {"theme": "逃跑。9分钟的史诗。Kanye用钢琴独奏+808+Pusha T的冷酷verse构建了一首关于自我毁灭的挽歌。最后三分钟的Auto-Tune失真钢琴独奏——喝醉后对答录机的即兴表演——被保留在正式版本中。这是Kanye最伟大的歌曲。", "context": "采样Backyard Heavies的Expo 83——一段被Kanye挖掘出的冷门Funk。"},
    "k077": {"theme": "地狱一般的人生。用The Mojo Men的60年代车库摇滚变调、Black Sabbath的金属riff、Tony Joe White的Swamp Rock——三重采样叠加。关于性与名利的成瘾。", "context": "三层采样：The Mojo Men（变调bassline）+ Black Sabbath的Iron Man（Auto-Tune）+ Tony Joe White。"},
    "k078": {"theme": "指责游戏。Kanye和John Legend的对唱，Chris Rock贡献了一段长达数分钟的喜剧skit——关于一段有毒的关系中双方互相指责。采样Aphex Twin的Avril 14th钢琴曲。", "context": "采样Aphex Twin的Avril 14th——Kanye得到了Richard D. James本人的授权。"},
    "k079": {"theme": "迷失在这个世界。Bon Iver的Woods被整段采样——自动调音的民谣变成了部落式的电子嘻哈。Gil Scott-Heron的Comment No.1插入——将个人迷失与黑人群体迷失连接起来。", "context": "四层采样：Bon Iver的Woods + Lyn Collins的鼓break + Manu Dibango的Soul Makossa + Gil Scott-Heron的spoken word。"},
    "k080": {"theme": "谁会在美国活下来。Gil Scott-Heron的Comment No.1全段采样。关于黑人群体在美国的生存——这是整张专辑的政治宣言。", "context": "Gil Scott-Heron的Comment No.1——1970年的spoken word在2010年依然振聋发聩。"},

    # ── YEEZUS ──
    "k081": {"theme": "一瞬间。专辑的第一秒就用失真合成器轰炸你的耳朵。'He'll give us what we need, it may not be what we want'——Kanye用最暴力的声音唱出最虔诚的歌词。", "context": "采样黑人灵歌——被扭曲到几乎无法辨认。"},
    "k082": {"theme": "黑光头党。用Marilyn Manson的工业摇滚采样来讨论黑人身份和种族符号的颠覆。'For my theme song, I'm blackin' out'——黑色皮肤成为武器和威胁。", "context": "采样James Brown + Marilyn Manson的引用——用工业摇滚颠覆嘻哈。"},
    "k083": {"theme": "我是神。最极端的Kanye宣言。'I am a God, hurry up with my damn massage'——被解读为狂妄自大，但Kanye的解释是：每个人都有神性。", "context": "原创作曲——工业合成器和极简鼓机的组合。"},
    "k084": {"theme": "新奴隶。Kanye最尖锐的政治宣言。关于消费主义、种族主义和监狱系统——'they tryna make us all the same, they want us to be slaves'。", "context": "采样匈牙利摇滚乐队Omega——Kanye将东欧前卫摇滚变形为种族正义的呐喊。"},
    "k085": {"theme": "抱住我的酒。Chief Keef加入——关于用酒精来麻痹情感痛苦。歌曲在中间突变为一段迷幻的吉他独奏+Auto-Tune即兴。", "context": "原创作曲——Yeezus中最长的歌曲，也是最具情感深度的一首。"},
    "k086": {"theme": "我在里面。Justin Vernon（Bon Iver）和Assassin加入——关于性的欲望和权力的纠缠。最露骨的Yeezus歌曲。", "context": "原创作曲——深受Chicago Acid House影响。"},
    "k087": {"theme": "树叶上的血。Nina Simone的Strange Fruit采样是整个Yeezus的情感高点。原曲关于南方私刑和种族主义恐怖——Kanye将这段历史连接到当代：从私刑到监狱系统。TNGHT的电子制作提供了现代感。", "context": "采样Nina Simone的Strange Fruit——美国音乐史上最重要的抗议歌曲之一。"},
    "k088": {"theme": "愧疚之旅。Kid Cudi加入——关于在一段关系中感到的愧疚和无法表达的痛苦。", "context": "原创作曲——Daft Punk风格电子制作。"},
    "k089": {"theme": "推进。King Louie加入——专辑的极致狂欢，用最暴力的声音释放所有压抑。", "context": "原创作曲——Yeezus中最躁的歌曲。"},
    "k090": {"theme": "捆绑2。专辑唯一的'传统'嘻哈时刻。采样Brenda Lee和Ponderosa Twins Plus One——一个关于爱情的粗暴宣言。在整张专辑的暴烈工业声之后，这首温暖的采样-嘻哈歌曲犹如一次深呼吸。", "context": "双重采样：Brenda Lee的Sweet Nothings + Ponderosa Twins Plus One的Bound。"},

    # ── THE LIFE OF PABLO ──
    "k091": {"theme": "超光束。福音开场。Chance the Rapper、Kirk Franklin、The-Dream、Kelly Price——像是一场现代教堂礼拜。一个小女孩的Instagram祷告视频开启了这首歌——关于信仰的力量。", "context": "采样Pastor TL Barrett的Father I Stretch My Hands——芝加哥福音经典。"},
    "k092": {"theme": "父亲展开我的手 Pt1。Kid Cudi加入——用福音采样和808 Trap融合，Kanye创造了一种全新的声音：教堂也摇摆。Metro Boomin的tag在这里首次出现。", "context": "采样Pastor TL Barrett的Father I Stretch My Hands——与Ultralight Beam形成呼应。"},
    "k093": {"theme": "Pt2。Desiigner的Panda采样——从福音直接跳到街头。Pablo的两面性在这里首次体现。", "context": "延续Pt1的福音基底，加入Desiigner的Panda采样和Street Fighter音效。"},
    "k094": {"theme": "出名。Rihanna翻唱Nina Simone的Do What You Gotta Do。Sister Nancy的Bam Bam采样、意大利前卫摇滚Il Rovescio della Medaglia采样——这首歌是Kanye采样哲学的极致展示。关于成名后的人际关系——'I feel like me and Taylor might still have sex'点燃了2016年最大的名人争端。", "context": "三层采样：Nina Simone + Sister Nancy的Bam Bam + Il Rovescio della Medaglia意大利前卫摇滚。"},
    "k095": {"theme": "反馈。采样伊朗流行歌手Googoosh——一首关于社交媒体和舆论反馈的暗黑Trap。", "context": "采样Googoosh的Talagh——伊朗流行音乐的Rare Groove级挖掘。"},
    "k096": {"theme": "低光。一段长篇的信仰见证——Kanye用'低光'作为隐喻：即使在最黑暗的时刻，信仰之光依然存在。", "context": "采样Kings of Tomorrow的So Alive人声。"},
    "k097": {"theme": "高光。Young Thug加入——如果Low Lights是祈祷，Highlights就是庆祝。关于Kanye在名利的'高光'中保持自我。", "context": "原创作曲。"},
    "k098": {"theme": "Freestyle 4。采样英国电子组合Goldfrapp的Human——一首关于黑暗欲望的Trap。Desiigner的加入增加了Raw能量。", "context": "采样Goldfrapp的Human——Trip-hop与Trap的交汇。"},
    "k099": {"theme": "我爱Kanye。纯人声Acapella——Kanye用自嘲的方式回应了所有对他的批评。'I miss the old Kanye'在这首歌里被Kanye本人抢先说出来。", "context": "无采样——纯人声。"},
    "k100": {"theme": "波浪。Chris Brown加入——Kanye借'波浪'这个隐喻探讨了音乐和文化的周期律。", "context": "采样Fantastic Freaks的Turn it up ad-lib。"},
    "k101": {"theme": "FML。The Weeknd加入——'FML'即Fuck My Life。关于在名利、家庭和欲望之间的撕裂。使用了英国后朋克乐队Section 25的采样。", "context": "采样Section 25的Hit——英国后朋克。"},
    "k102": {"theme": "真正的朋友。Ty Dolla $ign加入——重新诠释了Whodini的Friends。关于成名后发现身边没有真正的朋友——只有利益。", "context": "采样Whodini的Friends——80年代Electro Hip-Hop经典。"},
    "k103": {"theme": "狼。Frank Ocean和Caroline Shaw加入——Caroline Shaw是普利策音乐奖得主。这首歌关于保护家人——'if I get locked up, who's gonna raise my kids?'。", "context": "采样Sugar Minott的Walking Dub——牙买加Reggae。"},
    "k106": {"theme": "30小时。Andre 3000贡献verse。采样Arthur Russell的Answers Me——一首关于感情纠葛的漫长叙事。", "context": "双重采样：Arthur Russell的Answers Me + Isaac Hayes的Joy鼓break。"},
    "k107": {"theme": "LA不再有派对。Kendrick Lamar贡献了定义性的verse。Madlib制作的Beat——基于Junie Morrison和Johnny Guitar Watson的采样。关于厌倦了好莱坞的虚假派对。", "context": "四层采样：Junie Morrison + Johnny Guitar Watson + Larry Graham + Ghostface Killah。"},
    "k108": {"theme": "事实。关于Nike和Adidas的竞争。采样Fathers Children——一首关于Yeezy品牌独立宣言的Trap。", "context": "采样Fathers Children的Dirt and Grime + Street Fighter II游戏音效。"},
    "k109": {"theme": "褪色。采样芝加哥House经典——Rare Earth、Mr. Fingers、Hardrive、Barbara Tucker。关于爱情的褪色——用Chicago House的根基来致敬Kanye的家乡。", "context": "四层采样：Rare Earth + Mr. Fingers + Hardrive + Barbara Tucker——芝加哥House致敬。"},
    "k110": {"theme": "圣巴勃罗。Sampha加入。Pablo就是Kanye自己——关于债务、压力和救赎。'I'm checking all the accounts'——2016年Kanye公开发推说自己在5300万美元的债务中。", "context": "采样Chaka Khan和Sampha的人声片段。"},

    # ── YE ──
    "k111": {"theme": "我想过自杀。专辑最开场。Kanye公开谈论自杀倾向和躁郁症——'I thought about killing you today'。这首歌在专辑试听会上让所有人沉默。", "context": "采样Kareem Lotfy的Fr3sh。"},
    "k112": {"theme": "Yikes。关于躁郁症的'恐怖'面——但Kanye将这种状态重新定义为他的'超能力'。采样肯尼亚音乐人Ayub Ogada。", "context": "采样Ayub Ogada的Kothbiro/Black Savage。"},
    "k113": {"theme": "全部是我的。Ty Dolla $ign、Valee、Ant Clemons加入——关于占有欲和嫉妒。", "context": "原创作曲——Francis and the Lights合作制作。"},
    "k114": {"theme": "不会离开。PARTYNEXTDOOR、Jeremih、Ty Dolla加入——关于妻子Kim在风暴中始终站在他身边。", "context": "采样Rev WA Donaldson的Baptizing Scene。"},
    "k115": {"theme": "没有错误。Kid Cudi、Charlie Wilson加入——采样Edwin Hawkins Singers和Slick Rick。关于上帝的计划——'make no mistakes, God is great'。", "context": "双重采样：Edwin Hawkins Singers + Slick Rick。"},
    "k116": {"theme": "鬼城。Kid Cudi和070 Shake加入——这是专辑的情感高潮。070 Shake的'and nothing hurts any more, I feel kinda free'成为2018年最震撼的音乐瞬间。", "context": "采样Vanilla Fudge的Take Me For a Little While。"},
    "k117": {"theme": "暴力犯罪。关于抚养女儿——担心她在充满暴力和性别歧视的世界中成长。Nicki Minaj通过语音邮件贡献了最后的verse——她当时正在怀孕。", "context": "原创作曲——专辑最温柔的收尾。"},

    # ── JESUS IS KING ──
    "k118": {"theme": "每小时。Sunday Service Choir开场——纯净的福音赞美诗。", "context": "原创作曲——无采样。"},
    "k119": {"theme": "细拉。'Selah'是《诗篇》中的音乐标记符号——意为'暂停、反思'。Hallelujah合唱采样叠加Kanye的rap verse。", "context": "采样New Jerusalem Baptism Choir的Revelation 19 Hallelujah。"},
    "k120": {"theme": "跟随上帝。用1974年Whole Truth的福音采样——关于顺服上帝的引导。Kanye在这首歌中反思了他与父亲的关系。", "context": "采样Whole Truth的Can You Lose By Following God。"},
    "k121": {"theme": "周日闭店。关于守安息日——在周日关闭商店，回归家庭和信仰。采样阿根廷民谣Grupo Vocal Argentino。", "context": "采样Grupo Vocal Argentino的Martin Fierro。"},
    "k122": {"theme": "在上帝面前。采样A Tribe Called Quest的Oh My God——用经典嘻哈的采样来赞美上帝。", "context": "采样A Tribe Called Quest的Oh My God。"},
    "k123": {"theme": "我们所需的一切。Ty Dolla $ign和Ant Clemons加入——用简约的Trap编排表达'唯有上帝能满足一切所需'。", "context": "原创作曲。"},
    "k124": {"theme": "水。采样电子音乐先驱Bruce Haack和Yoko Ono——一首关于洗礼和洁净的极简Trap。", "context": "采样Bruce Haack的Snow Job + Yoko Ono的引用。"},
    "k125": {"theme": "上帝是。采样James Cleveland——'上帝是'——最纯粹的赞美。Kanye用变速人声将60年代的福音变成现代Trap。", "context": "采样Rev. James Cleveland的God Is。"},
    "k126": {"theme": "按手。Fred Hammond加入——关于为批评者祈祷——'让他们按手在我身上'。", "context": "原创作曲。"},
    "k127": {"theme": "使用这福音。Clipse（Pusha T和No Malice）和Kenny G加入！——是的，Kenny G在这首歌里吹萨克斯。采样Two Door Cinema Club。", "context": "采样Two Door Cinema Club的Costume Party + Kenny G萨克斯。"},
    "k128": {"theme": "耶稣是主。用Claude Leveillee的管弦采样收尾——整张专辑的最终宣言：耶稣是主。", "context": "采样Claude Leveillee的Un Homme Dans La Nuit。"},

    # ── DONDA ──
    "k130": {"theme": "监狱。JAY-Z加入——两人修复了多年的裂痕。关于监狱系统和精神牢笼。'God gon' post my bail tonight'。", "context": "原创作曲——黑暗Trap。"},
    "k131": {"theme": "上帝的气息。Vory加入——关于神圣的呼吸赋予生命。极简的808与福音和声交织。", "context": "原创作曲。"},
    "k132": {"theme": "离网。Playboi Carti和Fivio Foreign加入——三人在Beat上依次爆发。最躁的Donda歌曲之一。", "context": "原创作曲。"},
    "k133": {"theme": "飓风。The Weeknd和Lil Baby加入——最初是Yandhi时期的歌曲，经过多次重制最终在Donda找到位置。关于经历风暴后的平静。", "context": "原创作曲——经历多年修改。"},
    "k134": {"theme": "赞美上帝。Travis Scott和Baby Keem加入——'Praise God'是对上帝的全然赞美，也是Donda上最受欢迎的歌之一。", "context": "原创作曲。"},
    "k135": {"theme": "约拿。Vory和Lil Baby加入——以圣经先知约拿命名，关于逃避上帝的呼召但最终无法逃脱。", "context": "原创作曲。"},
    "k138": {"theme": "相信我说的话。采样Lauryn Hill的Doo Wop (That Thing)——Donda上最温暖、最具怀旧感的歌曲。", "context": "采样Lauryn Hill的Doo Wop (That Thing)——90年代经典被重新激活。"},
    "k141": {"theme": "月亮。Kid Cudi和Don Toliver加入——一首太空般的、漂浮的R&B。", "context": "原创作曲。"},
    "k142": {"theme": "天堂与地狱。采样20th Century Steel Band——关于世间的善恶斗争。", "context": "采样20th Century Steel Band的Heaven and Hell。"},
    "k143": {"theme": "Donda。以母亲命名的歌曲——关于Donda West的生/命与遗/产。", "context": "采样福音音乐——献给母亲的音乐悼词。"},
    "k145": {"theme": "主耶稣。JAY-Z和CyHi加入——9分钟的史诗。关于信仰、死亡和救赎的深刻冥想。", "context": "原创作曲——Donda上最长的歌曲。"},
    "k150": {"theme": "重生。Donda的情感高潮——关于在最低谷时重新站起来。Kanye的钢琴和人声带来了专辑最动人的时刻。", "context": "原创作曲——钢琴主导。"},

    # ── DONDA 2 ──
    "k156": {"theme": "真爱。与已故XXXTentacion的跨时空合作——关于真爱和失去。", "context": "采样XXXTentacion的未发布人声。"},
    "k163": {"theme": "巴勃罗。Travis Scott和Future加入——Pablo这个化名的回归。", "context": "原创作曲。"},
    "k165": {"theme": "快乐。Future加入——反讽的标题。关于用物质来填补情感的空洞。", "context": "原创作曲。"},
    "k169": {"theme": "众神之城。Fivio Foreign和Alicia Keys加入——纽约的颂歌。", "context": "原创作曲。"},

    # ── VULTURES 1 ──
    "k172": {"theme": "星星。开场——在黑暗中寻找指引的光芒。", "context": "原创作曲。"},
    "k180": {"theme": "燃烧。专辑中最具爆发力的歌曲——所有压抑的情绪在烈焰中释放。", "context": "原创作曲。"},
    "k183": {"theme": "狂欢节。Playboi Carti、Rich the Kid加入——2024年最具争议也最轰动的单曲。", "context": "原创作曲。"},
    "k184": {"theme": "请求原谅。Chris Brown加入——关于错误和寻求原谅。", "context": "原创作曲。"},

    # ── VULTURES 2 ──
    "k188": {"theme": "滑行。开场——流畅的旋律宣告Vultures 2的到来。", "context": "原创作曲。"},
    "k198": {"theme": "河流。Young Thug加入——在湍急的生活洪流中保持漂流。", "context": "原创作曲。"},

    # ── BULLY ──
    "k204": {"theme": "兄弟姐妹。开场宣言——关于团结和家庭纽带。", "context": "原创作曲。"},
    "k206": {"theme": "父亲。Travis Scott加入——关于父亲身份的思考。", "context": "原创作曲。"},
    "k209": {"theme": "霸凌者。CeeLo Green加入——标题曲。将'Bully'重新定义为一种力量符号。", "context": "原创作曲。"},
    "k214": {"theme": "传教士。Bully中最早释出的单曲——关于信仰和道德。", "context": "原创作曲。"},
    "k219": {"theme": "美女与野兽。关于外表和内在的矛盾——每个人心中都有野兽和美丽。", "context": "原创作曲。"},
    "k221": {"theme": "最后一口气。Peso Pluma加入——关于坚持到最后一刻。", "context": "原创作曲——完美的专辑收尾。"},
}
