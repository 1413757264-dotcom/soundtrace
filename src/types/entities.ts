// ─── Enums ───────────────────────────────────────────

export type SampleType =
  | 'drum'
  | 'melody'
  | 'vocal_chop'
  | 'bass'
  | 'fx'
  | 'texture'
  | 'dialog';

export type Genre =
  | 'soul'
  | 'funk'
  | 'blues'
  | 'jazz'
  | 'rock'
  | 'disco'
  | 'rnb'
  | 'electronic'
  | 'classical'
  | 'world'
  | 'reggae'
  | 'pop'
  | 'hip_hop'
  | 'unknown';

export type SubGenre =
  | 'boom_bap'
  | 'trap'
  | 'memphis'
  | 'jazz_rap'
  | 'conscious'
  | 'g_funk'
  | 'drill'
  | 'lo_fi'
  | 'underground'
  | 'experimental';

export type CreditRole =
  | 'producer'
  | 'co_producer'
  | 'arranger'
  | 'songwriter'
  | 'mixing_engineer'
  | 'mastering_engineer'
  | 'featured'
  | 'sampled_artist';

export type RelationshipType =
  | 'produced_for'
  | 'featured_with'
  | 'co_wrote_with'
  | 'mixed_for';

export type SearchMethod = 'text' | 'link' | 'audio';

// ─── Core Entities ────────────────────────────────────

export interface Song {
  id: string;
  title: string;
  primaryArtist: Artist;
  featuredArtists: Artist[];
  albumTitle: string | null;
  releaseYear: number;
  releaseDate: string | null;
  durationMs: number;
  bpm: number;
  key: string; // e.g. "C# minor"
  genre: Genre;
  subGenre: SubGenre;
  coverArtUrl: string;
  streamingLinks: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
  };
  credits: Credit[];
  sampleCount: number;
  createdAt: string;
}

export interface Sample {
  id: string;
  type: SampleType;
  sourceSongTitle: string;
  sourceArtist: Artist;
  sourceReleaseYear: number;
  sourceGenre: Genre;
  sourceCoverUrl: string;
  targetSongId: string;
  targetSongTitle: string;
  startTimeMs: number;
  endTimeMs: number;
  targetStartTimeMs: number;
  targetEndTimeMs: number;
  waveformDataUrl: string | null;
  audioPreviewUrl: string | null;
  attributionConfirmed: boolean;
  confidenceScore: number;
  description: string | null;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string | null;
  genres: Genre[];
  externalIds: {
    spotifyId?: string;
    musicBrainzId?: string;
  };
}

export interface Credit {
  id: string;
  songId: string;
  artist: Artist;
  role: CreditRole;
}

export interface CollaborationEdge {
  id: string;
  sourceArtistId: string;
  targetArtistId: string;
  relationshipType: RelationshipType;
  songId: string;
  songTitle: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  artistId: string;
  name: string;
  role: CreditRole;
  type: 'center' | 'artist' | 'producer' | 'featured' | 'engineer' | 'songwriter';
  imageUrl: string | null;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  id: string;
  source: string; // node id
  target: string; // node id
  relationshipType: RelationshipType;
  label: string;
}

export interface WaveformData {
  id: string;
  sampleId: string;
  songId: string;
  sampleRate: number;
  pointsPerSecond: number;
  data: number[]; // normalized [0..1]
  peaks: number[];
  durationMs: number;
}

// ─── API Types ────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    totalPages: number;
    totalCount: number;
    source: 'cache' | 'live';
  };
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

export interface SearchResult {
  song: Song;
  matchScore: number;
}

export interface RecommendationsData {
  sameSample: Song[];
  sameProducer: Song[];
  sameStyle: Song[];
}

export interface UpstreamTrace {
  sample: Sample;
  originalSong: Song | null;
  influenceChain: Sample[];
}

export interface DownstreamUsage {
  sample: Sample;
  songs: Song[];
  totalCount: number;
}
