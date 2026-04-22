// Sticky horizontally scrolling category tabs. Clicking a tab scrolls the
// page to the matching section (sections are identified by `data-category`).
// The active tab is driven by the parent — the parent tracks scroll position
// with IntersectionObserver and passes `activeId` in.

export default function CategoryTabs({ categories, activeId, onSelect }) {
  return (
    <div
      className="sticky top-0 z-20 -mx-4 px-4 py-2
                 bg-cream-50/95 backdrop-blur supports-[backdrop-filter]:bg-cream-50/80
                 border-b border-cream-200"
    >
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 py-0.5">
        {categories.map(c => {
          const active = c.id === activeId
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-semibold
                          transition focus:outline-none focus:ring-2 focus:ring-saffron-400
                          ${active
                            ? 'bg-saffron-500 text-white shadow-soft'
                            : 'bg-white text-ink-600 border border-cream-200 hover:border-saffron-200'}`}
              aria-current={active ? 'true' : undefined}
            >
              {c.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
