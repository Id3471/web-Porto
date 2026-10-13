import { useEffect, useState } from 'react'
import { defaultContent, mergePortfolioContent } from '../data/portfolioDefaults'
import { portfolioApiUrl } from '../data/portfolioApi'
import './Admin.css'

const tabs = [
  ['overview', 'Vue d’ensemble'],
  ['profile', 'Profil et contact'],
  ['projects', 'Projets'],
  ['skills', 'Compétences'],
  ['journey', 'Parcours'],
  ['settings', 'CV et accès'],
]

const templates = {
  projects: () => ({
    id: `projet-${Date.now()}`,
    title: '',
    description: '',
    tech: [],
    category: 'Web',
    icon: 'code',
    highlights: [],
    links: { demo: null, github: null },
  }),
  skillGroups: () => ({ id: `competence-${Date.now()}`, title: '', icon: 'code', items: [] }),
  experiences: () => ({
    id: `experience-${Date.now()}`,
    company: '',
    role: '',
    period: '',
    location: '',
    current: false,
    description: '',
    tags: [],
  }),
  education: () => ({
    id: `formation-${Date.now()}`,
    title: '',
    school: '',
    period: '',
    location: '',
    description: '',
    tags: [],
  }),
  certifications: () => ({ name: '', issuer: '' }),
  socials: () => ({ label: '', href: 'https://', icon: 'github' }),
  languages: () => ({ name: '', level: '', percent: 0 }),
  interests: () => ({ name: '', emoji: '' }),
}

const labels = {
  id: 'Identifiant',
  title: 'Titre',
  description: 'Description',
  tech: 'Technologies',
  category: 'Catégorie',
  icon: 'Icône décorative',
  highlights: 'Points clés',
  links: 'Liens',
  demo: 'Lien de démonstration',
  github: 'Lien du dépôt GitHub',
  company: 'Organisation',
  role: 'Fonction',
  period: 'Période',
  location: 'Lieu',
  current: 'Poste actuel',
  tags: 'Mots-clés',
  school: 'Établissement',
  name: 'Nom',
  issuer: 'Organisme',
  label: 'Libellé',
  href: 'Lien',
  level: 'Niveau',
  percent: 'Niveau en pourcentage',
  emoji: 'Symbole',
  firstName: 'Prénom',
  lastName: 'Nom de famille',
  fullName: 'Nom complet affiché',
  email: 'Adresse e-mail de contact',
  phones: 'Téléphones',
  summary: 'Présentation',
  roles: 'Fonctions mises en avant',
  roleProfile: 'Fonction principale',
  languages: 'Langues',
  interests: 'Centres d’intérêt',
  socials: 'Liens publics',
}

