import { useState } from 'react'
import { usePortfolio } from '../../hooks/usePortfolio'
import { apiRequest } from '../../data/apiRequest'
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
  const { profile } = usePortfolio()
  const [form, setForm] = useState(initialForm)
  const [website, setWebsite] = useState('')
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState('')
  const [feedbackType, setFeedbackType] = useState('')
  const [sending, setSending] = useState(false)

  const update = (field) => (event) => {
    setForm((f) => ({ ...f, [field]: event.target.value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
    setFeedback('')
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Votre nom est requis'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Adresse email invalide'
    if (form.message.trim().length < 10) next.message = 'Message trop court (10 caractères minimum)'
    return next
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSending(true)
    setFeedback('')
    try {
      await apiRequest('/contact', {
        method: 'POST',
        body: { ...form, website },
        csrf: true,
      })
      setForm(initialForm)
      setWebsite('')
      setErrors({})
      setFeedback('Votre message a bien été envoyé. Je vous répondrai dès que possible.')
      setFeedbackType('success')
    } catch (error) {
      setFeedback(error.message)
      setFeedbackType('error')
    } finally {
      setSending(false)
    }
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

        <form className="contact__form reveal" onSubmit={handleSubmit} noValidate aria-busy={sending}>
          <header className="contact__form-header">
            <h3>Écrivez-moi directement</h3>
            <p>Votre message me sera transmis par e-mail.</p>
          </header>
          <div className="contact__honeypot" aria-hidden="true">
            <label htmlFor="contact-website">Ne pas remplir ce champ</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex="-1"
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>
          <div className="contact__row">
            <div className="contact__field">
              <label htmlFor="contact-name">Nom <span aria-hidden="true">*</span></label>
              <input
                id="contact-name"
                type="text"
                placeholder="Votre nom"
                maxLength="120"
                required
                value={form.name}
                onChange={update('name')}
                autoComplete="name"
              />
              {errors.name && <span className="contact__error">{errors.name}</span>}
            </div>

            <div className="contact__field">
              <label htmlFor="contact-email">E-mail <span aria-hidden="true">*</span></label>
              <input
                id="contact-email"
                type="email"
                placeholder="vous@exemple.com"
                maxLength="254"
                required
                value={form.email}
                onChange={update('email')}
                autoComplete="email"
              />
              {errors.email && <span className="contact__error">{errors.email}</span>}
            </div>
          </div>

          <div className="contact__field">
            <label htmlFor="contact-subject">Sujet <span>(optionnel)</span></label>
            <input
              id="contact-subject"
              type="text"
              placeholder="Objet de votre message"
              maxLength="160"
              value={form.subject}
              onChange={update('subject')}
            />
          </div>

          <div className="contact__field">
            <label htmlFor="contact-message">Message <span aria-hidden="true">*</span></label>
            <textarea
              id="contact-message"
              rows="5"
              placeholder="Parlez-moi de votre projet…"
              minLength="10"
              maxLength="8000"
              required
              value={form.message}
              onChange={update('message')}
            />
            {errors.message && <span className="contact__error">{errors.message}</span>}
          </div>

          {feedback && (
            <p className={`contact__feedback contact__feedback--${feedbackType}`} role={feedbackType === 'error' ? 'alert' : 'status'}>
              {feedback}
            </p>
          )}

          <button type="submit" className="btn btn--primary btn--lg contact__submit" disabled={sending}>
            {!sending && <Icon name="send" size={17} />}
            {sending ? 'Envoi en cours…' : 'Envoyer le message'}
          </button>
        </form>
      </div>
    </Section>
  )
}
