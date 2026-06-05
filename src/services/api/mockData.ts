import type {
  Song, Sample, Artist, Credit, RecommendationsData,
  WaveformData, UpstreamTrace, DownstreamUsage, GraphData, GraphNode,
} from '../../types/entities';

// ═══════════════════════════════════════════════════════
// ARTIST DATABASE — 25 artists across eras
// ═══════════════════════════════════════════════════════

const A = {
  kanye:      { id:'a01', name:'Kanye West',        genres:['hip_hop'] as const, era:'2000s', spotify:'5K4W6rqBFWDnAN6FQUkS6x' },
  jayz:       { id:'a02', name:'JAY-Z',              genres:['hip_hop'] as const, era:'1990s', spotify:'3nFkdlSjzX9mRTtwJOzDYB' },
  kendrick:   { id:'a03', name:'Kendrick Lamar',     genres:['hip_hop'] as const, era:'2010s', spotify:'2YZyLoL8N0Wb9xBt1NhZWg' },
  nas:        { id:'a04', name:'Nas',                genres:['hip_hop'] as const, era:'1990s', spotify:'' },
  mfdoom:     { id:'a05', name:'MF DOOM',            genres:['hip_hop'] as const, era:'2000s', spotify:'' },
  madlib:     { id:'a06', name:'Madlib',             genres:['hip_hop','jazz'] as const, era:'2000s', spotify:'' },
  dilla:      { id:'a07', name:'J Dilla',            genres:['hip_hop','soul'] as const, era:'2000s', spotify:'' },
  premier:    { id:'a08', name:'DJ Premier',         genres:['hip_hop'] as const, era:'1990s', spotify:'' },
  drdre:      { id:'a09', name:'Dr. Dre',            genres:['hip_hop'] as const, era:'1990s', spotify:'' },
  snoop:      { id:'a10', name:'Snoop Dogg',         genres:['hip_hop'] as const, era:'1990s', spotify:'' },
  alc:        { id:'a11', name:'The Alchemist',      genres:['hip_hop'] as const, era:'2000s', spotify:'' },
  metro:      { id:'a12', name:'Metro Boomin',       genres:['hip_hop'] as const, era:'2010s', spotify:'' },
  travis:     { id:'a13', name:'Travis Scott',       genres:['hip_hop'] as const, era:'2010s', spotify:'' },
  mikedean:   { id:'a14', name:'Mike Dean',          genres:['hip_hop'] as const, era:'2000s', spotify:'' },
  timbaland:  { id:'a15', name:'Timbaland',          genres:['hip_hop','rnb'] as const, era:'2000s', spotify:'' },
  wutang:     { id:'a16', name:'Wu-Tang Clan',       genres:['hip_hop'] as const, era:'1990s', spotify:'' },
  gangstarr:  { id:'a17', name:'Gang Starr',         genres:['hip_hop'] as const, era:'1990s', spotify:'' },
  odb:        { id:'a18', name:"Ol' Dirty Bastard",   genres:['hip_hop'] as const, era:'1990s', spotify:'' },
  phonte:     { id:'a19', name:'Phonte',             genres:['hip_hop','soul'] as const, era:'2000s', spotify:'' },
  curtis:     { id:'a20', name:'Curtis Mayfield',    genres:['soul','funk'] as const, era:'1970s', spotify:'' },
  aretha:     { id:'a21', name:'Aretha Franklin',    genres:['soul','rnb'] as const, era:'1960s', spotify:'' },
  jamesbrown: { id:'a22', name:'James Brown',        genres:['funk','soul'] as const, era:'1970s', spotify:'' },
  steview:    { id:'a23', name:'Stevie Wonder',      genres:['soul','funk'] as const, era:'1970s', spotify:'' },
  marvingaye: { id:'a24', name:'Marvin Gaye',        genres:['soul','rnb'] as const, era:'1970s', spotify:'' },
  georgec:    { id:'a25', name:'George Clinton',     genres:['funk'] as const, era:'1970s', spotify:'' },
};

function art(a: { id: string; name: string; genres: readonly string[]; spotify: string }): Artist {
  return { id: a.id, name: a.name, imageUrl: null, genres: [...a.genres] as any, externalIds: { spotifyId: a.spotify || undefined } };
}

