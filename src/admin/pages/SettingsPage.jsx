import { PageHeader } from '../components/AdminChrome'

export default function SettingsPage({ content, user, account, busy, onAccountChange, onCvSubmit, onAccountSubmit, onCvFileChange }) {
  return (
    <>
      <PageHeader
        eyebrow="Paramètres sécurisés"
        title="CV et accès"
        description="Remplacez le CV téléchargeable et modifiez les identifiants de cette administration."
      />
      <form className="admin__panel admin__form" onSubmit={onCvSubmit}>
        <h2>Curriculum vitæ</h2>
        <p className="admin__muted">Seuls les fichiers PDF de 10 Mo maximum sont acceptés.</p>
        {content.profile.cvUrl && (
          <a className="admin__link" href={content.profile.cvUrl} target="_blank" rel="noreferrer noopener">
            Consulter le CV actuel
          </a>
        )}
        <label className="admin__field">
          <span>Nouveau CV</span>
          <input type="file" accept="application/pdf,.pdf" onChange={onCvFileChange} required />
        </label>
        <button className="admin__button admin__button--secondary" type="submit" disabled={busy}>
          Remplacer le CV
        </button>
      </form>

      <form className="admin__panel admin__form" onSubmit={onAccountSubmit}>
        <h2>Identifiants administrateur</h2>
        <p className="admin__muted">Un mot de passe modifié doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un symbole.</p>
        <label className="admin__field">
          <span>Nouvel identifiant</span>
          <input
            autoComplete="username"
            required
            minLength="3"
            maxLength="40"
            value={account.username || user.username}
            onChange={(event) => onAccountChange({ ...account, username: event.target.value })}
          />
        </label>
        <label className="admin__field">
          <span>Mot de passe actuel</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={account.current_password}
            onChange={(event) => onAccountChange({ ...account, current_password: event.target.value })}
          />
        </label>
        <label className="admin__field">
          <span>Nouveau mot de passe <small>Facultatif si vous ne souhaitez pas le modifier</small></span>
          <input
            type="password"
            autoComplete="new-password"
            minLength="12"
            value={account.password}
            onChange={(event) => onAccountChange({ ...account, password: event.target.value })}
          />
        </label>
        {account.password && (
          <label className="admin__field">
            <span>Confirmer le nouveau mot de passe</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={account.password_confirmation}
              onChange={(event) => onAccountChange({ ...account, password_confirmation: event.target.value })}
            />
          </label>
        )}
        <button className="admin__button admin__button--secondary" type="submit" disabled={busy}>
          Enregistrer les identifiants
        </button>
      </form>
    </>
  )
}
