// Customer-facing menu (landing page).
// Route: /kitchen
//
// Layout (mobile-first, max-w-xl container):
//   Hero card
//   Sticky category tabs  ← IntersectionObserver drives `activeId`
//   Category sections with menu items
//   Sticky bottom cart bar (appears when cart ≥ 1)

import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Utensils } from 'lucide-react'
import HeroCard from '../components/HeroCard.jsx'
import CategoryTabs from '../components/CategoryTabs.jsx'
import MenuItemCard from '../components/MenuItemCard.jsx'
import StickyCartBar from '../components/StickyCartBar.jsx'
import { CATEGORIES, MENU } from '../data/kitchen.js'

export default function CustomerMenu() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState(CATEGORIES[0].id)
  const sectionRefs = useRef({})

  // Group menu by category (only include categories that actually have items).
  const grouped = useMemo(() => {
    return CATEGORIES
      .map(c => ({ ...c, items: MENU.filter(m => m.category === c.id) }))
      .filter(g => g.items.length > 0)
  }, [])

  // Sync active tab with scroll position.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost section that is at least partially in view
        // from the top third of the viewport.
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) {
          const id = visible[0].target.getAttribute('data-category')
          if (id) setActiveId(id)
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0.01 }
    )
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [grouped])

  const scrollToCategory = (id) => {
    const el = sectionRefs.current[id]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id) // optimistic
    }
  }

  return (
    <div className="customer-page">
      <div className="mx-auto max-w-xl px-4 pt-4 pb-32">
        <HeroCard />

        <div className="mt-5 flex items-center gap-2 text-ink-600">
          <Utensils className="h-4 w-4 text-saffron-500" />
          <h2 className="font-display font-bold text-lg text-ink-800">Today's menu</h2>
        </div>

        <div className="mt-2">
          <CategoryTabs
            categories={grouped}
            activeId={activeId}
            onSelect={scrollToCategory}
          />
        </div>

        <div className="mt-4 space-y-8">
          {grouped.map(group => (
            <section
              key={group.id}
              data-category={group.id}
              ref={(el) => { sectionRefs.current[group.id] = el }}
              className="menu-section"
            >
              <h3 className="font-display font-bold text-ink-800 text-base uppercase tracking-wider">
                {group.label}
                <span className="ml-2 text-ink-400 text-sm font-medium normal-case tracking-normal">
                  {group.items.length}
                </span>
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-3">
                {group.items.map(item => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-ink-400">
          Prices are inclusive of taxes. Delivery fee is added at checkout.
        </p>
      </div>

      <StickyCartBar
        onCheckout={() => navigate('/kitchen/checkout')}
        ctaLabel="View cart"
      />
    </div>
  )
}