const ARTISTS: Record<string, Artist> = {};
Object.entries(A).forEach(([k, v]) => { ARTISTS[k] = art(v); });

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

function cred(songId: string, a: { id: string; name: string; genres: readonly string[]; spotify: string }, role: Credit['role']): Credit {
  return { id: `cr-${songId}-${a.id}`, songId, artist: art(a), role };
}

function sng(
  id: string, title: string, artist: Artist, feat: Artist[],
  album: string, year: number, dur: number,
  bpm: number, key: string, sub: Song['subGenre'],
  credits: Credit[], samples: number,
): Song {
  return {
    id, title, primaryArtist: artist, featuredArtists: feat,
    albumTitle: album, releaseYear: year, releaseDate: `${year}-01-01`,
    durationMs: dur, bpm, key, genre: 'hip_hop', subGenre: sub,
    coverArtUrl: '', streamingLinks:{}, credits, sampleCount: samples,
    createdAt: '',
  };
}

const AS = ARTISTS;

export const mockSongs: Song[] = [
  // ── 2020s ──
  sng('s01','FAMILY MATTERS', AS.kendrick, [], 'GNX',2025,289000, 94,'D minor','conscious', [cred('s01',A.kendrick,'producer')], 3),
  sng('s02','CARNIVAL', AS.kanye, [AS.travis], 'VULTURES 1',2024,224000, 74,'F minor','trap', [cred('s02',A.kanye,'producer'),cred('s02',A.mikedean,'mixing_engineer')], 2),
  // ── 2010s ──
  sng('s03','HUMBLE.', AS.kendrick, [], 'DAMN.',2017,177000, 75,'Eb minor','trap', [cred('s03',A.kendrick,'producer')], 2),
  sng('s04','SICKO MODE', AS.travis, [], 'ASTROWORLD',2018,312000, 72,'F minor','trap', [cred('s04',A.metro,'producer'),cred('s04',A.mikedean,'mixing_engineer')], 3),
  sng('s05','Alright', AS.kendrick, [], 'To Pimp a Butterfly',2015,219000, 84,'A minor','conscious', [cred('s05',A.kendrick,'producer')], 3),
  sng('s06','Bound 2', AS.kanye, [], 'Yeezus',2013,229000, 75,'C# minor','boom_bap', [cred('s06',A.kanye,'producer'),cred('s06',A.mikedean,'mixing_engineer')], 2),
  // ── 2000s ──
  sng('s07','Otis', AS.kanye, [AS.jayz], 'Watch the Throne',2011,178000, 80,'F# minor','boom_bap', [cred('s07',A.kanye,'producer'),cred('s07',A.jayz,'featured'),cred('s07',A.mikedean,'mixing_engineer')], 2),
  sng('s08','Heart of the City', AS.jayz, [], 'The Blueprint',2001,223000, 85,'C minor','boom_bap', [cred('s08',A.kanye,'producer')], 1),
  sng('s09','Jesus Walks', AS.kanye, [], 'The College Dropout',2004,193000, 87,'Eb minor','conscious', [cred('s09',A.kanye,'producer')], 2),
  sng('s10','Accordion', AS.mfdoom, [], 'Madvillainy',2004,118000, 92,'C minor','jazz_rap', [cred('s10',A.madlib,'producer'),cred('s10',A.mfdoom,'songwriter')], 1),
  sng('s11','Raid', AS.mfdoom, [], 'Madvillainy',2004,136000, 88,'D minor','jazz_rap', [cred('s11',A.madlib,'producer')], 2),
  sng('s12',"Don't Cry", AS.dilla, [], 'Donuts',2006,108000, 86,'E minor','lo_fi', [cred('s12',A.dilla,'producer')], 2),
  // ── 1990s Golden Age ──
  sng('s13','N.Y. State of Mind', AS.nas, [], 'Illmatic',1994,293000, 82,'D minor','boom_bap', [cred('s13',A.premier,'producer')], 3),
  sng('s14','The World Is Yours', AS.nas, [], 'Illmatic',1994,290000, 82,'D minor','boom_bap', [cred('s14',A.premier,'producer')], 2),
  sng('s15','C.R.E.A.M.', AS.wutang, [], 'Enter the Wu-Tang (36 Chambers)',1993,252000, 91,'D minor','boom_bap', [cred('s15',A.wutang,'producer')], 1),
  sng('s16','Shimmy Shimmy Ya', AS.odb, [], 'Return to the 36 Chambers',1995,167000, 94,'E minor','boom_bap', [], 1),
  sng('s17','Mass Appeal', AS.gangstarr, [], 'Hard to Earn',1994,221000, 88,'A minor','boom_bap', [cred('s17',A.premier,'producer'),cred('s17',A.gangstarr,'featured')], 1),
  sng('s18','Gin and Juice', AS.snoop, [], 'Doggystyle',1993,212000, 95,'G minor','g_funk', [cred('s18',A.drdre,'producer')], 2),
  sng('s19',"Nuthin' But a G Thang", AS.drdre, [AS.snoop], 'The Chronic',1992,238000, 93,'A minor','g_funk', [cred('s19',A.drdre,'producer'),cred('s19',A.snoop,'featured')], 3),
  sng('s20','Tearz', AS.wutang, [], 'Enter the Wu-Tang (36 Chambers)',1993,197000, 88,'A minor','boom_bap', [], 2),
  sng('s21','Memory Lane', AS.nas, [], 'Illmatic',1994,263000, 78,'G minor','boom_bap', [cred('s21',A.premier,'producer')], 2),
  sng('s22','The Message', AS.nas, [], 'It Was Written',1996,232000, 89,'B minor','conscious', [cred('s22',A.nas,'producer')], 2),
  // ── Soul/Funk Originals ──
  sng('s23','Super Fly', AS.curtis, [], 'Super Fly',1972,216000, 102,'G minor','jazz_rap' as Song['subGenre'], [cred('s23',A.curtis,'producer')], 0),
  sng('s24','Try a Little Tenderness', AS.aretha, [], 'The Tender, The Moving...',1963,202000, 72,'C major','jazz_rap' as Song['subGenre'], [], 0),
  sng('s25','Funky Drummer', AS.jamesbrown, [], 'Funky Drummer (Single)',1970,162000, 91,'D minor','jazz_rap' as Song['subGenre'], [], 0),
  sng('s26','Impeach the President', AS.jamesbrown, [], 'Single',1973,148000, 94,'A minor','jazz_rap' as Song['subGenre'], [], 0),
  sng('s27','Living for the City', AS.steview, [], 'Innervisions',1973,204000, 82,'F minor','jazz_rap' as Song['subGenre'], [], 0),
  sng('s28',"What's Going On", AS.marvingaye, [], "What's Going On",1971,233000, 78,'E minor','jazz_rap' as Song['subGenre'], [], 0),
  sng('s29','Atomic Dog', AS.georgec, [], 'Computer Games',1982,264000, 102,'C minor','jazz_rap' as Song['subGenre'], [], 0),
  sng('s30','One Beer', AS.mfdoom, [], 'MM..FOOD',2004,181000, 85,'D minor','boom_bap', [cred('s30',A.madlib,'producer')], 1),
  sng('s31','Still D.R.E.', AS.drdre, [AS.snoop], '2001',1999,271000, 91,'A minor','g_funk', [cred('s31',A.drdre,'producer'),cred('s31',A.snoop,'featured')], 2),
  sng('s32','Big Poppa', AS.nas, [], 'Ready to Die',1994,251000, 85,'Eb minor','g_funk', [], 2),
];

