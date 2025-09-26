🎬 LucasFlix Search

Mini app React + TS (Vite) pour explorer OMDb : landing avec un film “héros”, carrousel, recherche avec historique + suggestions, filtres All / Films / Series, pagination, et fiche détaillée en modal.

Setup rapide

Prérequis : Node 18+

# 1) Dépendances

npm install

# 2) Variables d'env

# crée .env à la racine :

# VITE_OMDB_API_KEY=ta_cle

# 3) Lancer en dev

npm run dev

# build / preview

npm run build
npm run preview

.env.example

VITE_OMDB_API_KEY=

Arbo (condensée)
src/
components/ # layout, movies (Hero, Carousel, Modal…), inputs (SearchBar), feedback, navigation
hooks/ # useOmdbSearch, useRandomShowcase, useHeroDetails, useHorizontalScroll, useSearchSuggestions
services/ # apiClient, search, random, index (getMovieById), history (recherches récentes)
pages/ # Home, SearchResults
types/ # omdb types
styles/ # ui (petits helpers de styles)

Ce que ça fait

Landing : un film “héros” + carrousel scrollable (chevrons).

Recherche : historique local (clear), suggestions live (debounce + cache), filtres All/Films/Series.

Résultats : pagination simple, grille 5 colonnes en desktop.

Détail : modal plein écran (grande affiche, infos, lien IMDb).

Note OMDb / proxy

OMDb peut être lent (erreurs 522).
En dev, on passe par /omdb (proxy Vite) pour éviter CORS. En prod, soit tu gardes un rewrite /omdb → https://www.omdbapi.com, soit tu appelles l’URL OMDb directe.
