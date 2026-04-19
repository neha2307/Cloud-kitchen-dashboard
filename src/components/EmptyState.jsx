export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card p-10 flex flex-col items-center justify-center text-center">
      {Icon && (
        <div className="h-12 w-12 rounded-2xl bg-cream-100 dark:bg-ink-700 grid place-items-center text-ink-400 dark:text-ink-300 mb-3">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="font-display font-bold text-ink-800 dark:text-cream-50">{title}</h3>
      {description && <p className="text-sm text-ink-400 dark:text-ink-300 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
