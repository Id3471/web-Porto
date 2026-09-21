import { profile } from '../../data/profile'
import { Icon, Section, Tag } from '../ui'
import './About.css'

function InfoRow({ icon, value, href }) {
  return (
    <li className="about__info-row">
      <span className="about__info-icon">
        <Icon name={icon} size={16} />
      </span>
      {href ? (
        <a href={href} className="about__info-value about__info-value--link">
          {value}
        </a>
      ) : (
        <span className="about__info-value">{value}</span>
      )}
    </li>
  )
}

function LanguageBar({ name, level, percent }) {
  return (
    <div className="about__lang">
      <div className="about__lang-head">
        <span>{name}</span>
        <span className="about__lang-level">{level}</span>
      </div>
      <div className="about__lang-track">
        <div className="about__lang-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default function About() {
  return (
    <Section id="about" eyebrow="01 · À propos" title="Qui suis-je ?">
      <div className="about__grid">
        <div className="about__text reveal">
          <p className="about__lead">{profile.summary}</p>

          <ul className="about__info">
            <InfoRow icon="user" label="Nom" value={profile.fullName} />
            <InfoRow icon="pin" label="Localisation" value={profile.location} />
            <InfoRow
              icon="mail"
              label="Email"
              value={profile.email}
              href={`mailto:${profile.email}`}
            />
            <InfoRow
              icon="phone"
              label="Téléphone"
              value={profile.phones.join(' · ')}
              href={`tel:${profile.phones[0].replace(/\s/g, '')}`}
            />
          </ul>
        </div>

        <div className="about__side reveal" style={{ '--reveal-delay': '120ms' }}>
          <div className="about__panel">
            <h3 className="about__panel-title">Langues</h3>
            {profile.languages.map((lang) => (
              <LanguageBar key={lang.name} {...lang} />
            ))}
          </div>

          <div className="about__panel">
            <h3 className="about__panel-title">Centres d’intérêt</h3>
            <div className="about__interests">
              {profile.interests.map((interest) => (
                <Tag key={interest.name} className="about__interest">
                  <span aria-hidden="true">{interest.emoji}</span> {interest.name}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
