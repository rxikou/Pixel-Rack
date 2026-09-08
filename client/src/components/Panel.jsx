import PropTypes from 'prop-types'

function Panel({ id, title, action, children, bodyClassName, className }) {
  return (
    <section
      id={id}
      className={`pixel-panel bg-bg-container/70 ${className ?? ''}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b-[3px] border-[#05070d] bg-sky-700 px-4 py-2">
        <h2 className="pixel-text font-pixel text-lg uppercase leading-none tracking-wide text-white sm:text-xl">
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
