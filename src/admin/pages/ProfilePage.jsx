import { labels, templates } from '../adminConfig'
import { CollectionEditor, Field } from '../components/AdminField'
import { PageHeader } from '../components/AdminChrome'

const profileFields = ['firstName', 'lastName', 'fullName', 'role', 'location', 'email', 'summary', 'roles', 'phones']
const profileCollections = ['socials', 'languages', 'interests']

export default function ProfilePage({ profile, onProfileChange }) {
  return (
    <>
      <PageHeader
        title="Profil et contact"
        description="Ces informations apparaissent dans l’introduction, la présentation et la page de contact."
      />
      <section className="admin__panel">
        <div className="admin__fields">
          {profileFields.map((field) => (
            <Field
              key={field}
              field={field}
              value={profile[field]}
              onChange={(value) => onProfileChange(field, value)}
            />
          ))}
        </div>
      </section>
      {profileCollections.map((section) => (
        <CollectionEditor
          key={section}
          title={labels[section]}
          items={profile[section]}
          template={templates[section]}
          onChange={(items) => onProfileChange(section, items)}
        />
      ))}
    </>
  )
}
