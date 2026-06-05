export type RootStackParamList = {
  MainTabs: undefined;
  SongDetail: { songId: string };
  SampleDeconstruction: { sampleId: string; songId: string };
  SampleComparison: { sampleId: string; songId: string };
  ProducerGraph: { songId: string };
  ArtistDetail: { artistId: string; artistName: string };
  FullPlayer: undefined;
  PlayQueue: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  SongDetail: { songId: string };
  SampleDeconstruction: { sampleId: string; songId: string };
};

export type SearchStackParamList = {
  Search: undefined;
  SearchResults: { query: string; method: string };
  SongDetail: { songId: string };
  ProducerGraph: { songId: string };
};

export type DiscoverStackParamList = {
  Discover: undefined;
  SongDetail: { songId: string };
  SampleDeconstruction: { sampleId: string; songId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  DiscoverTab: undefined;
  ProfileTab: undefined;
};
