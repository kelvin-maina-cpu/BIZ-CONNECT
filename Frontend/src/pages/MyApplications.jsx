import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import EmptyState from '../components/common/EmptyState'

export default function MyApplications() {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get('/applications/my-applications')
      setApplications(data)
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to load applications'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async (applicationId) => {
    try {
      await api.delete(`/applications/${applicationId}`)
      toast.success('Application withdrawn')
      setApplications((prev) => prev.filter((app) => app._id !== applicationId))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to withdraw application')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track the status of your applications and follow up.</p>
        </div>
        <Link
          to="/gigs"
          className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted"
        >
          Browse more gigs
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading your applications...</p>
      ) : error ? (
        <EmptyState
          title="Unable to load applications"
          message={error}
          actionLabel="Try again"
          onAction={fetchApplications}
        />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          message="You haven't applied to any gigs yet. Explore gigs and send your first application."
          actionLabel="Browse gigs"
          actionTo="/gigs"
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{app.gig?.title || 'Unknown Gig'}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Status: <span className="font-medium">{app.status}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                    ${app.proposedRate} / {app.estimatedDuration}
                  </span>

                  {app.status === 'pending' && (
                    <button
                      onClick={() => handleWithdraw(app._id)}
                      className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>

              {app.coverLetter && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700">Cover Letter</h3>
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{app.coverLetter}</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/gigs/${app.gig?._id}`}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View gig details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
