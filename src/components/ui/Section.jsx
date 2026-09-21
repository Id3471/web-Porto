import { useReveal } from '../../hooks'

/**
 * Layout wrapper for every page section: handles id, spacing,
 * header (eyebrow + title) and scroll-reveal activation.
 */
export default function Section({ id, eyebrow, title, intro, children, className = '' }) {
  useReveal()

  return (
    <section id={id} className={`section ${className}`} aria-label={title}>
      <div className="container">
        {(eyebrow || title) && (
          <header className="section-header reveal">
            {eyebrow && <span className="eyebrow mono">{eyebrow}</span>}
            {title && <h2 className="section-title">{title}</h2>}
            {intro && <p className="section-intro">{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
