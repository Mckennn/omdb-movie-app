import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Background from "../components/layout/Background";
import Hero from "../components/movies/Hero";
import Carousel from "../components/movies/Carousel";
import { useRandomShowcase } from "../hooks/useRandomShowcase";
import { useHeroDetails } from "../hooks/useHeroDetails";
import HomeSkeleton from "../components/feedback/HomeSkeleton";
import ErrorMessage from "../components/feedback/ErrorMessage";

export default function Home() {
  const navigate = useNavigate();
  const { hero, carousel, loading, error, refresh } = useRandomShowcase(11);
  const { detail: heroDetail } = useHeroDetails(hero?.imdbID);

  return (
    <div className="relative min-h-dvh text-neutral-100 pb-16 md:pb-12">

      <Background />
      
      <div className="relative z-10">
        <Header
          onSearch={(q) => q && navigate(`/search?q=${encodeURIComponent(q)}`)}
        />

        {loading && <HomeSkeleton />}

        {!loading && error && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ErrorMessage message={error} onRetry={refresh} />
          </section>
        )}

        {!loading && !error && (
          <>
            <Hero
              hero={hero}
              detail={heroDetail}
              onSimilarClick={() =>
                hero && navigate(`/search?q=${encodeURIComponent(hero.Title)}`)
              }
            />
            <Carousel
              items={carousel}
              loading={false}
              onOpen={(title) =>
                navigate(`/search?q=${encodeURIComponent(title)}`)
              }
              onReload={refresh}
            />
          </>
        )}
      </div>
    </div>
  );
}
