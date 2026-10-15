import { templates } from '../adminConfig'
import { CollectionEditor } from '../components/AdminField'
import { PageHeader } from '../components/AdminChrome'

export default function ProjectsPage({ projectCategories, projects, onCategoriesChange, onProjectsChange }) {
  return (
    <>
      <PageHeader
        title="Projets"
        description="Ajoutez, modifiez, classez ou retirez les projets présentés sur votre portfolio."
      />
      <section className="admin__panel">
        <label className="admin__field">
          <span>Filtres de catégories <small>Séparez les catégories par une virgule</small></span>
          <input
            value={projectCategories.join(', ')}
            onChange={(event) => onCategoriesChange(event.target.value.split(',').map((item) => item.trim()).filter(Boolean))}
          />
        </label>
      </section>
      <CollectionEditor
        title="Projets publiés"
        items={projects}
        template={templates.projects}
        onChange={onProjectsChange}
      />
    </>
  )
}