// ═══════════════════════════════════════════════════════
// SAMPLES — 22 samples
// ═══════════════════════════════════════════════════════

function smp(
  id: string, type: Sample['type'],
  srcTitle: string, a: any,
   srcYear: number, srcGenre: Sample['sourceGenre'],
  targetId: string, targetTitle: string,
  srcStart: number, srcEnd: number, tgtStart: number, tgtEnd: number,
  desc: string, conf = 0.95,
): Sample {
  return {
    id, type, sourceSongTitle: srcTitle, sourceArtist: art(a),
    sourceReleaseYear: srcYear, sourceGenre: srcGenre,
    sourceCoverUrl: '',
    targetSongId: targetId, targetSongTitle: targetTitle,
    startTimeMs: srcStart, endTimeMs: srcEnd,
    targetStartTimeMs: tgtStart, targetEndTimeMs: tgtEnd,
    waveformDataUrl: null, audioPreviewUrl: null,
    attributionConfirmed: true, confidenceScore: conf,
    description: desc,
  };
}

export const mockSamples: Sample[] = [
  smp('sp01','vocal_chop', 'Try a Little Tenderness', A.aretha, 1963, 'soul',
    's07','Otis', 42000,55000, 12000,25000, '人声切片，Kanye变调+变速构建Hook'),
  smp('sp02','drum', 'Funky Drummer', A.jamesbrown, 1970, 'funk',
    's07','Otis', 62000,78000, 0,16000, '嘻哈史上被采样最多的鼓组break'),
  smp('sp03','melody', 'Living for the City', A.steview, 1973, 'funk',
    's13','N.Y. State of Mind', 15000,28000, 8000,21000, 'DJ Premier提取Stevie Wonder钢琴动机'),
  smp('sp04','drum', 'Impeach the President', A.jamesbrown, 1973, 'funk',
    's13','N.Y. State of Mind', 12000,24000, 30000,42000, '经典Honey Drippers break'),
  smp('sp05','bass', 'Funky Drummer', A.jamesbrown, 1970, 'funk',
    's13','N.Y. State of Mind', 30000,42000, 50000,62000, '低声部groove循环'),
  smp('sp06','melody', 'Super Fly', A.curtis, 1972, 'funk',
    's19',"Nuthin' But a G Thang", 35000,52000, 22000,39000, 'G-Funk经典Bassline原型'),
  smp('sp07','drum', 'Funky Drummer', A.jamesbrown, 1970, 'funk',
    's19',"Nuthin' But a G Thang", 62000,78000, 0,16000, 'Dre招牌鼓组处理'),
  smp('sp08','vocal_chop', 'Atomic Dog', A.georgec, 1982, 'funk',
    's18','Gin and Juice', 15000,35000, 8000,28000, 'George Clinton人声切片营造西海岸氛围'),
  smp('sp09','melody', 'Experience', A.phonte, 2011, 'soul',
    's10','Accordion', 20000,38000, 5000,23000, '冷门独立厂牌唱片采样，爵士说唱质感'),
  smp('sp10','texture', "What's Going On", A.marvingaye, 1971, 'soul',
    's11','Raid', 40000,60000, 10000,30000, 'Marvin Gaye弦乐背景质感采样'),
  smp('sp11','vocal_chop', 'Try a Little Tenderness', A.aretha, 1963, 'soul',
    's12',"Don't Cry", 50000,64000, 0,14000, 'Dilla标志性人声切片处理风格'),
  smp('sp12','drum', 'Impeach the President', A.jamesbrown, 1973, 'funk',
    's12',"Don't Cry", 12000,24000, 20000,32000, 'Dilla松弛的鼓组swing处理'),
  smp('sp13','vocal_chop', 'Super Fly', A.curtis, 1972, 'funk',
    's06','Bound 2', 18000,35000, 5000,22000, 'Soul人声切片+变速处理'),
  smp('sp14','bass', 'Funky Drummer', A.jamesbrown, 1970, 'funk',
    's06','Bound 2', 30000,42000, 30000,42000, '低音段落循环'),
  smp('sp15','drum', 'Funky Drummer', A.jamesbrown, 1970, 'funk',
    's15','C.R.E.A.M.', 62000,78000, 0,16000, 'Wu-Tang经典采样处理'),
  smp('sp16','melody', 'Living for the City', A.steview, 1973, 'funk',
    's21','Memory Lane', 15000,28000, 8000,21000, 'Nas的东岸叙事采样'),
  smp('sp17','drum', 'Funky Drummer', A.jamesbrown, 1970, 'funk',
    's31','Still D.R.E.', 62000,78000, 0,16000, 'Dre精密鼓编程+采样混合'),
  smp('sp18','melody', 'Atomic Dog', A.georgec, 1982, 'funk',
    's30','One Beer', 22000,44000, 6000,28000, 'Madlib挖掘的冷门Funk采样'),
  smp('sp19','melody', "What's Going On", A.marvingaye, 1971, 'soul',
    's03','HUMBLE.', 35000,55000, 10000,30000, '现代Trap融合经典Soul'),
  smp('sp20','drum', 'Impeach the President', A.jamesbrown, 1973, 'funk',
    's03','HUMBLE.', 12000,24000, 0,12000, '70年代鼓break在现代Trap中的新生命'),
  smp('sp21','fx', 'Atomic Dog', A.georgec, 1982, 'funk',
    's04','SICKO MODE', 50000,65000, 15000,30000, '多段式结构中采样用途变化'),
  smp('sp22','vocal_chop', 'Try a Little Tenderness', A.aretha, 1963, 'soul',
    's05','Alright', 45000,60000, 20000,35000, 'Kendrick社会意识说唱中的Soul采样'),
];

