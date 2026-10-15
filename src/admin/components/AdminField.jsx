import { useState } from 'react'
import { labels } from '../adminConfig'

export function Field({ field, value, onChange }) {
  const label = labels[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())
  const isLongText = ['description', 'summary'].includes(field)

  if (typeof value === 'boolean') {
    return (
      <label className="admin__checkbox">
        <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
        <span>{label}</span>
      </label>
    )
  }

  if (Array.isArray(value)) {
    return <ListField label={label} value={value} onChange={onChange} />
  }

  if (value && typeof value === 'object') {
    return (
      <fieldset className="admin__nested">
        <legend>{label}</legend>
        {Object.entries(value).map(([key, nestedValue]) => (
          <Field
            key={key}
            field={key}
            value={nestedValue ?? ''}
            onChange={(nextValue) => onChange({
              ...value,
              [key]: nextValue === '' && ['demo', 'github'].includes(key) ? null : nextValue,
            })}
          />
        ))}
      </fieldset>
    )
  }

  if (typeof value === 'number') {
    return (
      <label className="admin__field">
        <span>{label}</span>
        <input type="number" min="0" max="100" value={value} onChange={(event) => onChange(Number(event.target.value))} />
      </label>
    )
  }

  return (
    <label className="admin__field">
      <span>{label}</span>
      {isLongText ? (
        <textarea rows="4" value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input type="text" value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  )
}

function ListField({ label, value, onChange }) {
  const [draft, setDraft] = useState(() => value.join('\n'))

  return (
    <label className="admin__field">
      <span>{label} <small>Une valeur par ligne</small></span>
      <textarea
        value={draft}
        rows="3"
        onChange={(event) => {
          const nextDraft = event.target.value
          setDraft(nextDraft)
          onChange(nextDraft.split('\n').map((item) => item.trim()).filter(Boolean))
        }}
      />
    </label>
  )
}

export function CollectionEditor({ title, items, onChange, template, emptyText }) {
  const updateItem = (index, field, value) => {
    onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item))
  }

  return (
    <section className="admin__collection">
      <div className="admin__collection-heading">
        <h3>{title}</h3>
        <button className="admin__button admin__button--secondary" type="button" onClick={() => onChange([...items, template()])}>
          Ajouter
        </button>
      </div>
      {items.length === 0 && <p className="admin__empty">{emptyText || 'Aucun élément pour le moment.'}</p>}
      <div className="admin__records">
        {items.map((item, index) => (
          <article className="admin__record" key={`${item.id || item.name || title}-${index}`}>
            <details className="admin__record-details">
              <summary className="admin__record-summary">
                <span className="admin__record-title">{item.title || item.name || item.company || item.label || `Élément ${index + 1}`}</span>
                <span className="admin__record-action">Modifier les détails</span>
              </summary>
              <div className="admin__record-content">
                <div className="admin__fields">
                  {Object.entries(item).map(([field, value]) => (
                    <Field key={field} field={field} value={value} onChange={(nextValue) => updateItem(index, field, nextValue)} />
                  ))}
                </div>
                <div className="admin__record-footer">
                  <span>Les changements sont publiés après enregistrement.</span>
                  <button
                    type="button"
                    className="admin__text-button admin__text-button--danger"
                    aria-label={`Supprimer ${item.title || item.name || item.company || title}`}
                    onClick={() => {
                      if (window.confirm(`Supprimer « ${item.title || item.name || item.company || item.label || `Élément ${index + 1}`} » ?`)) {
                        onChange(items.filter((_, itemIndex) => itemIndex !== index))
                      }
                    }}
                  >
                    Supprimer cet élément
                  </button>
                </div>
              </div>
            </details>
          </article>
        ))}
      </div>
    </section>
  )
}
