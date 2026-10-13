import { useEffect, useState } from 'react'
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
import { PortfolioProvider } from './data/PortfolioContext'
import Admin from './admin/Admin'

export default function App() {
  const [showAdmin, setShowAdmin] = useState(
    () => window.location.pathname.endsWith('/admin') || window.location.hash === '#admin',
  )

  useEffect(() => {
    const updateRoute = () => {
      setShowAdmin(window.location.pathname.endsWith('/admin') || window.location.hash === '#admin')
    }

    window.addEventListener('hashchange', updateRoute)
    window.addEventListener('popstate', updateRoute)
    return () => {
      window.removeEventListener('hashchange', updateRoute)
      window.removeEventListener('popstate', updateRoute)
    }
  }, [])

  return (
    <PortfolioProvider>
      {showAdmin ? (
        <Admin />
      ) : (
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
      )}
    </PortfolioProvider>
  )
}
