import { navLinks } from '../../data/profile'
import { usePortfolio } from '../../hooks/usePortfolio'
import { Icon } from '../ui'
import './Footer.css'

export default function Footer() {
  const { profile } = usePortfolio()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="navbar__logo">&lt;/&gt;</span>
          <div>
            <p className="footer__name">{profile.fullName}</p>
            <p className="footer__role">{profile.role} — Abidjan, Côte d’Ivoire</p>
          </div>
        </div>

        <nav className="footer__nav" aria-label="Navigation pied de page">
          {navLinks.slice(1).map((link) => (
            <a key={link.id} href={`#${link.id}`}>{link.label}</a>
          ))}
          <a href={`${import.meta.env.BASE_URL}#admin`}>Administration</a>
        </nav>

        <div className="footer__socials">
          {profile.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={social.label}
              className="footer__social"
            >
              <Icon name={social.icon} size={18} />
            </a>
          ))}
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          © {year} {profile.fullName}
        </p>
      </div>
    </footer>
  )
}
