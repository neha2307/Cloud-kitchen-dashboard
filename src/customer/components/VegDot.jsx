// Indian-standard veg/non-veg indicator.
// Small square with colored inner dot. Green for veg, brown-red for non-veg.

export default function VegDot({ veg, size = 14 }) {
  const ring = veg ? 'border-leaf-500' : 'border-chili-500'
  const dot  = veg ? 'bg-leaf-500'     : 'bg-chili-500'
  return (
    <span
      aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
      className={`inline-grid place-items-center border ${ring} rounded-[3px] shrink-0`}
      style={{ width: size, height: size }}
    >
      <span className={`${dot} rounded-full`} style={{ width: size * 0.5, height: size * 0.5 }} />
    </span>
  )
}