async function request(path, { method = 'GET', body, file, csrf = false } = {}) {
  const headers = { Accept: 'application/json' }
  if (body) headers['Content-Type'] = 'application/json'

  if (csrf) {
    const csrfResponse = await fetch(portfolioApiUrl('/admin-api/csrf'), {
      credentials: 'include',
      headers,
    })
    if (!csrfResponse.ok) throw new Error('Impossible de préparer la session sécurisée.')
    const { csrfToken } = await csrfResponse.json()
    headers['X-CSRF-TOKEN'] = csrfToken
  }

  const response = await fetch(portfolioApiUrl(path), {
    method,
    credentials: 'include',
    headers,
    body: file || (body ? JSON.stringify(body) : undefined),
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) {
    const validationMessage = Object.values(result?.errors || {}).flat()[0]
    const fallbackMessage = result
      ? 'Une erreur est survenue. Réessayez.'
      : `Réponse invalide du serveur (${response.status}). Vérifiez que l’API Laravel est disponible.`
    const error = new Error(validationMessage || result?.message || fallbackMessage)
    error.status = response.status
    throw error
  }
  return result
}

function Field({ field, value, onChange }) {
  const label = labels[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())
  const isLongText = ['description', 'summary'].includes(field)

  if (typeof value === 'boolean') {
    return (
      <label className="admin__checkbox">
        <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
        <span>{label}</span>
      </label>
    )
  }

  if (Array.isArray(value)) {
    return (
      <label className="admin__field">
        <span>{label} <small>Une valeur par ligne</small></span>
        <textarea value={value.join('\n')} rows="3" onChange={(event) => onChange(event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))} />
      </label>
    )
  }

  if (value && typeof value === 'object') {
    return (
      <fieldset className="admin__nested">
        <legend>{label}</legend>
        {Object.entries(value).map(([key, nestedValue]) => (
          <Field
            key={key}
            field={key}
            value={nestedValue ?? ''}
            onChange={(nextValue) => onChange({
              ...value,
              [key]: nextValue === '' && ['demo', 'github'].includes(key) ? null : nextValue,
            })}
          />
        ))}
      </fieldset>
    )
  }

  if (typeof value === 'number') {
    return (
      <label className="admin__field">
        <span>{label}</span>
        <input type="number" min="0" max="100" value={value} onChange={(event) => onChange(Number(event.target.value))} />
      </label>
    )
  }

  return (
    <label className="admin__field">
      <span>{label}</span>
      {isLongText ? (
        <textarea rows="4" value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input type="text" value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  )
}

function CollectionEditor({ title, items, onChange, template, emptyText }) {
  const updateItem = (index, field, value) => {
    onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item))
  }

  return (
    <section className="admin__collection">
      <div className="admin__collection-heading">
        <h3>{title}</h3>
        <button className="admin__button admin__button--secondary" type="button" onClick={() => onChange([...items, template()])}>
          Ajouter
        </button>
      </div>
      {items.length === 0 && <p className="admin__empty">{emptyText || 'Aucun élément pour le moment.'}</p>}
      <div className="admin__records">
        {items.map((item, index) => (
          <article className="admin__record" key={`${item.id || item.name || title}-${index}`}>
            <div className="admin__record-heading">
              <h4>{item.title || item.name || item.company || item.label || `Élément ${index + 1}`}</h4>
              <button
                type="button"
                className="admin__text-button admin__text-button--danger"
                aria-label={`Supprimer ${item.title || item.name || item.company || title}`}
                onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              >
                Supprimer
              </button>
            </div>
            <div className="admin__fields">
              {Object.entries(item).map(([field, value]) => (
                <Field key={field} field={field} value={value} onChange={(nextValue) => updateItem(index, field, nextValue)} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Login({ onLogin, error, busy }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <main className="admin-login">
      <form className="admin-login__card" onSubmit={(event) => {
        event.preventDefault()
        onLogin(username, password)
      }}>
        <a className="admin__back-link" href={import.meta.env.BASE_URL}>Retour au portfolio</a>
        <p className="admin__eyebrow">Espace privé</p>
        <h1>Administration</h1>
        <p className="admin__muted">Connectez-vous pour gérer le contenu de votre portfolio.</p>
        <label className="admin__field">
          <span>Identifiant</span>
          <input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label className="admin__field">
          <span>Mot de passe</span>
          <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p className="admin__notice admin__notice--error" role="alert">{error}</p>}
        <button className="admin__button admin__button--primary admin-login__submit" type="submit" disabled={busy}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </main>
  )
}

function Overview({ content, user }) {
  return (
    <>
      <header className="admin__page-header">
        <p className="admin__eyebrow">Espace de gestion</p>
        <h1>Bonjour, {user?.name || user?.username}</h1>
        <p className="admin__muted">Modifiez votre contenu, puis enregistrez vos changements dans l’onglet correspondant.</p>
      </header>
      <div className="admin__overview-grid">
        {[
          ['Projets publiés', content.projects.length],
          ['Groupes de compétences', content.skillGroups.length],
          ['Expériences', content.experiences.length],
          ['Formations', content.education.length],
        ].map(([label, value]) => (
          <article className="admin__stat" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <section className="admin__panel">
        <h2>Votre contenu, au même endroit</h2>
        <p>Les onglets permettent de modifier votre profil, vos coordonnées, vos projets, vos compétences, votre parcours et votre CV. Les changements enregistrés sont visibles sur le portfolio public.</p>
      </section>
    </>
  )
}

export default function Admin() {
  const [content, setContent] = useState(defaultContent)
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [sessionReady, setSessionReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [account, setAccount] = useState({ username: '', current_password: '', password: '', password_confirmation: '' })
  const [cvFile, setCvFile] = useState(null)

  useEffect(() => {
    request('/admin-api/session')
      .then(({ user: currentUser }) => {
        setUser(currentUser)
        return request('/portfolio-content')
      })
      .then(({ data }) => {
        if (data) setContent(mergePortfolioContent(data))
      })
      .catch((requestError) => {
        if (requestError.status !== 401) setError(requestError.message)
      })
      .finally(() => setSessionReady(true))
  }, [])

  const edit = (section, value) => setContent((current) => ({ ...current, [section]: value }))
  const updateProfile = (field, value) => setContent((current) => ({
    ...current,
    profile: { ...current.profile, [field]: value },
  }))

  const handleLogin = async (username, password) => {
    setBusy(true)
    setError('')
    try {
      const result = await request('/admin-api/login', {
        method: 'POST',
        body: { username, password },
        csrf: true,
      })
      setUser(result.user)
      const { data } = await request('/portfolio-content')
      if (data) setContent(mergePortfolioContent(data))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  const saveContent = async () => {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const { data } = await request('/admin-api/content', {
        method: 'PUT',
        body: { data: content },
        csrf: true,
      })
      setContent(mergePortfolioContent(data))
      setNotice('Modifications enregistrées. Elles sont visibles sur le portfolio public.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  const saveAccount = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const payload = { ...account }
      if (!payload.password) {
        delete payload.password
        delete payload.password_confirmation
      }
      const { user: updatedUser } = await request('/admin-api/account', {
        method: 'PUT',
        body: payload,
        csrf: true,
      })
      setUser(updatedUser)
      setAccount({ username: updatedUser.username, current_password: '', password: '', password_confirmation: '' })
      setNotice('Identifiant et mot de passe mis à jour.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  const replaceCv = async (event) => {
    event.preventDefault()
    if (!cvFile) {
      setError('Choisissez un fichier PDF avant de continuer.')
      return
    }
    setBusy(true)
    setError('')
    setNotice('')
    const formData = new FormData()
    formData.append('cv', cvFile)
    try {
      const { cvUrl } = await request('/admin-api/cv', { method: 'POST', file: formData, csrf: true })
      updateProfile('cvUrl', cvUrl)
      setCvFile(null)
      event.target.reset()
      setNotice('Votre CV a été remplacé.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  const logout = async () => {
    setBusy(true)
    try {
      await request('/admin-api/logout', { method: 'POST', csrf: true })
      setUser(null)
      setNotice('')
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  if (!sessionReady) {
    return <main className="admin-login"><p className="admin__muted" role="status">Vérification de la session…</p></main>
  }

  if (!user) {
    return <Login onLogin={handleLogin} error={error} busy={busy} />
  }

  const isContentTab = ['profile', 'projects', 'skills', 'journey'].includes(activeTab)

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <a className="admin__brand" href={import.meta.env.BASE_URL}>Portfolio <span>Administration</span></a>
        <nav className="admin__tabs" aria-label="Sections d’administration">
          {tabs.map(([id, label]) => (
            <button
              type="button"
              key={id}
              className={`admin__tab ${activeTab === id ? 'is-active' : ''}`}
              aria-current={activeTab === id ? 'page' : undefined}
              onClick={() => {
                setActiveTab(id)
                setNotice('')
                setError('')
              }}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="admin__sidebar-bottom">
          <span>Connecté en tant que <strong>{user.username}</strong></span>
          <button type="button" className="admin__text-button" onClick={logout} disabled={busy}>Se déconnecter</button>
          <a href={import.meta.env.BASE_URL}>Voir le portfolio public</a>
        </div>
      </aside>

      <main className="admin__main">
        {activeTab === 'overview' && <Overview content={content} user={user} />}

        {activeTab === 'profile' && (
          <>
            <header className="admin__page-header">
              <p className="admin__eyebrow">Contenu du site</p>
              <h1>Profil et contact</h1>
              <p className="admin__muted">Ces informations apparaissent dans l’introduction, la présentation et la page de contact.</p>
            </header>
            <section className="admin__panel">
              <div className="admin__fields">
                {['firstName', 'lastName', 'fullName', 'role', 'location', 'email', 'summary', 'roles', 'phones'].map((field) => (
                  <Field key={field} field={field} value={content.profile[field]} onChange={(value) => updateProfile(field, value)} />
                ))}
              </div>
            </section>
            {['socials', 'languages', 'interests'].map((section) => (
              <CollectionEditor
                key={section}
                title={labels[section]}
                items={content.profile[section]}
                template={templates[section]}
                onChange={(items) => updateProfile(section, items)}
              />
            ))}
          </>
        )}

        {activeTab === 'projects' && (
          <>
            <header className="admin__page-header">
              <p className="admin__eyebrow">Contenu du site</p>
              <h1>Projets</h1>
              <p className="admin__muted">Ajoutez, modifiez, classez ou retirez les projets présentés sur votre portfolio.</p>
            </header>
            <section className="admin__panel">
              <label className="admin__field">
                <span>Filtres de catégories <small>Séparez les catégories par une virgule</small></span>
                <input value={content.projectCategories.join(', ')} onChange={(event) => edit('projectCategories', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} />
              </label>
            </section>
            <CollectionEditor title="Projets publiés" items={content.projects} template={templates.projects} onChange={(items) => edit('projects', items)} />
          </>
        )}

        {activeTab === 'skills' && (
          <>
            <header className="admin__page-header">
              <p className="admin__eyebrow">Contenu du site</p>
              <h1>Compétences</h1>
              <p className="admin__muted">Gérez les catégories de compétences et les qualités présentées.</p>
            </header>
            <CollectionEditor title="Groupes de compétences" items={content.skillGroups} template={templates.skillGroups} onChange={(items) => edit('skillGroups', items)} />
            <section className="admin__panel">
              <Field field="Qualités" value={content.softSkills} onChange={(items) => edit('softSkills', items)} />
            </section>
          </>
        )}

        {activeTab === 'journey' && (
          <>
            <header className="admin__page-header">
              <p className="admin__eyebrow">Contenu du site</p>
              <h1>Expérience et formation</h1>
              <p className="admin__muted">Les expériences, les formations et les certifications de votre parcours.</p>
            </header>
            <CollectionEditor title="Expériences professionnelles" items={content.experiences} template={templates.experiences} onChange={(items) => edit('experiences', items)} />
            <CollectionEditor title="Formations" items={content.education} template={templates.education} onChange={(items) => edit('education', items)} />
            <CollectionEditor title="Certifications" items={content.certifications} template={templates.certifications} onChange={(items) => edit('certifications', items)} />
          </>
        )}

        {activeTab === 'settings' && (
          <>
            <header className="admin__page-header">
              <p className="admin__eyebrow">Paramètres sécurisés</p>
              <h1>CV et accès</h1>
              <p className="admin__muted">Remplacez le CV téléchargeable et modifiez les identifiants de cette administration.</p>
            </header>
            <form className="admin__panel admin__form" onSubmit={replaceCv}>
              <h2>Curriculum vitæ</h2>
              <p className="admin__muted">Seuls les fichiers PDF de 10 Mo maximum sont acceptés.</p>
              {content.profile.cvUrl && <a className="admin__link" href={content.profile.cvUrl} target="_blank" rel="noreferrer noopener">Consulter le CV actuel</a>}
              <label className="admin__field">
                <span>Nouveau CV</span>
                <input type="file" accept="application/pdf,.pdf" onChange={(event) => setCvFile(event.target.files?.[0] || null)} required />
              </label>
              <button className="admin__button admin__button--secondary" type="submit" disabled={busy}>Remplacer le CV</button>
            </form>
            <form className="admin__panel admin__form" onSubmit={saveAccount}>
              <h2>Identifiants administrateur</h2>
              <p className="admin__muted">Un mot de passe modifié doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un symbole.</p>
              <label className="admin__field">
                <span>Nouvel identifiant</span>
                <input autoComplete="username" required minLength="3" maxLength="40" value={account.username || user.username} onChange={(event) => setAccount({ ...account, username: event.target.value })} />
              </label>
              <label className="admin__field">
                <span>Mot de passe actuel</span>
                <input type="password" autoComplete="current-password" required value={account.current_password} onChange={(event) => setAccount({ ...account, current_password: event.target.value })} />
              </label>
              <label className="admin__field">
                <span>Nouveau mot de passe <small>Facultatif si vous ne souhaitez pas le modifier</small></span>
                <input type="password" autoComplete="new-password" minLength="12" value={account.password} onChange={(event) => setAccount({ ...account, password: event.target.value })} />
              </label>
              {account.password && (
                <label className="admin__field">
                  <span>Confirmer le nouveau mot de passe</span>
                  <input type="password" autoComplete="new-password" required value={account.password_confirmation} onChange={(event) => setAccount({ ...account, password_confirmation: event.target.value })} />
                </label>
              )}
              <button className="admin__button admin__button--secondary" type="submit" disabled={busy}>Enregistrer les identifiants</button>
            </form>
          </>
        )}

        {error && <p className="admin__notice admin__notice--error" role="alert">{error}</p>}
        {notice && <p className="admin__notice admin__notice--success" role="status">{notice}</p>}
        {isContentTab && (
          <div className="admin__save-bar">
            <span>Les changements ne sont pas publiés tant qu’ils ne sont pas enregistrés.</span>
            <button className="admin__button admin__button--primary" type="button" disabled={busy} onClick={saveContent}>
              {busy ? 'Enregistrement…' : 'Enregistrer les modifications'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
