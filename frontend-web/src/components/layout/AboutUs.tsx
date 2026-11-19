import AudienceCard from "../ui/AudienceCard.tsx"

const AboutUs = () => {
  return (
    <div className="flex flex-col gap-10 border-t-4 border-black bg-green px-6 py-14 md:gap-14 md:px-10 md:py-20 xl:gap-16 xl:px-16 xl:py-24">
      <h2 className="max-w-4xl text-xl leading-tight uppercase md:text-3xl xl:text-4xl">
        Una plataforma para los dos lados del parlante:{" "}
        <span className="bg-button px-1 shadow-hard-sm">los que escuchan</span> y{" "}
        <span className="bg-coral px-1 shadow-hard-sm">los que crean</span>.
      </h2>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        <AudienceCard
          number="01"
          title="Para oyentes"
          icon="bi-headphones"
          accent="bg-green"
          items={[
            "Playlists públicas o privadas",
            "Canciones en el orden que quieras",
            "Canciones y artistas favoritos",
            "Búsqueda de artistas, álbumes y playlists",
          ]}
        />
        <AudienceCard
          number="02"
          title="Para artistas"
          icon="bi-mic-fill"
          accent="bg-coral"
          items={[
            "Perfil público",
            "Álbumes y singles",
            "Estadísticas de seguidores y favoritos",
            "Todo lo que tiene un oyente",
          ]}
        />
      </div>
    </div>
  )
}

export default AboutUs
