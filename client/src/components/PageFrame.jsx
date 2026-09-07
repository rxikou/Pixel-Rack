const CORNERS = [
  'left-3 top-3 border-l-2 border-t-2',
  'right-3 top-3 border-r-2 border-t-2',
  'bottom-3 left-3 border-b-2 border-l-2',
  'bottom-3 right-3 border-b-2 border-r-2',
]

function PageFrame() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {CORNERS.map((cls) => (
        <div
          key={cls}
          className={`absolute h-6 w-6 border-accent-blue/40 ${cls}`}
        />
      ))}
    </div>
  )
}

export default PageFrame
