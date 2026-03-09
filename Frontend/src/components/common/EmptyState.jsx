import { Link } from 'react-router-dom'

export default function EmptyState({
  title = 'Nothing here yet',
  message = 'There is currently no content to display.',
  actionLabel,
  actionTo,
  onAction
}) {
  return (
    <div className="rounded-lg border bg-card p-10 text-center">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      {actionLabel && (onAction || actionTo) && (
        <div className="mt-6">
          {actionTo ? (
            <Link
              to={actionTo}
              className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
