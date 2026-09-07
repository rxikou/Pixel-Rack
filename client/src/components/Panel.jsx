import PropTypes from 'prop-types'

function Panel({ id, title, action, children, bodyClassName, className }) {
  return (
    <section
      id={id}
      className={`border-2 border-accent-blue/25 bg-bg-container/40 ${className ?? ''}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-accent-blue/25 bg-bg-container/80 px-4 py-3">
        <h2 className="font-pixel text-lg uppercase leading-none tracking-wide text-text-primary sm:text-xl">
          {title}
        </h2>
        {action}
      </header>
      <div className={bodyClassName ?? 'p-3'}>{children}</div>
    </section>
  )
}

Panel.propTypes = {
  id: PropTypes.string,
  title: PropTypes.node.isRequired,
  action: PropTypes.node,
  children: PropTypes.node.isRequired,
  bodyClassName: PropTypes.string,
  className: PropTypes.string,
}

export default Panel
