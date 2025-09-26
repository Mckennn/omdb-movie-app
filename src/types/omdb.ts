export interface OmdbSearchItem {
  Title: string;
  Year: string; // ex: "2012–2016" possible pour les séries
  imdbID: string;
  Type: "movie" | "series" | string;
  Poster: string; // peut être "N/A"
}

export interface OmdbSearchResponse {
  Search?: OmdbSearchItem[];
  totalResults?: string; // nombre en string
  Response: "True" | "False";
  Error?: string;
}

export interface OmdbMovieDetail {
  Title: string;
  Year: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster: string;
  Ratings?: { Source: string; Value: string }[];
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: "True" | "False";
  Error?: string;
}
