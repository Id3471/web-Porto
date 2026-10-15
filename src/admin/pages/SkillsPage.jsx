import { templates } from '../adminConfig'
import { CollectionEditor, Field } from '../components/AdminField'
import { PageHeader } from '../components/AdminChrome'

export default function SkillsPage({ skillGroups, softSkills, onSkillGroupsChange, onSoftSkillsChange }) {
  return (
    <>
      <PageHeader
        title="Compétences"
        description="Gérez les catégories de compétences et les qualités présentées."
      />
      <CollectionEditor
        title="Groupes de compétences"
        items={skillGroups}
        template={templates.skillGroups}
        onChange={onSkillGroupsChange}
      />
      <section className="admin__panel">
        <Field field="Qualités" value={softSkills} onChange={onSoftSkillsChange} />
      </section>
    </>
  )
}
