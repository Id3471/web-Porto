import { templates } from '../adminConfig'
import { CollectionEditor } from '../components/AdminField'
import { PageHeader } from '../components/AdminChrome'

export default function JourneyPage({ experiences, education, certifications, onChange }) {
  return (
    <>
      <PageHeader
        title="Expérience et formation"
        description="Les expériences, les formations et les certifications de votre parcours."
      />
      <CollectionEditor
        title="Expériences professionnelles"
        items={experiences}
        template={templates.experiences}
        onChange={(items) => onChange('experiences', items)}
      />
      <CollectionEditor
        title="Formations"
        items={education}
        template={templates.education}
        onChange={(items) => onChange('education', items)}
      />
      <CollectionEditor
        title="Certifications"
        items={certifications}
        template={templates.certifications}
        onChange={(items) => onChange('certifications', items)}
      />
    </>
  )
}
