// Home kitchen hero — builds trust before the menu.
// Warm gradient, kitchen name, tagline, owner intro, key chips.

import { Clock, MapPin, IndianRupee, Star, Phone } from 'lucide-react'
import { KITCHEN } from '../data/kitchen.js'

export default function HeroCard() {
  const k = KITCHEN
  return (
    <section
      className="relative overflow-hidden rounded-3xl p-5 sm:p-6
                 bg-gradient-to-br from-saffron-500 via-saffron-500 to-saffron-700
                 text-white shadow-pop"
    >
      {/* Decorative radial glow */}
      <div
        aria-hidden
        className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
      />

      <div className="relative">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold
                        uppercase tracking-[0.18em] bg-white/15 rounded-full px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          Accepting orders · {k.openTime} – {k.closeTime}
        </div>

        <h1 className="mt-3 font-display font-bold text-[26px] sm:text-3xl leading-tight">
          {k.name}
        </h1>
        <p className="mt-1 text-saffron-50/90 text-sm sm:text-base">
          {k.tagline}
        </p>

        <p className="mt-3 text-sm text-saffron-50/80 leading-relaxed">
          Cooked by <span className="font-semibold text-white">{k.owner.firstName}</span> in {k.owner.locality},
          serving neighbours since {k.owner.cookingSince}.
        </p>

        <div className="mt-4 grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          <Chip icon={Star}       label={`${k.rating} (${k.ratingCount})`} />
          <Chip icon={Clock}      label={`${k.etaMinutes} min`} />
          <Chip icon={IndianRupee} label={`Min ₹${k.minOrder}`} />
          <Chip icon={MapPin}     label={k.deliveryZones.join(' · ')} />
        </div>

        <a
          href={`tel:${k.phone.replace(/\s/g, '')}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold
                     bg-white/15 hover:bg-white/25 rounded-xl px-3 py-2 transition
                     focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <Phone className="h-4 w-4" />
          {k.phone}
        </a>
      </div>
    </section>
  )
}

function Chip({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                     bg-white/15 rounded-full px-2.5 py-1.5">
      <Icon className="h-3.5 w-3.5" />
      <span className="truncate">{label}</span>
    </span>
  )
}
