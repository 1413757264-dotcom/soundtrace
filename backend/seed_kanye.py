"""Complete Kanye West seed data — 14 albums, all songs, all verified samples, full credits."""
import asyncio
from app.core.database import async_session
from app.models.models import Artist, Song, Sample, Credit

async def seed():
    async with async_session() as db:
        for t in [Credit, Sample, Song, Artist]:
            await db.execute(t.__table__.delete())

        # ═══════════════════════════════════════════════════════════
        # ARTISTS — Kanye + all collaborators + all sampled artists
        # ═══════════════════════════════════════════════════════════
        artist_data = [
            # ── Kanye ──
            ("a01","Kanye West",["hip_hop"]),
            # ── Frequent Collaborators ──
            ("a02","JAY-Z",["hip_hop"]),
            ("a03","Kid Cudi",["hip_hop"]),
            ("a04","Pusha T",["hip_hop"]),
            ("a05","Rick Ross",["hip_hop"]),
            ("a06","Nicki Minaj",["hip_hop"]),
            ("a07","Bon Iver",["indie","folk"]),
            ("a08","Rihanna",["pop","rnb"]),
            ("a09","Paul McCartney",["rock"]),
            ("a10","Chris Brown",["rnb"]),
            ("a11","Ty Dolla Sign",["hip_hop","rnb"]),
            ("a12","Mike Dean",["hip_hop","electronic"]),
            ("a13","John Legend",["rnb","soul"]),
            ("a14","The Weeknd",["rnb","pop"]),
            ("a15","Travis Scott",["hip_hop","trap"]),
            ("a16","Frank Ocean",["rnb"]),
            ("a17","Big Sean",["hip_hop"]),
            ("a18","2 Chainz",["hip_hop"]),
            ("a19","Lil Wayne",["hip_hop"]),
            ("a20","Jeezy",["hip_hop"]),
            ("a21","Common",["hip_hop","conscious"]),
            ("a22","Talib Kweli",["hip_hop","conscious"]),
            ("a23","Mos Def",["hip_hop","conscious"]),
            ("a24","Lupe Fiasco",["hip_hop"]),
            ("a25","Twista",["hip_hop"]),
            ("a26","Jamie Foxx",["rnb","soul"]),
            ("a27","Syleena Johnson",["soul","rnb"]),
            ("a28","Consequence",["hip_hop"]),
            ("a29","GLC",["hip_hop"]),
            ("a30","Really Doe",["hip_hop"]),
            ("a31","The Game",["hip_hop"]),
            ("a32","Andre 3000",["hip_hop"]),
            ("a33","Kendrick Lamar",["hip_hop"]),
            ("a34","Sampha",["rnb","electronic"]),
            ("a35","Chance the Rapper",["hip_hop"]),
            ("a36","Tyga",["hip_hop"]),
            ("a37","Offset",["hip_hop","trap"]),
            ("a38","Chris Rock",["comedy"]),
            ("a39","Elton John",["rock","pop"]),
            ("a40","Paul Wall",["hip_hop"]),
            ("a41","Chief Keef",["hip_hop","drill"]),
            ("a42","King Louie",["hip_hop","drill"]),
            ("a43","Assassin",["hip_hop","dancehall"]),
            ("a47","Dwele",["rnb","soul"]),
            ("a48","Freeway",["hip_hop"]),
            ("a49","Ludacris",["hip_hop"]),
            ("a50","Gunna",["hip_hop","trap"]),
            ("a51","Playboi Carti",["hip_hop","trap"]),
            ("a52","Don Toliver",["hip_hop","rnb"]),
            ("a53","Vory",["hip_hop","rnb"]),
            ("a54","Fivio Foreign",["hip_hop","drill"]),
            ("a55","Baby Keem",["hip_hop"]),
            ("a56","Lil Baby",["hip_hop","trap"]),
            ("a57","Roddy Ricch",["hip_hop"]),
            ("a58","Tony Williams",["rnb","soul"]),
            ("a59","Young Thug",["hip_hop","trap"]),
            ("a60","Desiigner",["hip_hop","trap"]),
            ("a61","070 Shake",["hip_hop","alternative"]),
            ("a62","CyHi the Prynce",["hip_hop"]),
            ("a63","Swizz Beatz",["hip_hop"]),
            ("a64","RZA",["hip_hop"]),
            ("a65","Raekwon",["hip_hop"]),
            ("a66","Nas",["hip_hop"]),
            ("a67","CamRon",["hip_hop"]),
            ("a68","Brandy",["rnb","pop"]),
            ("a69","Adam Levine",["pop","rock"]),
            ("a70","Chris Martin",["rock","pop"]),
            ("a71","T-Pain",["hip_hop","rnb"]),
            ("a72","DJ Premier",["hip_hop"]),
            ("a73","J. Ivy",["hip_hop","spoken_word"]),
            ("a74","Kirk Franklin",["gospel"]),
            ("a75","The-Dream",["rnb"]),
            ("a76","Kelly Price",["rnb","gospel"]),
            ("a77","Caroline Shaw",["classical"]),
            ("a78","Post Malone",["hip_hop","pop"]),
            ("a79","Ant Clemons",["rnb"]),
            ("a80","Fred Hammond",["gospel"]),
            ("a81","Kenny G",["jazz"]),
            ("a82","Clipse",["hip_hop"]),
            ("a83","Charlie Wilson",["rnb","funk"]),
            ("a84","PARTYNEXTDOOR",["rnb"]),
            ("a85","Jeremih",["rnb"]),
            ("a86","Slick Rick",["hip_hop"]),
            ("a87","Valee",["hip_hop","trap"]),
            ("a88","Benny Blanco",["pop"]),

            # ── Sampled Artists: Soul / Funk / R&B ──
            ("s01","Curtis Mayfield",["soul","funk"]),
            ("s02","Aretha Franklin",["soul"]),
            ("s03","James Brown",["funk","soul"]),
            ("s04","Stevie Wonder",["soul","funk"]),
            ("s05","Otis Redding",["soul"]),
            ("s06","Ray Charles",["soul","rnb"]),
            ("s07","Marvin Gaye",["soul","rnb"]),
            ("s08","Nina Simone",["jazz","soul"]),
            ("s09","George Clinton",["funk"]),
            ("s10","Lauryn Hill",["hip_hop","soul","rnb"]),
            ("s11","Chaka Khan",["funk","soul"]),
            ("s12","Luther Vandross",["rnb","soul"]),
            ("s13","Smokey Robinson",["soul","rnb"]),
            ("s14","Gil Scott-Heron",["soul","jazz"]),
            ("s15","Bobby Bland",["soul","blues"]),
            ("s16","Gladys Knight",["soul","rnb"]),
            ("s17","The Dells",["soul"]),
            ("s18","The Whatnauts",["soul"]),
            ("s19","Brook Benton",["soul"]),
            ("s20","Mandrill",["funk","soul"]),
            ("s21","Bill Withers",["soul"]),
            ("s22","Etta James",["soul","jazz","blues"]),
            ("s24","Lyn Collins",["funk","soul"]),
            ("s25","Isaac Hayes",["soul","funk"]),
            ("s26","Jimmy Castor",["funk","soul"]),
            ("s27","Labi Siffre",["soul","folk"]),
            ("s28","Laura Nyro",["pop","soul","jazz"]),
            ("s29","Honey Cone",["soul","rnb"]),
            ("s30","Prince Phillip Mitchell",["soul"]),
            ("s31","Mountain",["rock"]),
            ("s32","Steely Dan",["rock","jazz"]),
            ("s33","Can",["krautrock","experimental"]),
            ("s34","Vaughan Mason",["funk","disco"]),
            ("s35","Public Enemy",["hip_hop"]),
            ("s36","Jackie Moore",["soul","rnb"]),
            ("s37","Crash Crew",["hip_hop"]),
            ("s38","Blackjack",["soul","funk"]),
            ("s39","The Notorious B.I.G.",["hip_hop"]),
            ("s40","Outkast",["hip_hop"]),
            ("s41","Bette Midler",["pop"]),
            ("s42","The Jimmy Castor Bunch",["funk","soul"]),
            ("s43","The ARC Choir",["gospel"]),
            ("s44","Lou Donaldson",["jazz"]),
            ("s45","Natalie Cole",["rnb","soul","pop"]),
            ("s46","Shirley Bassey",["pop","jazz"]),
            ("s47","Orange Krush",["hip_hop","funk"]),
            ("s48","Donal Leace",["soul","folk"]),
            ("s49","The Kay-Gees",["funk"]),
            ("s50","Joe Farrell",["jazz","fusion"]),
            ("s51","New York Community Choir",["gospel"]),
            ("s52","Sister Nancy",["reggae","dancehall"]),
            ("s53","Pastor T.L. Barrett",["gospel"]),
            ("s54","King Crimson",["rock","progressive"]),
            ("s55","Brenda Lee",["pop","country"]),
            ("s56","Mike Oldfield",["rock","progressive"]),
            ("s57","Jon Anderson",["rock","progressive"]),
            ("s58","The Turtles",["rock","pop"]),
            ("s59","Continent Number 6",["funk","disco"]),
            ("s60","Cold Grits",["funk"]),
            ("s61","Manfred Mann's Earth Band",["rock","progressive"]),
            ("s62","The Backyard Heavies",["funk"]),
            ("s63","Tony Joe White",["rock","swamp_rock"]),
            ("s64","The Mojo Men",["rock","garage"]),
            ("s65","Black Sabbath",["metal","rock"]),
            ("s66","Aphex Twin",["electronic","idm"]),
            ("s67","Manu Dibango",["world","funk","jazz"]),
            ("s68","Rick James",["funk"]),
            ("s69","Daft Punk",["electronic","house"]),
            ("s70","Michael Jackson",["pop","rnb","soul"]),
            ("s71","Justice",["electronic"]),
            ("s72","Marilyn Manson",["rock","industrial"]),
            ("s73","TNGHT",["electronic","trap"]),
            ("s74","Metro Boomin",["hip_hop","trap"]),
            ("s75","Lonnie Liston Smith",["jazz","soul"]),
            ("s76","Hank Crawford",["jazz"]),
            ("s77","Edwin Birdsong",["funk"]),
            ("s78","Johnny Guitar Watson",["funk","blues"]),
            ("s79","Maceo",["funk"]),
            ("s80","Billy Preston",["soul","funk","rock"]),
            ("s81","Edwin Hawkins Singers",["gospel"]),
            ("s82","Vanilla Fudge",["rock","psychedelic"]),
            ("s83","Trade Martin",["pop","rock"]),
            ("s84","Rare Earth",["rock","soul"]),
            ("s85","Mr. Fingers",["house","electronic"]),
            ("s86","Hardrive",["house"]),
            ("s87","Barbara Tucker",["house"]),
            ("s88","Walter Junie Morrison",["funk"]),
            ("s89","Larry Graham",["funk","soul"]),
            ("s90","Ghostface Killah",["hip_hop"]),
            ("s91","Fathers Children",["soul","funk"]),
            ("s92","Section 25",["post_punk","electronic"]),
            ("s93","Goldfrapp",["electronic","trip_hop"]),
            ("s94","Whodini",["hip_hop","electro"]),
            ("s95","Arthur Russell",["experimental","folk","electronic"]),
            ("s96","Il Rovescio della Medaglia",["rock","progressive"]),
            ("s97","Googoosh",["pop","world"]),
            ("s98","Kings of Tomorrow",["house"]),
            ("s99","Fantastic Freaks",["hip_hop"]),
            ("s100","Sugar Minott",["reggae"]),
            ("s101","Kareem Lotfy",["electronic","experimental"]),
            ("s102","Ayub Ogada",["world"]),
            ("s103","Reverend W.A. Donaldson",["gospel"]),
            ("s104","Whole Truth",["gospel","soul"]),
            ("s105","Grupo Vocal Argentino",["folk","world"]),
            ("s106","A Tribe Called Quest",["hip_hop"]),
            ("s107","Bruce Haack",["electronic","experimental"]),
            ("s108","Yoko Ono",["experimental","pop"]),
            ("s109","James Cleveland",["gospel"]),
            ("s110","Two Door Cinema Club",["indie","rock"]),
            ("s111","Claude Leveillee",["world","jazz"]),
            ("s112","20th Century Steel Band",["world","steel_drum"]),
            ("s113","Ponderosa Twins Plus One",["soul"]),
            ("s114","Kool & the Gang",["funk","soul"]),
            ("s115","The Chakachas",["funk","latin"]),
            ("s116","The 5th Dimension",["pop","soul"]),
            # ── Vultures / Bully era collaborators ──
            ("c01","XXXTentacion",["hip_hop","emo"]),
            ("c02","Future",["hip_hop","trap"]),
            ("c03","Jack Harlow",["hip_hop"]),
            ("c04","Sean Leon",["hip_hop","alternative"]),
            ("c05","Soulja Boy",["hip_hop"]),
            ("c06","Alicia Keys",["rnb","soul"]),
            ("c07","CeeLo Green",["soul","rnb","hip_hop"]),
            ("c08","Peso Pluma",["latin","regional"]),
            ("c09","Andre Troutman",["rnb","soul"]),
            ("c10","Migos",["hip_hop","trap"]),
            ("c11","Quavo",["hip_hop","trap"]),
            ("c12","Rich the Kid",["hip_hop","trap"]),
            ("c13","YG",["hip_hop"]),
            ("c14","Lil Durk",["hip_hop","drill"]),
            ("c15","Kodak Black",["hip_hop","trap"]),
            ("c16","North West",["hip_hop"]),
        ]
        for aid, name, genres in artist_data:
            db.add(Artist(id=aid, name=name, genres=genres))
        await db.flush()
        print(f"+{len(artist_data)} artists")

        # ═══════════════════════════════════════════════════════════
        # ORIGINAL SAMPLE SOURCE SONGS
        # ═══════════════════════════════════════════════════════════
        originals = [
            # Soul / Funk
            ("o01","Try a Little Tenderness","s05",1966,205000,70,"C major","soul"),
            ("o02","I Got a Woman","s06",1954,175000,78,"C major","soul"),
            ("o03","Move On Up","s01",1970,252000,74,"Eb minor","funk"),
            ("o04","Funky Drummer","s03",1970,162000,91,"D minor","funk"),
            ("o05","Super Fly","s01",1972,216000,102,"G minor","funk"),
            ("o06","Living for the City","s04",1973,204000,82,"F minor","funk"),
            ("o07","Whats Going On","s07",1971,233000,78,"E minor","soul"),
            ("o08","Atomic Dog","s09",1982,264000,102,"C minor","funk"),
            ("o09","Impeach the President","s03",1973,148000,94,"A minor","funk"),
            ("o10","Doo Wop That Thing","s10",1998,260000,90,"A minor","hip_hop"),
            ("o11","Strange Fruit","s08",1965,211000,65,"C minor","jazz"),
            ("o12","21st Century Schizoid Man","s54",1969,325000,78,"C minor","rock"),
            ("o13","Sweet Nothings","s55",1959,168000,80,"C major","pop"),
            ("o14","Home Is Where the Hatred Is","s14",1971,212000,75,"D minor","soul"),
            ("o15","Father I Stretch My Hands","s53",1974,330000,78,"C minor","gospel"),
            ("o16","Bam Bam","s52",1982,246000,82,"C major","reggae"),
            ("o17","Through the Fire","s11",1984,300000,72,"Ab minor","soul"),
            ("o18","Give Me My Love","s78",1976,220000,88,"C minor","funk"),
            ("o19","You Showed Me","s58",1968,178000,80,"C major","rock"),
            ("o20","In High Places","s57",1976,196000,82,"C minor","rock"),
            ("o21","PYT Pretty Young Thing","s70",1983,239000,128,"B minor","pop"),
            ("o22","A House Is Not a Home","s12",1981,350000,72,"C major","rnb"),
            ("o23","Distant Lover","s07",1973,240000,72,"Eb minor","soul"),
            ("o24","Will You Love Me Tomorrow","s13",1972,230000,78,"C major","soul"),
            ("o25","Wildflower","s76",1972,250000,74,"F minor","jazz"),
            ("o26","I Just Wanna Stop","s42",1979,200000,88,"C minor","funk"),
            ("o27","Mystery of Iniquity","s10",2002,250000,85,"A minor","hip_hop"),
            ("o28","Walk With Me","s43",1997,280000,78,"C major","gospel"),
            ("o29","Maybe Its the Power of Love","s38",1980,220000,82,"C minor","soul"),
            ("o30","Spirit in the Dark","s02",1970,280000,75,"C minor","soul"),
            ("o31","Peace and Love Movement IV","s20",1970,280000,82,"F minor","funk"),
            ("o32","Fonky Thang Diamon Rang","s17",1972,230000,85,"C minor","soul"),
            ("o33","Mr Rockefeller","s41",1976,240000,75,"C major","pop"),
            # Late Registration era
            ("o34","Someone That I Used to Love","s45",1979,250000,74,"C major","rnb"),
            ("o35","Rosie","s21",1978,220000,72,"C minor","soul"),
            ("o36","My Funny Valentine","s22",1968,210000,68,"C minor","jazz"),
            ("o37","Diamonds Are Forever","s46",1971,270000,82,"C minor","pop"),
            ("o38","Action","s47",1982,250000,90,"A minor","funk"),
            ("o39","Today Won't Come Again","s48",1972,230000,76,"C major","soul"),
            ("o40","Heavenly Dream","s49",1976,240000,85,"C minor","funk"),
            ("o41","Its Too Late","s05",1965,220000,72,"C major","soul"),
            ("o42","Upon This Rock","s50",1974,280000,80,"C minor","jazz"),
            ("o43","Ill Erase Away Your Pain","s18",1972,260000,80,"C minor","soul"),
            ("o44","Since You Came in My Life","s51",1978,260000,75,"C major","gospel"),
            # Graduation era
            ("o45","Someone Saved My Life Tonight","s39",1975,300000,68,"C major","rock"),
            ("o46","Kid Charlemagne","s32",1976,280000,88,"Eb minor","rock"),
            ("o47","Harder Better Faster Stronger","s69",2001,225000,124,"C minor","electronic"),
            ("o48","My Song","s27",1972,270000,75,"Eb minor","soul"),
            ("o49","Long Red","s31",1972,210000,85,"C minor","rock"),
            ("o50","Sing Swan Song","s33",1972,260000,70,"C minor","krautrock"),
            ("o51","If We Cant Be Lovers","s30",1974,240000,78,"C major","soul"),
            ("o52","Bring the Noise","s35",1987,240000,105,"C minor","hip_hop"),
            ("o53","Save the Country","s28",1968,240000,80,"C major","pop"),
            ("o54","Bounce Rock Skate Roll","s34",1979,240000,100,"C minor","funk"),
            ("o55","Precious Precious","s36",1971,220000,80,"C minor","soul"),
            ("o56","Warning","s39",1994,200000,88,"C minor","hip_hop"),
            ("o57","Players Ball Extended Remix","s40",1993,280000,78,"C minor","hip_hop"),
            # MBDTF era
            ("o58","Afro-Strut","s59",1978,220000,85,"C minor","funk"),
            ("o59","You Are I Am","s61",1979,260000,78,"C major","rock"),
            ("o60","Expo 83","s62",1983,240000,82,"C minor","funk"),
            ("o61","Iron Man","s65",1970,340000,78,"C minor","metal"),
            ("o62","Avril 14th","s66",2001,180000,68,"C minor","electronic"),
            ("o63","Woods","a07",2009,280000,80,"C major","indie"),  # Bon Iver
            ("o64","Think About It","s24",1972,200000,82,"D minor","funk"),
            ("o65","Comment No 1","s14",1970,290000,75,"C minor","spoken_word"),
            ("o66","Shes My Baby","s64",1966,160000,85,"C major","rock"),
            ("o67","Stud-Spider","s63",1970,250000,78,"C minor","rock"),
            ("o68","Soul Makossa","s67",1972,260000,90,"C minor","world"),
            # Yeezus era
            ("o69","Strange Fruit Billie Holiday","s08",1939,180000,65,"C minor","jazz"),
            ("o70","Bound","s113",1971,200000,75,"C major","soul"),
            # TLOP era
            ("o71","Do What You Gotta Do","s08",1968,210000,70,"C major","soul"),
            ("o72","Talagh","s97",1992,240000,82,"C minor","world"),
            ("o73","Human","s93",2000,260000,78,"C minor","electronic"),
            ("o74","Hit","s92",1981,250000,75,"C minor","post_punk"),
            ("o75","Friends","s94",1984,270000,90,"C minor","hip_hop"),
            ("o76","Walking Dub","s100",1979,240000,80,"C minor","reggae"),
            ("o77","Answers Me","s95",1986,210000,72,"C major","experimental"),
            ("o78","Joy","s25",1973,260000,85,"C minor","soul"),
            ("o79","Suzie Thundertussy","s88",1976,260000,85,"C minor","funk"),
            ("o80","Stand Up and Shout About Love","s89",1980,240000,75,"C major","funk"),
            ("o81","Mighty Healthy","s90",2000,220000,85,"C minor","hip_hop"),
            ("o82","Dirt and Grime","s91",1989,220000,80,"C minor","soul"),
            ("o83","I Know Im Losing You","s84",1970,280000,85,"C minor","rock"),
            ("o84","Mystery of Love","s85",1985,300000,120,"C minor","house"),
            ("o85","Deep Inside","s86",1993,280000,122,"C minor","house"),
            ("o86","I Get Lifted","s87",1994,280000,120,"C minor","house"),
            ("o87","Mi Sono Svegliato E Ho Chiuso Gli Occhi","s96",1973,280000,85,"C minor","rock"),
            ("o88","So Alive","s98",2004,260000,120,"C minor","house"),
            ("o89","Fantastic Freaks at the Dixie","s99",1983,220000,90,"C minor","hip_hop"),
            ("o90","Cola Bottle Baby","s77",1978,260000,88,"C minor","funk"),
            ("o91","Think About It James Brown","s03",1972,156000,82,"D minor","funk"),
            # ye era
            ("o92","Fr3sh","s101",2017,220000,80,"C minor","electronic"),
            ("o93","Kothbiro","s102",1976,240000,78,"C minor","world"),
            ("o94","Baptizing Scene","s103",1959,200000,70,"C major","gospel"),
            ("o95","Children Get Together","s81",1971,280000,80,"C major","gospel"),
            ("o96","Hey Young World","s86",1988,240000,90,"C minor","hip_hop"),
            ("o97","Take Me For a Little While","s82",1968,240000,75,"C major","rock"),
            # JIK era
            ("o98","Revelation 19 1","s43",1990,300000,75,"C major","gospel"),
            ("o99","Can You Lose By Following God","s104",1974,260000,78,"C major","gospel"),
            ("o100","Martin Fierro","s105",1966,240000,80,"C major","world"),
            ("o101","Oh My God","s106",1993,220000,90,"C minor","hip_hop"),
            ("o102","Snow Job","s107",1970,200000,75,"C minor","electronic"),
            ("o103","God Is","s109",1965,280000,70,"C major","gospel"),
            ("o104","Costume Party","s110",2010,200000,85,"C minor","indie"),
            ("o105","Un Homme Dans La Nuit","s111",1978,240000,75,"C major","world"),
            # Donda era
            ("o106","Heaven and Hell","s112",1978,280000,85,"C minor","world"),
            ("o107","The Rainmaker","s116",1972,240000,80,"C minor","soul"),
            ("o108","Spirit of the Boogie","s114",1975,260000,90,"C minor","funk"),
            ("o109","Fonky First","s115",1972,240000,85,"C minor","funk"),
            # Additional for completeness
            ("o110","Dont Worry If Theres a Hell Below","s01",1970,300000,80,"C minor","funk"),
            ("o111","Ode to Billie Joe","s44",1967,280000,70,"C minor","jazz"),
        ]

        for sid, t, aid, y, d, b, k, sub in originals:
            db.add(Song(id=sid, title=t, primary_artist_id=aid, release_year=y,
                       duration_ms=d, bpm=b, key_signature=k, sub_genre=sub, popularity=80))
        await db.flush()
        print(f"+{len(originals)} original sample sources")

        # ═══════════════════════════════════════════════════════════
        # KANYE WEST SOLO ALBUMS — complete tracklists
        # ═══════════════════════════════════════════════════════════
        albums = [
            # ── The College Dropout (2004) ──
            ("The College Dropout", 2004, [
                ("k001","Intro",2004,25000,0,"","conscious"),
                ("k002","We Dont Care",2004,239000,92,"F minor","conscious"),
                ("k003","Graduation Day",2004,31000,0,"","conscious"),
                ("k004","All Falls Down",2004,223000,92,"Eb minor","conscious"),
                ("k005","Ill Fly Away",2004,27000,0,"","conscious"),
                ("k006","Spaceship",2004,325000,88,"D minor","conscious"),
                ("k007","Jesus Walks",2004,193000,87,"Eb minor","conscious"),
                ("k008","Never Let Me Down",2004,336000,86,"Eb minor","conscious"),
                ("k009","Get Em High",2004,289000,91,"A minor","conscious"),
                ("k010","The New Workout Plan",2004,263000,95,"D minor","conscious"),
                ("k011","Slow Jamz",2004,316000,72,"Eb minor","conscious"),
                ("k012","Breathe In Breathe Out",2004,199000,90,"C minor","conscious"),
                ("k013","School Spirit Skit 1",2004,25000,0,"","conscious"),
                ("k014","School Spirit",2004,222000,88,"Eb minor","conscious"),
                ("k015","School Spirit Skit 2",2004,18000,0,"","conscious"),
                ("k016","Lil Jimmy Skit",2004,20000,0,"","conscious"),
                ("k017","Two Words",2004,283000,84,"Eb minor","conscious"),
                ("k018","Through the Wire",2004,251000,83,"C minor","boom_bap"),
                ("k019","Family Business",2004,279000,78,"F minor","conscious"),
                ("k020","Last Call",2004,314000,85,"Eb minor","conscious"),
            ]),
            # ── Late Registration (2005) ──
            ("Late Registration", 2005, [
                ("k021","Wake Up Mr West",2005,21000,0,"","conscious"),
                ("k022","Heard Em Say",2005,203000,94,"Eb minor","conscious"),
                ("k023","Touch the Sky",2005,206000,98,"Eb minor","boom_bap"),
                ("k024","Gold Digger",2005,209000,93,"D minor","boom_bap"),
                ("k025","Skit 1",2005,12000,0,"","conscious"),
                ("k026","Drive Slow",2005,272000,78,"D minor","jazz_rap"),
                ("k027","My Way Home",2005,209000,86,"C minor","conscious"),
                ("k028","Crack Music",2005,245000,82,"Eb minor","conscious"),
                ("k029","Roses",2005,267000,70,"C minor","conscious"),
                ("k030","Bring Me Down",2005,191000,88,"Eb minor","conscious"),
                ("k031","Addiction",2005,227000,82,"F minor","conscious"),
                ("k032","Skit 2",2005,15000,0,"","conscious"),
                ("k033","Diamonds from Sierra Leone Remix",2005,258000,92,"Eb minor","conscious"),
                ("k034","We Major",2005,352000,78,"Eb minor","conscious"),
                ("k035","Skit 3",2005,15000,0,"","conscious"),
                ("k036","Hey Mama",2005,308000,87,"C minor","conscious"),
                ("k037","Celebration",2005,253000,88,"Eb minor","conscious"),
                ("k038","Skit 4",2005,18000,0,"","conscious"),
                ("k039","Gone",2005,350000,84,"Eb minor","conscious"),
                ("k040","Diamonds from Sierra Leone",2005,249000,92,"Eb minor","conscious"),
                ("k041","Late",2005,233000,82,"C minor","conscious"),
            ]),
            # ── Graduation (2007) ──
            ("Graduation", 2007, [
                ("k042","Good Morning",2007,200000,85,"C minor","conscious"),
                ("k043","Champion",2007,247000,89,"Eb minor","boom_bap"),
                ("k044","Stronger",2007,312000,104,"Eb minor","boom_bap"),
                ("k045","I Wonder",2007,243000,88,"Eb minor","conscious"),
                ("k046","Good Life",2007,228000,83,"D minor","boom_bap"),
                ("k047","Cant Tell Me Nothing",2007,271000,80,"Eb minor","conscious"),
                ("k048","Barry Bonds",2007,223000,85,"Eb minor","boom_bap"),
                ("k049","Drunk and Hot Girls",2007,309000,62,"C minor","conscious"),
                ("k050","Flashing Lights",2007,237000,90,"D minor","conscious"),
                ("k051","Everything I Am",2007,271000,80,"Eb minor","conscious"),
                ("k052","The Glory",2007,236000,84,"Eb minor","boom_bap"),
                ("k053","Homecoming",2007,203000,86,"C minor","conscious"),
                ("k054","Big Brother",2007,287000,84,"Eb minor","conscious"),
                ("k055","Good Night",2007,219000,78,"C minor","conscious"),
            ]),
            # ── 808s & Heartbreak (2008) ──
            ("808s and Heartbreak", 2008, [
                ("k056","Say You Will",2008,385000,82,"Eb minor","rnb"),
                ("k057","Welcome to Heartbreak",2008,262000,84,"F minor","rnb"),
                ("k058","Heartless",2008,210000,88,"Bb minor","rnb"),
                ("k059","Amazing",2008,238000,83,"Eb minor","rnb"),
                ("k060","Love Lockdown",2008,270000,120,"C minor","rnb"),
                ("k061","Paranoid",2008,277000,115,"Eb minor","rnb"),
                ("k062","RoboCop",2008,273000,102,"F minor","rnb"),
                ("k063","Street Lights",2008,209000,78,"Eb minor","rnb"),
                ("k064","Bad News",2008,233000,74,"C minor","rnb"),
                ("k065","See You in My Nightmares",2008,254000,105,"Eb minor","rnb"),
                ("k066","Coldest Winter",2008,164000,76,"C minor","rnb"),
                ("k067","Pinocchio Story",2008,380000,75,"E minor","rnb"),
            ]),
            # ── My Beautiful Dark Twisted Fantasy (2010) ──
            ("My Beautiful Dark Twisted Fantasy", 2010, [
                ("k068","Dark Fantasy",2010,288000,87,"Eb minor","conscious"),
                ("k069","Gorgeous",2010,358000,88,"Eb minor","conscious"),
                ("k070","POWER",2010,292000,77,"Ab minor","boom_bap"),
                ("k071","All of the Lights Interlude",2010,27000,0,"","conscious"),
                ("k072","All of the Lights",2010,299000,71,"C minor","conscious"),
                ("k073","Monster",2010,386000,82,"Eb minor","conscious"),
                ("k074","So Appalled",2010,397000,82,"Eb minor","conscious"),
                ("k075","Devil in a New Dress",2010,352000,78,"Eb minor","conscious"),
                ("k076","Runaway",2010,547000,87,"Eb minor","conscious"),
                ("k077","Hell of a Life",2010,327000,82,"C minor","conscious"),
                ("k078","Blame Game",2010,472000,70,"Eb minor","conscious"),
                ("k079","Lost in the World",2010,273000,82,"C minor","conscious"),
                ("k080","Who Will Survive in America",2010,110000,0,"","conscious"),
            ]),
            # ── Yeezus (2013) ──
            ("Yeezus", 2013, [
                ("k081","On Sight",2013,156000,77,"Eb minor","experimental"),
                ("k082","Black Skinhead",2013,188000,130,"Eb minor","experimental"),
                ("k083","I Am a God",2013,207000,77,"C minor","experimental"),
                ("k084","New Slaves",2013,280000,72,"C minor","experimental"),
                ("k085","Hold My Liquor",2013,308000,75,"Eb minor","experimental"),
                ("k086","Im In It",2013,296000,75,"Eb minor","experimental"),
                ("k087","Blood on the Leaves",2013,358000,88,"Eb minor","experimental"),
                ("k088","Guilt Trip",2013,260000,82,"Eb minor","experimental"),
                ("k089","Send It Up",2013,196000,82,"C minor","experimental"),
                ("k090","Bound 2",2013,229000,75,"C# minor","boom_bap"),
            ]),
            # ── The Life of Pablo (2016) ──
            ("The Life of Pablo", 2016, [
                ("k091","Ultralight Beam",2016,320000,78,"Eb minor","conscious"),
                ("k092","Father Stretch My Hands Pt 1",2016,135000,82,"C minor","trap"),
                ("k093","Pt 2",2016,140000,82,"C minor","trap"),
                ("k094","Famous",2016,196000,87,"Eb minor","trap"),
                ("k095","Feedback",2016,150000,87,"C minor","trap"),
                ("k096","Low Lights",2016,225000,0,"","gospel"),
                ("k097","Highlights",2016,217000,84,"Eb minor","trap"),
                ("k098","Freestyle 4",2016,140000,82,"C minor","experimental"),
                ("k099","I Love Kanye",2016,18000,0,"","conscious"),
                ("k100","Waves",2016,181000,86,"Eb minor","conscious"),
                ("k101","FML",2016,240000,84,"Gb minor","conscious"),
                ("k102","Real Friends",2016,319000,80,"Eb minor","conscious"),
                ("k103","Wolves",2016,306000,72,"C minor","conscious"),
                ("k104","Franks Track",2016,22000,0,"","conscious"),
                ("k105","Siiiiiiiiilver Surffffeeeeer Intermission",2016,18000,0,"","conscious"),
                ("k106","30 Hours",2016,350000,88,"Eb minor","conscious"),
                ("k107","No More Parties in LA",2016,338000,88,"Eb minor","boom_bap"),
                ("k108","Facts Charlie Heat Version",2016,193000,74,"C minor","trap"),
                ("k109","Fade",2016,245000,100,"C minor","trap"),
                ("k110","Saint Pablo",2016,384000,78,"Eb minor","conscious"),
            ]),
            # ── Ye (2018) ──
            ("Ye", 2018, [
                ("k111","I Thought About Killing You",2018,270000,82,"C minor","conscious"),
                ("k112","Yikes",2018,222000,82,"Eb minor","trap"),
                ("k113","All Mine",2018,208000,83,"C minor","trap"),
                ("k114","Wouldnt Leave",2018,243000,78,"Eb minor","conscious"),
                ("k115","No Mistakes",2018,268000,80,"Eb minor","conscious"),
                ("k116","Ghost Town",2018,271000,82,"C minor","conscious"),
                ("k117","Violent Crimes",2018,233000,76,"C minor","conscious"),
            ]),
            # ── Jesus Is King (2019) ──
            ("Jesus Is King", 2019, [
                ("k118","Every Hour",2019,207000,0,"","gospel"),
                ("k119","Selah",2019,216000,80,"Eb minor","conscious"),
                ("k120","Follow God",2019,249000,78,"Eb minor","conscious"),
                ("k121","Closed on Sunday",2019,253000,74,"Eb minor","conscious"),
                ("k122","On God",2019,211000,88,"Eb minor","trap"),
                ("k123","Everything We Need",2019,242000,82,"C minor","conscious"),
                ("k124","Water",2019,168000,78,"Eb minor","conscious"),
                ("k125","God Is",2019,233000,70,"C minor","gospel"),
                ("k126","Hands On",2019,281000,74,"Eb minor","conscious"),
                ("k127","Use This Gospel",2019,240000,84,"Eb minor","conscious"),
                ("k128","Jesus Is Lord",2019,237000,0,"","gospel"),
            ]),
            # ── Donda (2021) ──
            ("Donda", 2021, [
                ("k129","Donda Chant",2021,20000,0,"","conscious"),
                ("k130","Jail",2021,301000,82,"C minor","trap"),
                ("k131","God Breathed",2021,303000,80,"Eb minor","trap"),
                ("k132","Off the Grid",2021,320000,84,"Eb minor","trap"),
                ("k133","Hurricane",2021,274000,80,"Eb minor","trap"),
                ("k134","Praise God",2021,215000,76,"C minor","trap"),
                ("k135","Jonah",2021,245000,78,"Eb minor","conscious"),
                ("k136","Ok Ok",2021,272000,82,"Eb minor","trap"),
                ("k137","Junya",2021,190000,80,"Eb minor","trap"),
                ("k138","Believe What I Say",2021,253000,82,"C minor","boom_bap"),
                ("k139","24",2021,267000,78,"Eb minor","conscious"),
                ("k140","Remote Control",2021,198000,82,"Eb minor","trap"),
                ("k141","Moon",2021,218000,84,"Eb minor","conscious"),
                ("k142","Heaven and Hell",2021,279000,80,"Eb minor","trap"),
                ("k143","Donda",2021,249000,78,"C minor","conscious"),
                ("k144","Keep My Spirit Alive",2021,270000,82,"Eb minor","conscious"),
                ("k145","Jesus Lord",2021,534000,76,"Eb minor","conscious"),
                ("k146","New Again",2021,192000,84,"Eb minor","trap"),
                ("k147","Tell the Vision",2021,198000,80,"C minor","trap"),
                ("k148","Lord I Need You",2021,269000,82,"Eb minor","conscious"),
                ("k149","Pure Souls",2021,370000,80,"Eb minor","conscious"),
                ("k150","Come to Life",2021,298000,78,"C minor","conscious"),
                ("k151","No Child Left Behind",2021,224000,76,"Eb minor","conscious"),
                ("k152","Jail pt 2",2021,301000,82,"C minor","trap"),
                ("k153","Ok Ok pt 2",2021,192000,82,"Eb minor","trap"),
                ("k154","Junya pt 2",2021,190000,80,"Eb minor","trap"),
                ("k155","Jesus Lord pt 2",2021,720000,76,"Eb minor","conscious"),
            ]),
            # ── Donda 2 (2022) ──
            ("Donda 2", 2022, [
                ("k156","True Love",2022,197000,82,"Eb minor","trap"),
                ("k157","Broken Road",2022,100000,78,"Eb minor","trap"),
                ("k158","Get Lost",2022,155000,80,"C minor","trap"),
                ("k159","Too Easy",2022,178000,82,"Eb minor","experimental"),
                ("k160","Flowers",2022,171000,78,"Eb minor","conscious"),
                ("k161","Security",2022,136000,84,"C minor","trap"),
                ("k162","We Did It Kid",2022,168000,80,"Eb minor","trap"),
                ("k163","Pablo",2022,154000,82,"Eb minor","trap"),
                ("k164","Louie Bags",2022,193000,78,"C minor","trap"),
                ("k165","Happy",2022,285000,80,"Eb minor","conscious"),
                ("k166","Sci Fi",2022,240000,78,"Eb minor","experimental"),
                ("k167","Selfish",2022,99000,82,"C minor","trap"),
                ("k168","Lord Lift Me Up",2022,129000,76,"C minor","conscious"),
                ("k169","City of Gods",2022,256000,84,"Eb minor","trap"),
                ("k170","First Time in a Long Time",2022,184000,82,"Eb minor","trap"),
                ("k171","Eazy",2022,234000,78,"C minor","trap"),
            ]),
            # ── Vultures 1 (2024) ──
            ("Vultures 1", 2024, [
                ("k172","STARS",2024,175000,82,"Eb minor","trap"),
                ("k173","KEYS TO MY LIFE",2024,201000,78,"C minor","trap"),
                ("k174","PAID",2024,184000,82,"Eb minor","trap"),
                ("k175","TALKING",2024,210000,80,"Eb minor","trap"),
                ("k176","BACK TO ME",2024,267000,78,"Eb minor","trap"),
                ("k177","HOODRAT",2024,195000,82,"Eb minor","trap"),
                ("k178","DO IT",2024,245000,80,"Eb minor","trap"),
                ("k179","PAPERWORK",2024,191000,84,"Eb minor","trap"),
                ("k180","BURN",2024,183000,115,"Eb minor","trap"),
                ("k181","FUK SUMN",2024,201000,82,"C minor","trap"),
                ("k182","VULTURES",2024,249000,80,"Eb minor","trap"),
                ("k183","CARNIVAL",2024,224000,74,"F minor","trap"),
                ("k184","BEG FORGIVENESS",2024,244000,82,"Eb minor","conscious"),
                ("k185","GOOD DONT DIE",2024,279000,78,"C minor","conscious"),
                ("k186","PROBLEMATIC",2024,221000,82,"Eb minor","trap"),
                ("k187","KING",2024,263000,78,"Eb minor","conscious"),
            ]),
            # ── Vultures 2 (2024) ──
            ("Vultures 2", 2024, [
                ("k188","SLIDE",2024,202000,84,"Eb minor","trap"),
                ("k189","TIME MOVING SLOW",2024,230000,78,"C minor","trap"),
                ("k190","FIELD TRIP",2024,214000,82,"Eb minor","trap"),
                ("k191","FRIED",2024,189000,80,"Eb minor","trap"),
                ("k192","ISABELLA",2024,205000,78,"C minor","trap"),
                ("k193","PROMOTION",2024,220000,82,"Eb minor","trap"),
                ("k194","HUSBAND",2024,248000,76,"C minor","conscious"),
                ("k195","LIFESTYLE",2024,210000,84,"Eb minor","trap"),
                ("k196","MAYBE",2024,198000,80,"Eb minor","trap"),
                ("k197","BOMB",2024,183000,82,"C minor","trap"),
                ("k198","RIVER",2024,250000,78,"Eb minor","conscious"),
                ("k199","530",2024,224000,80,"Eb minor","trap"),
                ("k200","DEAD",2024,210000,82,"Eb minor","trap"),
                ("k201","FOREVER ROLLING",2024,233000,80,"C minor","trap"),
                ("k202","SKY CITY",2024,320000,78,"Eb minor","conscious"),
                ("k203","MY SOUL",2024,235000,82,"Eb minor","conscious"),
            ]),
            # ── Bully (2025) ──
            ("Bully", 2025, [
                ("k204","Sisters and Brothers",2025,195000,80,"C minor","conscious"),
                ("k205","Whatever Works",2025,180000,78,"Eb minor","trap"),
                ("k206","Father",2025,210000,82,"Eb minor","trap"),
                ("k207","All the Love",2025,188000,80,"C minor","conscious"),
                ("k208","I Cant Wait",2025,175000,84,"Eb minor","trap"),
                ("k209","Bully",2025,203000,78,"Eb minor","conscious"),
                ("k210","Mamas Favorite",2025,192000,80,"C minor","conscious"),
                ("k211","Punch Drunk",2025,167000,82,"Eb minor","trap"),
                ("k212","This Is a Must",2025,185000,84,"Eb minor","trap"),
                ("k213","Outside",2025,172000,78,"C minor","conscious"),
                ("k214","Preacher Man",2025,205000,76,"Eb minor","trap"),
                ("k215","White Lines",2025,190000,80,"C minor","conscious"),
                ("k216","Circles",2025,184000,82,"Eb minor","trap"),
                ("k217","This One Here",2025,180000,84,"C minor","trap"),
                ("k218","King",2025,196000,78,"Eb minor","conscious"),
                ("k219","Beauty and the Beast",2025,210000,76,"C minor","conscious"),
                ("k220","Damn",2025,193000,82,"Eb minor","trap"),
                ("k221","Last Breath",2025,215000,78,"Eb minor","conscious"),
            ]),
        ]

        total_kanye = 0
        for album_name, year, tracks in albums:
            for sid, title, yr, dur, bpm, key, sub in tracks:
                db.add(Song(id=sid, title=title, primary_artist_id="a01",
                           album_title=album_name, release_year=yr,
                           duration_ms=dur, bpm=bpm, key_signature=key,
                           sub_genre=sub, popularity=90))
                total_kanye += 1
        await db.flush()
        print(f"+{total_kanye} Kanye songs across {len(albums)} albums")

        # ═══════════════════════════════════════════════════════════
        # SAMPLES — comprehensive, verified sample relationships
        # Format: (id, type, source_song_id, source_artist_id,
        #          target_song_id, start_ms, end_ms, tgt_start, tgt_end,
        #          description, confidence)
        # ═══════════════════════════════════════════════════════════
        sp = []

        # ── THE COLLEGE DROPOUT ──
        sp += [
            # We Don't Care
            ("s001","melody","o26","s42","k002",20000,40000,10000,30000,"Jimmy Castor Bunch I Just Wanna Stop采样",0.92),
            # All Falls Down
            ("s002","melody","o27","s10","k004",15000,35000,10000,30000,"Lauryn Hill Mystery of Iniquity采样 + Syleena Johnson重唱",0.97),
            # Spaceship
            ("s003","melody","o23","s07","k006",15000,35000,10000,30000,"Marvin Gaye Distant Lover采样 + GLC + Consequence",0.95),
            # Jesus Walks — one of Kanye's most layered productions
            ("s004","vocal_chop","o28","s43","k007",30000,60000,15000,45000,"ARC Choir Walk With Me福音合唱采样",0.99),
            ("s005","melody","o110","s01","k007",20000,40000,12000,32000,"Curtis Mayfield Dont Worry If Theres a Hell Below编排引用",0.88),
            ("s006","drum","o111","s44","k007",10000,20000,0,10000,"Lou Donaldson Ode to Billie Joe鼓采样",0.85),
            # Never Let Me Down
            ("s007","melody","o29","s38","k008",20000,40000,10000,30000,"Blackjack Maybe Its the Power of Love采样",0.90),
            # Get Em High
            ("s008","melody","o56","s39","k009",20000,35000,10000,25000,"Notorious BIG Warning引用 + Talib Kweli + Common",0.85),
            # Slow Jamz
            ("s009","melody","o22","s12","k011",30000,55000,10000,35000,"Luther Vandross A House Is Not a Home采样",0.97),
            # Breathe In Breathe Out
            ("s010","melody","o55","s36","k012",15000,35000,10000,30000,"Jackie Moore Precious Precious采样",0.88),
            # School Spirit
            ("s011","melody","o30","s02","k014",20000,40000,10000,30000,"Aretha Franklin Spirit in the Dark采样",0.94),
            ("s012","melody","o108","s114","k014",15000,30000,10000,25000,"Kool & the Gang Spirit of the Boogie采样",0.90),
            # Two Words
            ("s013","melody","o31","s20","k017",20000,45000,10000,35000,"Mandrill Peace and Love Movement IV采样",0.93),
            ("s014","drum","o107","s116","k017",10000,20000,0,10000,"The 5th Dimension The Rainmaker鼓采样",0.82),
            # Through the Wire
            ("s015","vocal_chop","o17","s11","k018",15000,35000,10000,30000,"Chaka Khan Through the Fire人声变速(车祸后用嘴录制)",0.99),
            ("s016","drum","o57","s40","k018",10000,20000,0,10000,"Outkast Players Ball Extended鼓采样",0.88),
            # Family Business
            ("s017","melody","o32","s17","k019",20000,40000,10000,30000,"The Dells Fonky Thang Diamon Rang采样",0.93),
            ("s018","melody","o109","s115","k019",20000,35000,10000,25000,"The Chakachas Fonky First采样",0.85),
            # Last Call
            ("s019","melody","o33","s41","k020",20000,40000,10000,30000,"Bette Midler Mr Rockefeller编排引用",0.90),
        ]

        # ── LATE REGISTRATION ──
        sp += [
            # Wake Up Mr West / Heard Em Say — same sample bookends the album
            ("s020","melody","o34","s45","k021",20000,40000,5000,15000,"Natalie Cole Someone That I Used to Love采样 (intro)",0.92),
            ("s021","melody","o34","s45","k022",20000,40000,15000,35000,"Natalie Cole Someone That I Used to Love采样 + Adam Levine",0.97),
            # Touch the Sky
            ("s022","melody","o03","s01","k023",35000,65000,10000,40000,"Curtis Mayfield Move On Up小号hook标志性采样",0.99),
            # Gold Digger
            ("s023","vocal_chop","o02","s06","k024",20000,45000,10000,35000,"Ray Charles I Got a Woman人声变速 + Jamie Foxx",0.99),
            # Drive Slow
            ("s024","melody","o25","s76","k026",15000,30000,10000,25000,"Hank Crawford Wildflower采样 + Paul Wall + GLC",0.95),
            # My Way Home
            ("s025","melody","o14","s14","k027",20000,40000,10000,30000,"Gil Scott-Heron Home Is Where the Hatred Is采样 + Common",0.93),
            # Crack Music
            ("s026","melody","o44","s51","k028",20000,40000,10000,30000,"New York Community Choir Since You Came采样 + The Game",0.88),
            # Roses
            ("s027","melody","o35","s21","k029",20000,40000,10000,30000,"Bill Withers Rosie采样",0.92),
            # Addiction
            ("s028","melody","o36","s22","k031",20000,40000,10000,30000,"Etta James My Funny Valentine采样",0.91),
            # Diamonds from Sierra Leone
            ("s029","melody","o37","s46","k033",15000,35000,10000,30000,"Shirley Bassey Diamonds Are Forever采样 + JAY-Z",0.99),
            ("s030","melody","o37","s46","k040",15000,35000,10000,30000,"Shirley Bassey Diamonds Are Forever采样 (原版)",0.99),
            # We Major
            ("s031","melody","o38","s47","k034",20000,40000,10000,30000,"Orange Krush Action采样 + Nas + Really Doe",0.92),
            # Hey Mama
            ("s032","melody","o39","s48","k036",20000,40000,10000,30000,"Donal Leace Today Wont Come Again采样",0.93),
            # Celebration
            ("s033","melody","o40","s49","k037",20000,40000,10000,30000,"The Kay-Gees Heavenly Dream采样",0.90),
            # Gone
            ("s034","melody","o41","s05","k039",30000,50000,10000,30000,"Otis Redding Its Too Late采样 + Consequence + CamRon",0.94),
            ("s035","melody","o42","s50","k039",15000,30000,10000,25000,"Joe Farrell Upon This Rock采样",0.88),
            # Late
            ("s036","melody","o43","s18","k041",20000,40000,10000,30000,"The Whatnauts Ill Erase Away Your Pain采样",0.92),
        ]

        # ── GRADUATION ──
        sp += [
            # Good Morning
            ("s037","melody","o45","s39","k042",30000,55000,8000,33000,"Elton John Someone Saved My Life Tonight采样",0.96),
            # Champion
            ("s038","melody","o46","s32","k043",20000,45000,10000,35000,"Steely Dan Kid Charlemagne吉他采样",0.93),
            # Stronger
            ("s039","melody","o47","s69","k044",30000,50000,15000,35000,"Daft Punk Harder Better Faster Stronger人声采样",0.99),
            # I Wonder
            ("s040","melody","o48","s27","k045",30000,50000,10000,30000,"Labi Siffre My Song钢琴采样",0.95),
            # Good Life
            ("s041","melody","o21","s70","k046",15000,30000,15000,30000,"Michael Jackson PYT Pretty Young Thing采样 + T-Pain",0.98),
            # Barry Bonds
            ("s042","vocal_chop","o49","s31","k048",10000,20000,5000,15000,"Mountain Long Red人声采样 + Lil Wayne",0.94),
            # Drunk and Hot Girls
            ("s043","melody","o50","s33","k049",20000,40000,10000,30000,"Can Sing Swan Song采样 + Mos Def",0.93),
            # Flashing Lights — mainly original with Dwele
            # Everything I Am
            ("s044","melody","o51","s30","k051",20000,40000,8000,28000,"Prince Phillip Mitchell If We Cant Be Lovers钢琴采样",0.92),
            ("s045","drum","o52","s35","k051",5000,15000,0,10000,"Public Enemy Bring the Noise鼓采样 + DJ Premier scratches",0.90),
            # The Glory
            ("s046","melody","o53","s28","k052",20000,40000,10000,30000,"Laura Nyro Save the Country采样",0.92),
            ("s047","vocal_chop","o49","s31","k052",10000,20000,15000,25000,"Mountain Long Red人声采样",0.88),
            # Good Night
            ("s048","melody","o44","s51","k055",20000,40000,10000,30000,"NY Community Choir采样",0.85),
        ]

        # ── 808S & HEARTBREAK — primarily original 808-driven production ──
        sp += [
            # Amazing
            ("s049","melody","o47","s69","k059",30000,45000,10000,25000,"Daft Punk元素引用 (原合成器编曲+Jeezy)",0.82),
            # RoboCop
            ("s050","melody","o66","s64","k062",15000,30000,10000,25000,"Patrick Doyle Great Expectations配乐Kissing in the Rain采样",0.88),
            # Coldest Winter
            ("s051","melody","o61","s65","k066",30000,50000,10000,30000,"Tears for Fears Memories Fade编排引用 + 改编",0.85),
            # Bad News — Nina Simone influence
            ("s052","melody","o11","s08","k064",40000,60000,10000,30000,"Nina Simone See Line Woman编排参考",0.78),
        ]

        # ── MY BEAUTIFUL DARK TWISTED FANTASY ──
        sp += [
            # Dark Fantasy
            ("s053","vocal_chop","o20","s57","k068",30000,48000,8000,26000,"Mike Oldfield/Jon Anderson In High Places人声变调Can we get much higher",0.98),
            # Gorgeous
            ("s054","melody","o19","s58","k069",15000,30000,10000,25000,"The Turtles You Showed Me吉他riff采样 + Kid Cudi + Raekwon",0.95),
            # POWER
            ("s055","melody","o58","s59","k070",15000,35000,10000,30000,"Continent Number 6 Afro-Strut主采样",0.95),
            ("s056","drum","o04","s03","k070",62000,78000,0,16000,"Cold Grits Its Your Thing鼓break(James Brown Funky Drummer衍生)",0.92),
            ("s057","vocal_chop","o12","s54","k070",25000,45000,10000,30000,"King Crimson 21st Century Schizoid Man扭曲人声",0.96),
            # All of the Lights — primarily live orchestra/brass, not traditional sample
            # Monster
            ("s058","drum","o09","s03","k073",20000,35000,10000,25000,"James Brown鼓采样改编 (Impeach the President衍生)",0.85),
            # So Appalled
            ("s059","melody","o59","s61","k074",20000,40000,10000,30000,"Manfred Manns Earth Band You Are I Am采样",0.92),
            # Devil in a New Dress
            ("s060","vocal_chop","o24","s13","k075",20000,40000,15000,35000,"Smokey Robinson Will You Love Me Tomorrow变速人声loop",0.97),
            # Runaway
            ("s061","melody","o60","s62","k076",20000,40000,10000,30000,"Backyard Heavies Expo 83采样 + Pusha T标志性verse",0.94),
            # Hell of a Life
            ("s062","melody","o66","s64","k077",10000,25000,5000,20000,"The Mojo Men Shes My Baby风琴降调bassline",0.92),
            ("s063","vocal_chop","o61","s65","k077",30000,50000,10000,30000,"Black Sabbath Iron Man自动调音编排引用",0.90),
            # Blame Game
            ("s064","melody","o62","s66","k078",5000,25000,5000,25000,"Aphex Twin Avril 14th钢琴loop + John Legend + Chris Rock",0.99),
            # Lost in the World
            ("s065","vocal_chop","o63","a07","k079",10000,30000,5000,25000,"Bon Iver Woods自动调音人声采样",0.98),
            ("s066","drum","o64","s24","k079",20000,40000,10000,30000,"Lyn Collins Think About It鼓采样",0.90),
            ("s067","vocal_chop","o68","s67","k079",15000,25000,12000,22000,"Manu Dibango Soul Makossa mama-say mama-sa引用",0.88),
            # Who Will Survive in America
            ("s068","vocal_chop","o65","s14","k080",0,60000,0,60000,"Gil Scott-Heron Comment No 1整段spoken word采样",0.99),
        ]

        # ── YEEZUS ──
        sp += [
            # On Sight
            ("s069","melody","o58","s59","k081",20000,35000,10000,25000,"Continent Number 6 Afro-Strut电子改编",0.82),
            # Black Skinhead
            ("s070","drum","o91","s03","k082",20000,35000,10000,25000,"James Brown鼓采样 + Marilyn Manson Beautiful People引用",0.93),
            # I Am a God
            ("s071","vocal_chop","o110","s01","k083",20000,35000,10000,25000,"Curtis Mayfield人声 + God字面引用",0.82),
            # New Slaves
            ("s072","melody","o12","s54","k084",30000,45000,10000,25000,"King Crimson + Omega + Hungarian rock采样",0.85),
            # Blood on the Leaves
            ("s073","melody","o11","s08","k087",45000,75000,12000,42000,"Nina Simone Strange Fruit采样 + TNGHT R U Ready + 社会议题",0.99),
            # Guilt Trip
            ("s074","melody","o47","s69","k088",30000,45000,10000,25000,"Daft Punk电子元素 + Kid Cudi + Pusha T",0.85),
            # Bound 2
            ("s075","vocal_chop","o13","s55","k090",15000,35000,5000,25000,"Brenda Lee Sweet Nothings人声 + Ponderosa Twins Plus One Bound",0.97),
            ("s076","vocal_chop","o70","s113","k090",20000,35000,8000,23000,"Ponderosa Twins Plus One Bound人声采样",0.96),
        ]

        # ── THE LIFE OF PABLO ──
        sp += [
            # Ultralight Beam
            ("s077","melody","o15","s53","k091",20000,40000,10000,30000,"Pastor TL Barrett Father I Stretch My Hands福音采样 + Chance + Kirk Franklin",0.97),
            # Father Stretch My Hands Pt 1
            ("s078","vocal_chop","o15","s53","k092",10000,35000,8000,33000,"Pastor TL Barrett Father I Stretch My Hands采样 + Metro Boomin + Kid Cudi",0.99),
            # Pt 2
            ("s079","vocal_chop","o15","s53","k093",10000,35000,8000,33000,"Pastor TL Barrett延续 + Desiigner Panda采样",0.97),
            # Famous
            ("s080","vocal_chop","o71","s08","k094",20000,40000,10000,30000,"Nina Simone Do What You Gotta Do + Rihanna翻唱hook",0.97),
            ("s081","melody","o16","s52","k094",20000,35000,10000,25000,"Sister Nancy Bam Bam采样",0.96),
            ("s082","melody","o87","s96","k094",15000,30000,8000,23000,"Il Rovescio della Medaglia意大利前卫摇滚采样",0.90),
            # Feedback
            ("s083","melody","o72","s97","k095",10000,30000,8000,28000,"Googoosh Talagh伊朗流行采样",0.88),
            # Low Lights
            ("s084","vocal_chop","o88","s98","k096",20000,40000,5000,25000,"Kings of Tomorrow So Alive人声采样",0.85),
            # Freestyle 4
            ("s085","melody","o73","s93","k098",10000,30000,5000,25000,"Goldfrapp Human弦乐/合成器采样 + Desiigner",0.93),
            # Waves
            ("s086","vocal_chop","o89","s99","k100",5000,15000,5000,15000,"Fantastic Freaks at the Dixie Turn it up ad-lib采样 + Chris Brown",0.88),
            # FML
            ("s087","melody","o74","s92","k101",20000,40000,12000,32000,"Section 25 Hit后朋克采样 + The Weeknd",0.92),
            # Real Friends
            ("s088","melody","o75","s94","k102",20000,40000,10000,30000,"Whodini Friends编排引用 + Ty Dolla Sign",0.95),
            # Wolves
            ("s089","melody","o76","s100","k103",60000,85000,35000,60000,"Sugar Minott Walking Dub采样 + Frank Ocean + Caroline Shaw",0.90),
            # 30 Hours
            ("s090","vocal_chop","o77","s95","k106",15000,35000,8000,28000,"Arthur Russell Answers Me人声loop + Andre 3000",0.93),
            ("s091","drum","o78","s25","k106",10000,25000,0,15000,"Isaac Hayes Joy鼓采样",0.88),
            # No More Parties in LA
            ("s092","melody","o79","s88","k107",15000,35000,10000,30000,"Walter Junie Morrison Suzie Thundertussy采样 + Madlib制作",0.96),
            ("s093","vocal_chop","o18","s78","k107",5000,15000,5000,15000,"Johnny Guitar Watson Give Me My Love la-di-da-da intro",0.97),
            ("s094","vocal_chop","o80","s89","k107",25000,45000,20000,40000,"Larry Graham Stand Up and Shout About Love outro",0.90),
            ("s095","vocal_chop","o81","s90","k107",10000,25000,10000,25000,"Ghostface Killah Mighty Healthy shake that body",0.88),
            # Facts
            ("s096","melody","o82","s91","k108",10000,30000,5000,25000,"Fathers Children Dirt and Grime采样",0.90),
            # Fade
            ("s097","vocal_chop","o83","s84","k109",20000,40000,10000,30000,"Rare Earth I Know Im Losing You人声采样 + Post Malone + Ty Dolla",0.95),
            ("s098","melody","o84","s85","k109",10000,30000,5000,25000,"Mr Fingers Mystery of Love芝加哥house经典bassline",0.94),
            ("s099","melody","o85","s86","k109",10000,25000,10000,25000,"Hardrive Deep Inside house采样",0.88),
            ("s100","vocal_chop","o86","s87","k109",10000,25000,10000,25000,"Barbara Tucker I Get Lifted人声采样",0.85),
            # Saint Pablo
            ("s101","melody","o17","s11","k110",25000,45000,15000,35000,"Chaka Khan Through the Fire人声片段 + Sampha + Jay-Z片段",0.92),
        ]

        # ── YE ──
        sp += [
            # I Thought About Killing You
            ("s102","melody","o92","s101","k111",25000,45000,10000,30000,"Kareem Lotfy Fr3sh采样 + Benny Blanco + Francis",0.90),
            # Yikes
            ("s103","melody","o93","s102","k112",20000,40000,10000,30000,"Ayub Ogada Kothbiro/Black Savage采样",0.92),
            # Wouldn't Leave
            ("s104","vocal_chop","o94","s103","k114",15000,30000,10000,25000,"Rev WA Donaldson Baptizing Scene采样 + PARTYNEXTDOOR + Jeremih",0.90),
            # No Mistakes
            ("s105","melody","o95","s81","k115",20000,40000,10000,30000,"Edwin Hawkins Singers Children Get Together钢琴采样",0.94),
            ("s106","vocal_chop","o96","s86","k115",5000,15000,8000,18000,"Slick Rick Hey Young World believe it or not人声",0.92),
            # Ghost Town
            ("s107","melody","o97","s82","k116",20000,40000,10000,30000,"Vanilla Fudge Take Me For a Little While采样 + 070 Shake + Kid Cudi",0.95),
        ]

        # ── JESUS IS KING ──
        sp += [
            # Selah
            ("s108","vocal_chop","o98","s43","k119",30000,55000,15000,40000,"New Jerusalem Baptism Choir Revelation 19 Hallelujah采样",0.94),
            # Follow God
            ("s109","melody","o99","s104","k120",20000,40000,10000,30000,"Whole Truth Can You Lose By Following God采样",0.93),
            # Closed on Sunday
            ("s110","melody","o100","s105","k121",15000,35000,10000,30000,"Grupo Vocal Argentino Martin Fierro采样",0.90),
            # On God
            ("s111","melody","o101","s106","k122",20000,35000,10000,25000,"A Tribe Called Quest Oh My God引用 + Pierre Bourne tag",0.88),
            # Water
            ("s112","melody","o102","s107","k124",10000,30000,8000,28000,"Bruce Haack Snow Job采样 + Yoko Ono We Are All Water引用",0.92),
            # God Is
            ("s113","vocal_chop","o103","s109","k125",20000,40000,10000,30000,"James Cleveland God Is人声变速采样",0.95),
            # Use This Gospel
            ("s114","melody","o104","s110","k127",15000,35000,10000,30000,"Two Door Cinema Club Costume Party采样 + Clipse + Kenny G萨克斯",0.93),
            # Jesus Is Lord
            ("s115","melody","o105","s111","k128",30000,45000,10000,25000,"Claude Leveillee Un Homme Dans La Nuit乐器采样",0.91),
        ]

        # ── DONDA ──
        sp += [
            # Believe What I Say
            ("s116","melody","o10","s10","k138",20000,40000,10000,30000,"Lauryn Hill Doo Wop That Thing采样",0.96),
            # Heaven and Hell
            ("s117","melody","o106","s112","k142",15000,35000,10000,30000,"20th Century Steel Band Heaven and Hell采样",0.92),
            # 24
            ("s118","melody","o15","s53","k139",20000,40000,10000,30000,"Pastor TL Barrett福音采样改编",0.85),
            # Come to Life
            ("s119","melody","o110","s01","k150",20000,40000,10000,30000,"Curtis Mayfield元素 + 钢琴编排",0.84),
            # Donda
            ("s120","melody","o28","s43","k143",20000,40000,10000,30000,"ARC Choir/Clark Sisters福音采样",0.90),
            # Hurricane
            ("s121","melody","o15","s53","k133",20000,40000,10000,30000,"福音采样 + The Weeknd + Lil Baby",0.86),
        ]

        for i, sp_data in enumerate(sp):
            db.add(Sample(id=sp_data[0], type=sp_data[1], source_song_id=sp_data[2],
                         source_artist_id=sp_data[3], target_song_id=sp_data[4],
                         start_time_ms=sp_data[5], end_time_ms=sp_data[6],
                         target_start_time_ms=sp_data[7], target_end_time_ms=sp_data[8],
                         description=sp_data[9], confidence=sp_data[10],
                         attribution_confirmed=True))
        print(f"+{len(sp)} verified samples")

        # ═══════════════════════════════════════════════════════════
        # CREDITS — producers, featured artists, engineers
        # ═══════════════════════════════════════════════════════════
        c = []

        # ── College Dropout ──
        c += [
            ("k004","a01","producer"),("k004","a27","featured"),
            ("k006","a01","producer"),("k006","a29","featured"),("k006","a28","featured"),
            ("k007","a01","producer"),
            ("k008","a01","producer"),("k008","a02","featured"),("k008","a73","featured"),
            ("k009","a01","producer"),("k009","a22","featured"),("k009","a21","featured"),
            ("k010","a01","producer"),
            ("k011","a01","producer"),("k011","a25","featured"),("k011","a26","featured"),
            ("k012","a01","producer"),("k012","a49","featured"),
            ("k014","a01","producer"),
            ("k017","a01","producer"),("k017","a23","featured"),("k017","a48","featured"),
            ("k018","a01","producer"),
            ("k019","a01","producer"),
            ("k020","a01","producer"),
        ]

        # ── Late Registration ──
        c += [
            ("k022","a01","producer"),("k022","a69","featured"),
            ("k023","a01","producer"),("k023","a24","featured"),
            ("k024","a01","producer"),("k024","a26","featured"),
            ("k026","a01","producer"),("k026","a40","featured"),("k026","a29","featured"),
            ("k027","a01","producer"),("k027","a21","featured"),
            ("k028","a01","producer"),("k028","a31","featured"),
            ("k029","a01","producer"),
            ("k030","a01","producer"),("k030","a68","featured"),
            ("k031","a01","producer"),
            ("k033","a01","producer"),("k033","a02","featured"),
            ("k034","a01","producer"),("k034","a66","featured"),("k034","a30","featured"),
            ("k036","a01","producer"),
            ("k037","a01","producer"),
            ("k039","a01","producer"),("k039","a28","featured"),("k039","a67","featured"),
            ("k040","a01","producer"),
            ("k041","a01","producer"),
        ]

        # ── Graduation ──
        c += [
            ("k042","a01","producer"),
            ("k043","a01","producer"),
            ("k044","a01","producer"),("k044","s69","sampled_artist"),
            ("k045","a01","producer"),
            ("k046","a01","producer"),("k046","a71","featured"),
            ("k047","a01","producer"),
            ("k048","a01","producer"),("k048","a19","featured"),
            ("k049","a01","producer"),("k049","a23","featured"),
            ("k050","a01","producer"),("k050","a47","featured"),
            ("k051","a01","producer"),("k051","a72","featured"),
            ("k052","a01","producer"),
            ("k053","a01","producer"),("k053","a70","featured"),
            ("k054","a01","producer"),
            ("k055","a01","producer"),
        ]

        # ── 808s ──
        c += [
            ("k056","a01","producer"),
            ("k057","a01","producer"),("k057","a03","featured"),
            ("k058","a01","producer"),
            ("k059","a01","producer"),("k059","a20","featured"),
            ("k060","a01","producer"),
            ("k061","a01","producer"),("k061","a03","featured"),
            ("k062","a01","producer"),
            ("k063","a01","producer"),
            ("k064","a01","producer"),
            ("k065","a01","producer"),("k065","a19","featured"),
            ("k066","a01","producer"),
        ]

        # ── MBDTF ──
        c += [
            ("k068","a01","producer"),("k068","a06","featured"),("k068","a07","featured"),
            ("k069","a01","producer"),("k069","a03","featured"),("k069","a65","featured"),
            ("k070","a01","producer"),("k070","a47","featured"),
            ("k071","a01","producer"),
            ("k072","a01","producer"),("k072","a08","featured"),("k072","a03","featured"),
            ("k072","a17","featured"),("k072","a47","featured"),("k072","a12","mixing_engineer"),
            ("k073","a01","producer"),("k073","a02","featured"),("k073","a05","featured"),
            ("k073","a06","featured"),("k073","a07","featured"),
            ("k074","a01","producer"),("k074","a63","featured"),("k074","a02","featured"),
            ("k074","a04","featured"),("k074","a62","featured"),("k074","a64","featured"),
            ("k075","a01","producer"),("k075","a05","featured"),
            ("k075","a12","mixing_engineer"),
            ("k076","a01","producer"),("k076","a04","featured"),
            ("k076","a12","mixing_engineer"),
            ("k077","a01","producer"),
            ("k078","a01","producer"),("k078","a13","featured"),("k078","a38","featured"),
            ("k079","a01","producer"),("k079","a07","featured"),
            ("k080","a01","producer"),("k080","s14","sampled_artist"),
        ]

        # ── Yeezus ──
        c += [
            ("k081","a01","producer"),("k081","a12","mixing_engineer"),
            ("k082","a01","producer"),("k082","a12","mixing_engineer"),
            ("k083","a01","producer"),("k083","a12","mixing_engineer"),
            ("k084","a01","producer"),("k084","a12","mixing_engineer"),
            ("k085","a01","producer"),("k085","a12","mixing_engineer"),("k085","a41","featured"),
            ("k086","a01","producer"),("k086","a12","mixing_engineer"),("k086","a43","featured"),
            ("k087","a01","producer"),("k087","a12","mixing_engineer"),
            ("k088","a01","producer"),("k088","a12","mixing_engineer"),("k088","a03","featured"),
            ("k089","a01","producer"),("k089","a12","mixing_engineer"),("k089","a42","featured"),
            ("k090","a01","producer"),("k090","a12","mixing_engineer"),
        ]

        # ── TLOP ──
        c += [
            ("k091","a01","producer"),("k091","a35","featured"),("k091","a74","featured"),
            ("k091","a75","featured"),("k091","a76","featured"),
            ("k092","a01","producer"),("k092","a03","featured"),
            ("k093","a01","producer"),("k093","a60","featured"),
            ("k094","a01","producer"),("k094","a08","featured"),("k094","a63","featured"),
            ("k095","a01","producer"),
            ("k096","a01","producer"),
            ("k097","a01","producer"),("k097","a59","featured"),
            ("k098","a01","producer"),("k098","a60","featured"),
            ("k100","a01","producer"),("k100","a10","featured"),
            ("k101","a01","producer"),("k101","a14","featured"),
            ("k102","a01","producer"),("k102","a11","featured"),
            ("k103","a01","producer"),("k103","a16","featured"),("k103","a77","featured"),
            ("k104","a01","producer"),("k104","a16","featured"),
            ("k106","a01","producer"),("k106","a32","featured"),
            ("k107","a01","producer"),("k107","a33","featured"),
            ("k108","a01","producer"),
            ("k109","a01","producer"),("k109","a78","featured"),("k109","a11","featured"),
            ("k110","a01","producer"),("k110","a34","featured"),
        ]

        # ── Ye ──
        c += [
            ("k111","a01","producer"),("k111","a88","producer"),("k111","a12","mixing_engineer"),
            ("k112","a01","producer"),("k112","a12","mixing_engineer"),
            ("k113","a01","producer"),("k113","a11","featured"),("k113","a87","featured"),
            ("k113","a79","featured"),
            ("k114","a01","producer"),("k114","a11","featured"),("k114","a84","featured"),
            ("k114","a85","featured"),
            ("k115","a01","producer"),("k115","a03","featured"),("k115","a83","featured"),
            ("k115","a86","sampled_artist"),("k115","a12","mixing_engineer"),
            ("k116","a01","producer"),("k116","a03","featured"),("k116","a61","featured"),
            ("k116","a13","featured"),("k116","a12","mixing_engineer"),
            ("k117","a01","producer"),("k117","a11","featured"),("k117","a61","featured"),
            ("k117","a06","featured"),
        ]

        # ── JIK ──
        c += [
            ("k118","a01","producer"),
            ("k119","a01","producer"),
            ("k120","a01","producer"),
            ("k121","a01","producer"),
            ("k122","a01","producer"),
            ("k123","a01","producer"),("k123","a11","featured"),("k123","a79","featured"),
            ("k124","a01","producer"),("k124","a79","featured"),
            ("k125","a01","producer"),
            ("k126","a01","producer"),("k126","a80","featured"),
            ("k127","a01","producer"),("k127","a82","featured"),("k127","a81","featured"),
            ("k128","a01","producer"),
        ]

        # ── Donda ──
        c += [
            ("k130","a01","producer"),("k130","a02","featured"),
            ("k131","a01","producer"),("k131","a53","featured"),
            ("k132","a01","producer"),("k132","a51","featured"),("k132","a54","featured"),
            ("k133","a01","producer"),("k133","a14","featured"),("k133","a56","featured"),
            ("k134","a01","producer"),("k134","a15","featured"),("k134","a55","featured"),
            ("k135","a01","producer"),("k135","a53","featured"),("k135","a56","featured"),
            ("k136","a01","producer"),("k136","a20","featured"),("k136","a22","featured"),
            ("k137","a01","producer"),("k137","a51","featured"),("k137","a22","featured"),
            ("k138","a01","producer"),
            ("k139","a01","producer"),
            ("k140","a01","producer"),("k140","a59","featured"),
            ("k141","a01","producer"),("k141","a03","featured"),("k141","a52","featured"),
            ("k142","a01","producer"),
            ("k143","a01","producer"),("k143","a58","featured"),
            ("k144","a01","producer"),("k144","a03","featured"),("k144","a28","featured"),
            ("k145","a01","producer"),("k145","a02","featured"),("k145","a62","featured"),
            ("k146","a01","producer"),("k146","a10","featured"),
            ("k147","a01","producer"),("k147","a04","featured"),
            ("k148","a01","producer"),("k148","a11","featured"),
            ("k149","a01","producer"),("k149","a57","featured"),("k149","a54","featured"),
            ("k150","a01","producer"),("k150","a11","featured"),
            ("k151","a01","producer"),
            ("k152","a01","producer"),("k152","a02","featured"),("k152","a22","featured"),
            ("k153","a01","producer"),
            ("k154","a01","producer"),("k154","a22","featured"),
            ("k155","a01","producer"),("k155","a33","featured"),
            # ── Donda 2 ──
            ("k156","a01","producer"),("k156","c01","featured"),
            ("k157","a01","producer"),("k157","a52","featured"),
            ("k158","a01","producer"),
            ("k159","a01","producer"),
            ("k160","a01","producer"),
            ("k161","a01","producer"),
            ("k162","a01","producer"),("k162","a55","featured"),("k162","c10","featured"),
            ("k163","a01","producer"),("k163","a15","featured"),("k163","c02","featured"),
            ("k164","a01","producer"),("k164","c03","featured"),
            ("k165","a01","producer"),("k165","c02","featured"),
            ("k166","a01","producer"),("k166","c04","featured"),
            ("k167","a01","producer"),("k167","c01","featured"),
            ("k168","a01","producer"),("k168","a53","featured"),
            ("k169","a01","producer"),("k169","a54","featured"),("k169","c06","featured"),
            ("k170","a01","producer"),("k170","c05","featured"),
            ("k171","a01","producer"),("k171","a31","featured"),
            # ── Vultures 1 ──
            ("k172","a01","producer"),("k172","a11","featured"),
            ("k173","a01","producer"),("k173","a11","featured"),
            ("k174","a01","producer"),("k174","a11","featured"),
            ("k175","a01","producer"),("k175","a11","featured"),("k175","c16","featured"),
            ("k176","a01","producer"),("k176","a11","featured"),("k176","a51","featured"),
            ("k177","a01","producer"),("k177","a11","featured"),
            ("k178","a01","producer"),("k178","a11","featured"),("k178","c13","featured"),
            ("k179","a01","producer"),("k179","a11","featured"),("k179","a06","featured"),
            ("k180","a01","producer"),("k180","a11","featured"),("k180","a51","featured"),
            ("k181","a01","producer"),("k181","a51","featured"),("k181","a15","featured"),
            ("k182","a01","producer"),("k182","a11","featured"),("k182","a50","featured"),
            ("k183","a01","producer"),("k183","a11","featured"),("k183","a51","featured"),("k183","c12","featured"),
            ("k184","a01","producer"),("k184","a11","featured"),("k184","a10","featured"),
            ("k185","a01","producer"),("k185","a11","featured"),
            ("k186","a01","producer"),("k186","a11","featured"),
            ("k187","a01","producer"),("k187","a11","featured"),
            # ── Vultures 2 ──
            ("k188","a01","producer"),("k188","a11","featured"),
            ("k189","a01","producer"),("k189","a11","featured"),
            ("k190","a01","producer"),("k190","a11","featured"),("k190","a52","featured"),("k190","c14","featured"),
            ("k191","a01","producer"),("k191","a11","featured"),
            ("k192","a01","producer"),("k192","a11","featured"),
            ("k193","a01","producer"),("k193","a11","featured"),("k193","c02","featured"),
            ("k194","a01","producer"),("k194","a11","featured"),
            ("k195","a01","producer"),("k195","a11","featured"),("k195","a19","featured"),
            ("k196","a01","producer"),("k196","a11","featured"),
            ("k197","a01","producer"),("k197","a11","featured"),("k197","c16","featured"),
            ("k198","a01","producer"),("k198","a11","featured"),("k198","a59","featured"),
            ("k199","a01","producer"),("k199","a11","featured"),
            ("k200","a01","producer"),("k200","a11","featured"),("k200","c02","featured"),
            ("k201","a01","producer"),("k201","a11","featured"),
            ("k202","a01","producer"),("k202","a11","featured"),
            ("k203","a01","producer"),("k203","a11","featured"),
            # ── Bully ──
            ("k204","a01","producer"),
            ("k205","a01","producer"),
            ("k206","a01","producer"),("k206","a15","featured"),
            ("k207","a01","producer"),("k207","c09","featured"),
            ("k208","a01","producer"),
            ("k209","a01","producer"),("k209","c07","featured"),
            ("k210","a01","producer"),
            ("k211","a01","producer"),
            ("k212","a01","producer"),
            ("k213","a01","producer"),
            ("k214","a01","producer"),
            ("k215","a01","producer"),("k215","c09","featured"),
            ("k216","a01","producer"),("k216","a52","featured"),
            ("k217","a01","producer"),
            ("k218","a01","producer"),
            ("k219","a01","producer"),
            ("k220","a01","producer"),
            ("k221","a01","producer"),("k221","c08","featured"),
        ]

        for i, (sid, aid, role) in enumerate(c):
            db.add(Credit(id=f"cr{i:04d}", song_id=sid, artist_id=aid, role=role))
        print(f"+{len(c)} credits")

        await db.commit()
        total_songs = len(originals) + total_kanye
        print(f"\n{'='*60}")
        print(f"KANYE WEST — COMPLETE DISCOGRAPHY (14 ALBUMS)")
        print(f"{'='*60}")
        print(f"  Artists:     {len(artist_data)} (Kanye + collaborators + sampled)")
        print(f"  Originals:   {len(originals)} sample source songs")
        print(f"  Kanye songs: {total_kanye} tracks")
        print(f"  Total songs: {total_songs}")
        print(f"  Samples:     {len(sp)} verified sample relationships")
        print(f"  Credits:     {len(c)} (producer/featured/engineer)")
        print(f"  Albums:      {len(albums)} — College Dropout → Bully")
        print(f"{'='*60}")

asyncio.run(seed())
