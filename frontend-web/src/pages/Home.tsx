import Header from "../components/ui/Header.tsx"
import Hero from "../components/layout/Hero.tsx"
import AboutUs from "../components/layout/AboutUs.tsx"
import Contact from "../components/layout/Contact.tsx"
import Footer from "../components/layout/Footer.tsx"

const Home = () => {
  return (
    <div className="p-4 md:p-8 xl:px-16 xl:py-10">
      <div className="border-4 border-black shadow-hard-lg">
        <Header />

        <main>
          <section id="inicio">
            <Hero />
          </section>
          <section id="sobre-garsonic">
            <AboutUs />
          </section>
          <section id="contacto">
            <Contact />
          </section>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Home
