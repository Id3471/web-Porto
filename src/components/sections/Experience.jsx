import { education, experiences } from '../../data/experience'
import { certifications } from '../../data/experience'
import { Icon, Section, Tag } from '../ui'
import './Experience.css'

function TimelineItem({ icon, title, subtitle, period, location, description, tags, current, delay }) {
  return (
    <li className="timeline__item reveal" style={{ '--reveal-delay': `${delay}ms` }}>
      <span className={`timeline__dot ${current ? 'timeline__dot--current' : ''}`}>
        <Icon name={icon} size={15} />
      </span>

      <div className="timeline__card">
        <div className="timeline__head">
          <div>
            <h3 className="timeline__title">{title}</h3>
            <p className="timeline__subtitle">{subtitle}</p>
          </div>
          <div className="timeline__meta">
            <span className="timeline__period mono">{period}</span>
            {location && <span className="timeline__location">{location}</span>}
          </div>
        </div>

        <p className="timeline__desc">{description}</p>

        <div className="timeline__tags">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </li>
  )
}

export default function Experience() {
  return (
    <>
      <Section id="experience" eyebrow="04 · Parcours" title="Expérience professionnelle">
        <ul className="timeline">
          {experiences.map((exp, i) => (
            <TimelineItem
              key={exp.id}
              icon="briefcase"
              title={exp.role}
              subtitle={exp.company}
              period={exp.period}
              location={exp.location}
              description={exp.description}
              tags={exp.tags}
              current={exp.current}
              delay={i * 110}
            />
          ))}
        </ul>
      </Section>

      <Section id="education" eyebrow="05 · Formation" title="Éducation & certifications" className="section--alt">
        <ul className="timeline">
          {education.map((edu, i) => (
            <TimelineItem
              key={edu.id}
              icon="school"
              title={edu.title}
              subtitle={edu.school}
              period={edu.period}
              location={edu.location}
              description={edu.description}
              tags={edu.tags}
              delay={i * 110}
            />
          ))}
        </ul>

        <div className="certs reveal">
          <h3 className="certs__title">
            <Icon name="award" size={18} />
            Certifications
          </h3>
          <div className="certs__grid">
            {certifications.map((cert) => (
              <div key={cert.name} className="certs__item">
                <Icon name="star" size={16} />
                <div>
                  <p className="certs__name">{cert.name}</p>
                  <p className="certs__issuer">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
