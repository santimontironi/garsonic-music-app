import FeatureCard from "../ui/FeatureCard.tsx"
import SectionLabel from "../ui/SectionLabel.tsx"

const AboutUs = () => {
  return (
    <div className="grid border-t-4 border-black xl:grid-cols-[20rem_1fr]">
      <SectionLabel title="Sobre Garsonic" accent="bg-green" />

      <div className="flex flex-col gap-10 bg-button px-6 py-14 md:gap-14 md:px-10 md:py-20 xl:gap-16 xl:px-16 xl:py-28">
        <p className="max-w-2xl text-sm leading-relaxed md:text-base">
          Garsonic es una plataforma de música hecha para los dos lados del parlante: los que escuchan y los que crean.
        </p>

        <div className="grid gap-6 md:grid-cols-3 md:gap-5 xl:gap-8">
          <FeatureCard
            icon="bi-headphones"
            title="Para oyentes"
            text="Armá playlists, guardá tus canciones favoritas y seguí a los artistas que te gustan."
            accent="bg-green"
          />
          <FeatureCard
            icon="bi-mic-fill"
            title="Para artistas"
            text="Subí tus canciones y álbumes, y mirá cómo crece tu audiencia con estadísticas."
            accent="bg-coral"
          />
          <FeatureCard
            icon="bi-vinyl-fill"
            title="Todo en un lugar"
            text="Buscá, escuchá y publicá sin saltar entre aplicaciones."
            accent="bg-background"
          />
        </div>
      </div>
    </div>
  )
}

export default AboutUs
