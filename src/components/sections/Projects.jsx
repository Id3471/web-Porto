import { useState } from 'react'
import { projectCategories, projects } from '../../data/projects'
import { Icon, Section, Tag } from '../ui'
import './Projects.css'

function ProjectCard({ project, index }) {
  const { links } = project

  return (
    <article
      className="project-card reveal"
      style={{ '--reveal-delay': `${(index % 3) * 90}ms` }}
    >
      <div className="project-card__banner" data-category={project.category}>
        <Icon name={project.icon} size={30} />
        <span className="project-card__category mono">{project.category}</span>
      </div>

      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>

        <ul className="project-card__highlights">
          {project.highlights.map((highlight) => (
            <li key={highlight}>
              <Icon name="check" size={13} />
              {highlight}
            </li>
          ))}
        </ul>

        <div className="project-card__tags">
          {project.tech.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>

      <div className="project-card__footer">
        {links?.github ? (
          <a href={links.github} target="_blank" rel="noreferrer noopener" className="project-card__link">
            <Icon name="github" size={16} /> Code
          </a>
        ) : (
          <span className="project-card__link project-card__link--muted">
            <Icon name="github" size={16} /> Code privé
          </span>
        )}
        {links?.demo ? (
          <a href={links.demo} target="_blank" rel="noreferrer noopener" className="project-card__link">
            <Icon name="external" size={16} /> Démo <Icon name="arrowRight" size={13} />
          </a>
        ) : (
          <span className="project-card__link project-card__link--muted">
            Démo sur demande
          </span>
        )}
      </div>
    </article>
  )
}

export default function Projects() {
  const [category, setCategory] = useState('Tous')
  const filtered = category === 'Tous' ? projects : projects.filter((p) => p.category === category)

  return (
    <Section id="projects" eyebrow="03 · Projets" title="Projets réalisés">
      <div className="projects__filters reveal">
        {projectCategories.map((c) => (
          <button
            key={c}
            type="button"
            className={`projects__filter ${category === c ? 'is-active' : ''}`}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="projects__grid">
        {filtered.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>
  )
}
