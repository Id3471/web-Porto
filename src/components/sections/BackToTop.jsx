import { useScrolled } from '../../hooks'
import { Icon } from '../ui'
import './BackToTop.css'

export default function BackToTop() {
  const visible = useScrolled(600)

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Revenir en haut de la page"
    >
      <Icon name="arrowUp" size={19} />
    </button>
  )
}
