import { useEffect, useState } from 'react'
import { defaultContent, mergePortfolioContent } from '../data/portfolioDefaults'
import { apiRequest } from '../data/apiRequest'
import { AdminSidebar, Login, Overview } from './components/AdminChrome'
import ProfilePage from './pages/ProfilePage'
import ProjectsPage from './pages/ProjectsPage'
import SkillsPage from './pages/SkillsPage'
import JourneyPage from './pages/JourneyPage'
import SettingsPage from './pages/SettingsPage'
import './Admin.css'

const initialAccount = { username: '', current_password: '', password: '', password_confirmation: '' }

export default function Admin() {
  const [content, setContent] = useState(defaultContent)
  const [savedContent, setSavedContent] = useState(defaultContent)
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [sessionReady, setSessionReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [account, setAccount] = useState(initialAccount)
  const [cvFile, setCvFile] = useState(null)
  const isDirty = JSON.stringify(content) !== JSON.stringify(savedContent)

  useEffect(() => {
    if (!isDirty) return undefined

    const warnBeforeLeave = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', warnBeforeLeave)
    return () => window.removeEventListener('beforeunload', warnBeforeLeave)
  }, [isDirty])

  useEffect(() => {
    apiRequest('/admin-api/session')
      .then(({ user: currentUser }) => {
        setUser(currentUser)
        return apiRequest('/portfolio-content')
      })
      .then(({ data }) => {
        if (data) {
          const publishedContent = mergePortfolioContent(data)
          setContent(publishedContent)
          setSavedContent(publishedContent)
        }
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
      const result = await apiRequest('/admin-api/login', {
        method: 'POST',
        body: { username, password },
        csrf: true,
      })
      setUser(result.user)
      const { data } = await apiRequest('/portfolio-content')
      if (data) {
        const publishedContent = mergePortfolioContent(data)
        setContent(publishedContent)
        setSavedContent(publishedContent)
      }
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
      const { data } = await apiRequest('/admin-api/content', {
        method: 'PUT',
        body: { data: content },
        csrf: true,
      })
      const publishedContent = mergePortfolioContent(data)
      setContent(publishedContent)
      setSavedContent(publishedContent)
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
      const { user: updatedUser } = await apiRequest('/admin-api/account', {
        method: 'PUT',
        body: payload,
        csrf: true,
      })
      setUser(updatedUser)
      setAccount({ ...initialAccount, username: updatedUser.username })
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
      const { cvUrl } = await apiRequest('/admin-api/cv', { method: 'POST', file: formData, csrf: true })
      const nextContent = {
        ...content,
        profile: { ...content.profile, cvUrl },
      }
      setContent(nextContent)
      setSavedContent((current) => ({
        ...current,
        profile: { ...current.profile, cvUrl },
      }))
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
    if (isDirty && !window.confirm('Des changements ne sont pas enregistrés. Voulez-vous vraiment vous déconnecter ?')) {
      return
    }

    setBusy(true)
    try {
      await apiRequest('/admin-api/logout', { method: 'POST', csrf: true })
      setUser(null)
      setNotice('')
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  const selectTab = (tab) => {
    if (isDirty && !window.confirm('Vos changements ne sont pas enregistrés. Voulez-vous les conserver pour continuer plus tard ?')) {
      return
    }
    setActiveTab(tab)
    setNotice('')
    setError('')
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
      <AdminSidebar
        activeTab={activeTab}
        onSelect={selectTab}
        user={user}
        onLogout={logout}
        busy={busy}
      />
      <main className="admin__main">
        {activeTab === 'overview' && <Overview content={content} user={user} />}
        {activeTab === 'profile' && (
          <ProfilePage profile={content.profile} onProfileChange={updateProfile} />
        )}
        {activeTab === 'projects' && (
          <ProjectsPage
            projectCategories={content.projectCategories}
            projects={content.projects}
            onCategoriesChange={(categories) => edit('projectCategories', categories)}
            onProjectsChange={(projects) => edit('projects', projects)}
          />
        )}
        {activeTab === 'skills' && (
          <SkillsPage
            skillGroups={content.skillGroups}
            softSkills={content.softSkills}
            onSkillGroupsChange={(groups) => edit('skillGroups', groups)}
            onSoftSkillsChange={(skills) => edit('softSkills', skills)}
          />
        )}
        {activeTab === 'journey' && (
          <JourneyPage
            experiences={content.experiences}
            education={content.education}
            certifications={content.certifications}
            onChange={edit}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsPage
            content={content}
            user={user}
            account={account}
            busy={busy}
            onAccountChange={setAccount}
            onCvSubmit={replaceCv}
            onAccountSubmit={saveAccount}
            onCvFileChange={(event) => setCvFile(event.target.files?.[0] || null)}
          />
        )}

        {error && <p className="admin__notice admin__notice--error" role="alert">{error}</p>}
        {notice && <p className="admin__notice admin__notice--success" role="status">{notice}</p>}
        {isContentTab && (
          <div className="admin__save-bar">
            <span className={isDirty ? 'admin__save-status is-dirty' : 'admin__save-status'}>
              <span className="admin__save-status-dot" aria-hidden="true" />
              {isDirty ? 'Modifications non enregistrées' : 'Toutes les modifications sont enregistrées'}
            </span>
            <button className="admin__button admin__button--primary" type="button" disabled={busy || !isDirty} onClick={saveContent}>
              {busy ? 'Enregistrement…' : isDirty ? 'Enregistrer les modifications' : 'Contenu à jour'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