// ═══════════════════════════════════════════════════════
// DOWNSTREAM
// ═══════════════════════════════════════════════════════

export const mockDownstream: Record<string, Song[]> = {
  'sp02': [mockSongs[12], mockSongs[18], mockSongs[14], mockSongs[30]].filter(Boolean),
  'sp04': [mockSongs[12], mockSongs[11], mockSongs[15]].filter(Boolean),
  'sp01': [mockSongs[19], mockSongs[11]].filter(Boolean),
  'sp07': [mockSongs[12], mockSongs[14], mockSongs[30]].filter(Boolean),
};

// ═══════════════════════════════════════════════════════
// FUNCTIONS
// ═══════════════════════════════════════════════════════

export function getSongWithSamples(songId: string): { song: Song; samples: Sample[] } | null {
  const s = mockSongs.find(x => x.id === songId);
  if (!s) return null;
  return { song: s, samples: mockSamples.filter(x => x.targetSongId === songId) };
}

export function getSampleDownstream(sampleId: string): DownstreamUsage | null {
  const sp = mockSamples.find(x => x.id === sampleId);
  if (!sp) return null;
  const songs = mockDownstream[sampleId] || [];
  return { sample: sp, songs, totalCount: songs.length };
}

export function getUpstreamTrace(sampleId: string): UpstreamTrace | null {
  const sp = mockSamples.find(x => x.id === sampleId);
  if (!sp) return null;
  const original = mockSongs.find(s =>
    s.title === sp.sourceSongTitle && s.primaryArtist.name === sp.sourceArtist.name
  );
  return { sample: sp, originalSong: original || null, influenceChain: [sp] };
}

