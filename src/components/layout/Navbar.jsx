import { useEffect, useState } from 'react'
import { useActiveSection, useScrolled } from '../../hooks'
import { navLinks } from '../../data/profile'
import { usePortfolio } from '../../hooks/usePortfolio'
import { Icon } from '../ui'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const { profile } = usePortfolio()
  const scrolled = useScrolled(30)
  const active = useActiveSection(navLinks.map((l) => l.id))

  // Reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu when resizing back to desktop
  useEffect(() => {
    const onResize = () => window.innerWidth > 1050 && setOpen(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const goTo = (event, id) => {
    event.preventDefault()
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#hero" className="navbar__brand" onClick={(e) => goTo(e, 'hero')} aria-label={`${profile.firstName}, accueil`}>
          <span className="navbar__logo">&lt;/&gt;</span>
          <span className="navbar__name">
            {profile.firstName}<span className="gradient-text">.dev</span>
          </span>
        </a>

        <nav className={`navbar__nav ${open ? 'is-open' : ''}`} aria-label="Navigation principale">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`navbar__link ${active === link.id ? 'is-active' : ''}`}
              onClick={(e) => goTo(e, link.id)}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="btn btn--primary navbar__cta"
            onClick={() => setOpen(false)}
          >
            Me contacter
          </a>
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="navbar__icon-btn navbar__burger"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
          >
            <Icon name={open ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>
      <div className="navbar__progress" style={{ transform: `scaleX(${progress})` }} />
    </header>
  )
}
