import { useState } from 'react'
import { tabs } from '../adminConfig'

export function Login({ onLogin, error, busy }) {
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

export function PageHeader({ eyebrow = 'Contenu du site', title, description }) {
  return (
    <header className="admin__page-header">
      <p className="admin__eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="admin__muted">{description}</p>
    </header>
  )
}

export function Overview({ content, user }) {
  return (
    <>
      <PageHeader
        eyebrow="Espace de gestion"
        title={`Bonjour, ${user?.name || user?.username}`}
        description="Modifiez votre contenu, puis enregistrez vos changements dans l’onglet correspondant."
      />
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

export function AdminSidebar({ activeTab, onSelect, user, onLogout, busy }) {
  return (
    <aside className="admin__sidebar">
      <a className="admin__brand" href={import.meta.env.BASE_URL}>Portfolio <span>Administration</span></a>
      <nav className="admin__tabs" aria-label="Sections d’administration">
        {tabs.map(([id, label]) => (
          <button
            type="button"
            key={id}
            className={`admin__tab ${activeTab === id ? 'is-active' : ''}`}
            aria-current={activeTab === id ? 'page' : undefined}
            onClick={() => onSelect(id)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="admin__sidebar-bottom">
        <span>Connecté en tant que <strong>{user.username}</strong></span>
        <button type="button" className="admin__text-button" onClick={onLogout} disabled={busy}>Se déconnecter</button>
        <a href={import.meta.env.BASE_URL}>Voir le portfolio public</a>
      </div>
    </aside>
  )
}