export function getArtistSongs(artistId: string): Song[] {
  return mockSongs.filter(s =>
    s.primaryArtist.id === artistId ||
    s.featuredArtists.some(a => a.id === artistId) ||
    s.credits.some(c => c.artist.id === artistId)
  );
}

export function getProducerSongs(artistId: string): Song[] {
  return mockSongs.filter(s =>
    s.credits.some(c => c.artist.id === artistId && c.role === 'producer')
  );
}

export function getSongRecommendations(songId: string): RecommendationsData {
  const song = mockSongs.find(s => s.id === songId);
  if (!song) return { sameSample:[], sameProducer:[], sameStyle:[] };
  const sameStyle = mockSongs.filter(s => s.id !== songId && s.subGenre === song.subGenre).slice(0, 6);
  const pids = song.credits.filter(c => c.role === 'producer').map(c => c.artist.id);
  const sameProducer = mockSongs.filter(s => s.id !== songId && s.credits.some(c => c.role === 'producer' && pids.includes(c.artist.id))).slice(0, 6);
  const sids = mockSamples.filter(s => s.targetSongId === songId).map(s => s.id);
  const sameSample = mockSongs.filter(s => s.id !== songId && mockSamples.some(sp => sp.targetSongId === s.id && sids.includes(sp.id))).slice(0, 6);
  return { sameSample, sameProducer, sameStyle };
}

