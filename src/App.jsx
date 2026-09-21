import { Navbar, Footer } from './components/layout'
import {
  Hero,
  About,
  Skills,
  Projects,
  Experience,
  Contact,
  BackToTop,
} from './components/sections'
import './App.css'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
