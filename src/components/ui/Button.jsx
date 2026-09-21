import Icon from './Icon'

/**
 * Polymorphic button: renders <a> when href is provided, else <button>.
 */
export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  external = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'lg' ? 'btn--lg' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const inner = (
    <>
      {icon && iconPosition === 'left' && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <Icon name={icon} size={18} />}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...rest}
      >
        {inner}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {inner}
    </button>
  )
}