export function getGraphData(songId: string): GraphData {
  const song = mockSongs.find(s => s.id === songId);
  if (!song) return { nodes:[], edges:[] };
  const nodes: GraphNode[] = [{
    id:'g-center', artistId:song.id, name:song.title,
    role:'producer', type:'center', imageUrl:null,
  }];
  const edges: GraphData['edges'] = [];
  let eid = 0;
  song.credits.forEach(c => {
    const nid = `g-${c.artist.id}`;
    const type = c.role === 'producer' ? 'producer' as const
      : c.role === 'featured' ? 'featured' as const
      : c.role.includes('engineer') ? 'engineer' as const
      : 'songwriter' as const;
    if (!nodes.find(n => n.id === nid)) {
      nodes.push({ id:nid, artistId:c.artist.id, name:c.artist.name, role:c.role, type, imageUrl:null });
    }
    edges.push({
      id:`ge-${++eid}`, source:'g-center', target:nid,
      relationshipType: c.role === 'producer' ? 'produced_for' : c.role === 'featured' ? 'featured_with' : 'mixed_for',
      label: c.role === 'producer' ? '制作' : c.role === 'featured' ? '客串' : c.role.includes('engineer') ? '混音' : '创作',
    });
  });
  mockSamples.filter(s => s.targetSongId === songId).forEach(sp => {
    const nid = `g-samp-${sp.sourceArtist.id}`;
    if (!nodes.find(n => n.id === nid)) {
      nodes.push({ id:nid, artistId:sp.sourceArtist.id, name:sp.sourceArtist.name, role:'sampled_artist', type:'artist', imageUrl:null });
    }
    edges.push({ id:`ge-${++eid}`, source:'g-center', target:nid, relationshipType:'produced_for', label:'采样' });
  });
  return { nodes, edges };
}

function levDist(s: string, p: string): number {
  if (s.includes(p)) return 0;
  let min = 99;
  for (let i = 0; i <= s.length - p.length; i++) {
    let d = 0;
    for (let j = 0; j < p.length; j++) if (s[i+j] !== p[j]) d++;
    min = Math.min(min, d);
  }
  return min === 99 ? p.length : min;
}

export function searchSongs(query: string): Song[] {
  const q = query.toLowerCase().trim();
  if (!q) return mockSongs;
  const tokens = q.split(/\s+/);
  const scored = mockSongs.map(s => {
    let score = 0;
    const title = s.title.toLowerCase();
    const artist = s.primaryArtist.name.toLowerCase();
    const feat = s.featuredArtists.map(a => a.name.toLowerCase()).join(' ');
    const album = (s.albumTitle || '').toLowerCase();
    const sub = s.subGenre.toLowerCase();
    tokens.forEach(t => {
      if (title.includes(t)) score += 10;
      if (artist.includes(t)) score += 8;
      if (feat.includes(t)) score += 6;
      if (album.includes(t)) score += 4;
      if (sub.includes(t) || sub.replace('_',' ').includes(t)) score += 3;
      if (String(s.releaseYear) === t) score += 2;
      if (t.length >= 3 && levDist(title, t) <= 2) score += 5;
    });
    return { song:s, score };
  });
  return scored.filter(x => x.score > 0).sort((a,b) => b.score - a.score).map(x => x.song);
}

// ═══════════════════════════════════════════════════════
// WAVEFORM
// ═══════════════════════════════════════════════════════

export function generateWaveform(durationMs: number): WaveformData {
  const pps = 100, total = Math.floor((durationMs/1000)*pps);
  const data: number[] = [], peaks: number[] = [];
  for (let i=0; i<total; i++) {
    const t = i/total, env = Math.sin(t*Math.PI)*0.6+0.4;
    data.push(Math.min(1, Math.abs(Math.sin(i*0.3)*Math.cos(i*0.07)+Math.sin(i*0.13)*0.5)*env*(0.4+Math.random()*0.6)));
    if (i%10===0) peaks.push(data[i]);
  }
  return { id:`wf-${Date.now()}`, sampleId:'', songId:'', sampleRate:44100, pointsPerSecond:pps, data, peaks, durationMs };
}

export const mockWaveformOriginal = generateWaveform(13000);
export const mockWaveformTarget = generateWaveform(16000);

export const mockSearchHistory = [
  'Kanye West Otis', 'Kendrick Lamar', '1970s soul 采样',
  'J Dilla beats', 'Madlib MF DOOM', 'BoomBap 经典',
  'James Brown 鼓采样', 'G-Funk Dre', 'Nas Illmatic',
];

export const mockTrendingSearches = [
  'Kendrick Lamar 新专辑采样', 'BoomBap 经典采样', 'James Brown 被采样排行',
  '2025 最佳说唱采样', 'Jazz Rap 采样源头', 'Trap 采样演变',
  'Wu-Tang 采样列表', '90年代东岸采样', 'G-Funk Synth Bass',
];
