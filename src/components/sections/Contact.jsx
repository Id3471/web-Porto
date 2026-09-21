import { useState } from 'react'
import { profile } from '../../data/profile'
import { Icon, Section } from '../ui'
import './Contact.css'

function ContactCard({ icon, label, value, href }) {
  return (
    <a className="contact__card reveal" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer noopener">
      <span className="contact__card-icon">
        <Icon name={icon} size={19} />
      </span>
      <span className="contact__card-text">
        <span className="contact__card-label">{label}</span>
        <span className="contact__card-value">{value}</span>
      </span>
    </a>
  )
}

const initialForm = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (field) => (event) => {
    setForm((f) => ({ ...f, [field]: event.target.value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Votre nom est requis'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Adresse email invalide'
    if (form.message.trim().length < 10) next.message = 'Message trop court (10 caractères minimum)'
    return next
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const subject = encodeURIComponent(form.subject.trim() || `Contact portfolio — ${form.name}`)
    const body = encodeURIComponent(
      `Nom : ${form.name}\nEmail : ${form.email}\n\n${form.message}\n\n— Envoyé depuis le portfolio`,
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`

    setSent(true)
    setForm(initialForm)
    setTimeout(() => setSent(false), 6000)
  }

  return (
    <Section id="contact" eyebrow="06 · Contact" title="Travaillons ensemble">
      <div className="contact__grid">
        <div className="contact__left">
          <p className="contact__pitch reveal">
            Un projet, une question ou une opportunité ? Ma boîte mail est
            toujours ouverte — je réponds en général sous 24 h.
          </p>

          <div className="contact__cards">
            <ContactCard icon="mail" label="Email" value={profile.email} href={`mailto:${profile.email}`} />
            <ContactCard
              icon="phone"
              label="Téléphone"
              value={profile.phones[0]}
              href={`tel:${profile.phones[0].replace(/\s/g, '')}`}
            />
            <ContactCard icon="pin" label="Localisation" value={profile.location} href="#contact" />
          </div>

          <div className="contact__socials reveal">
            {profile.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="contact__social"
                aria-label={social.label}
              >
                <Icon name={social.icon} size={18} />
              </a>
            ))}
          </div>
        </div>

        <form className="contact__form reveal" onSubmit={handleSubmit} noValidate>
          <div className="contact__row">
            <div className="contact__field">
              <label htmlFor="contact-name">Nom</label>
              <input
                id="contact-name"
                type="text"
                placeholder="Votre nom"
                value={form.name}
                onChange={update('name')}
                autoComplete="name"
              />
              {errors.name && <span className="contact__error">{errors.name}</span>}
            </div>

            <div className="contact__field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={update('email')}
                autoComplete="email"
              />
              {errors.email && <span className="contact__error">{errors.email}</span>}
            </div>
          </div>

          <div className="contact__field">
            <label htmlFor="contact-subject">Sujet (optionnel)</label>
            <input
              id="contact-subject"
              type="text"
              placeholder="Objet de votre message"
              value={form.subject}
              onChange={update('subject')}
            />
          </div>

          <div className="contact__field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              rows="5"
              placeholder="Parlez-moi de votre projet…"
              value={form.message}
              onChange={update('message')}
            />
            {errors.message && <span className="contact__error">{errors.message}</span>}
          </div>

          <button type="submit" className="btn btn--primary btn--lg contact__submit">
            <Icon name="send" size={17} />
            {sent ? 'Brouillon prêt — envoyez !' : 'Envoyer le message'}
          </button>
        </form>
      </div>
    </Section>
  )
}
