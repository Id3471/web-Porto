import { skillGroups, softSkills } from '../../data/skills'
import { Icon, Section, Tag } from '../ui'
import './Skills.css'

// Deterministic pseudo-random intensity for the decorative activity grid
function cellIntensity(row, col) {
  const n = (row * 7 + col * 13 + (row % 2) * 5) % 10
  if (n < 3) return 0
  if (n < 5) return 1
  if (n < 8) return 2
  return 3
}

export default function Skills() {
  return (
    <Section id="skills" eyebrow="02 · Compétences" title="Ma boîte à outils" className="section--alt">
      <div className="skills__grid">
        {skillGroups.map((group, index) => (
          <article
            key={group.id}
            className="skills__card reveal"
            style={{ '--reveal-delay': `${index * 90}ms` }}
          >
            <div className="skills__card-icon">
              <Icon name={group.icon} size={20} />
            </div>
            <h3 className="skills__card-title">{group.title}</h3>
            <div className="skills__tags">
              {group.items.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="skills__bottom reveal">
        <div className="skills__soft">
          <h3 className="skills__subtitle">Qualités</h3>
          <div className="skills__soft-chips">
            {softSkills.map((skill) => (
              <span key={skill} className="skills__soft-chip">
                <Icon name="check" size={14} />
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="skills__activity" aria-hidden="true">
          <div className="skills__activity-grid">
            {Array.from({ length: 7 }, (_, row) =>
              Array.from({ length: 22 }, (_, col) => (
                <span
                  key={`${row}-${col}`}
                  className="skills__activity-cell"
                  data-level={cellIntensity(row, col)}
                />
              )),
            )}
          </div>
          <p className="skills__activity-caption mono">// code, code & encore du code</p>
        </div>
      </div>
    </Section>
  )
}
