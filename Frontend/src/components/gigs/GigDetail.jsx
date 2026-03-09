import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function GigDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [gig, setGig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [existingApplication, setExistingApplication] = useState(null)
  const [form, setForm] = useState({
    coverLetter: '',
    proposedRate: '',
    estimatedDuration: ''
  })
  const [errors, setErrors] = useState({})
  const [applying, setApplying] = useState(false)
  const [hiring, setHiring] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [conversations, setConversations] = useState([])

  const demoGig = useMemo(() => ({
    _id: 'demo',
    title: 'Sample Gig — Try Again Later',
    description: 'Unable to load gig details right now. This is demo content to help you explore the layout while we reconnect.',
    category: 'Unavailable',
    budget: { min: 0, max: 0 },
    deadline: new Date().toISOString(),
    location: 'Remote',
    status: 'open',
    client: {
      profile: {
        firstName: 'Demo',
        lastName: 'Client',
        companyName: 'Biz Connet'
      }
    },
    skillsRequired: ['React', 'Node.js', 'MongoDB']
  }), [])

  const validateApplication = () => {
    const nextErrors = {}
    if (!form.coverLetter) nextErrors.coverLetter = 'Cover letter is required.'
    if (!form.proposedRate) nextErrors.proposedRate = 'Proposed rate is required.'
    if (!form.estimatedDuration) nextErrors.estimatedDuration = 'Estimated duration is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const isClientOwner = useMemo(() => {
    return user?.role === 'client' && gig?.client?._id === user?._id
  }, [user, gig])

  const isStudent = useMemo(() => user?.role === 'student', [user])

  const getConversationFor = (studentId) => {
    return conversations.find((conv) => String(conv.partner._id) === String(studentId))
  }

  useEffect(() => {
    if (id) {
      fetchGig()
    }
  }, [id])

  useEffect(() => {
    if (isClientOwner) {
      fetchApplications()
    }
  }, [isClientOwner])

  useEffect(() => {
    if (isStudent && gig) {
      fetchMyApplication()
    }
  }, [isStudent, gig])

  const fetchMyApplication = async () => {
    try {
      const { data } = await api.get('/applications/my-applications')
      const existing = data.find((app) => app.gig?._id === id)
      setExistingApplication(existing || null)
    } catch (error) {
      // ignore, not critical for viewing gig
    }
  }

  const fetchGig = async () => {
    try {
      setLoading(true)
      setFetchError('')
      const { data } = await api.get(`/gigs/${id}`)
      setGig(data)
    } catch (error) {
      const status = error?.response?.status
      const message = error.response?.data?.message || 'Unable to load gig'
      setFetchError(message)

      if (status === 404) {
        setGig(null)
      } else {
        setGig(demoGig)
      }

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/messages/conversations')
      setConversations(data)
    } catch (error) {
      // ignore; conversations are optional for applicant list UI
    }
  }

  const fetchApplications = async () => {
    try {
      const { data } = await api.get(`/applications/gig/${id}`)
      setApplications(data)
      fetchConversations()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load applications')
    }
  }

  const handleApply = async (e) => {
    e.preventDefault()
    if (!validateApplication()) return

    setApplying(true)
    try {
      const { data } = await api.post('/applications/apply', {
        gigId: id,
        coverLetter: form.coverLetter,
        proposedRate: Number(form.proposedRate),
        estimatedDuration: form.estimatedDuration
      })

      toast.success('Application sent')
      setForm({ coverLetter: '', proposedRate: '', estimatedDuration: '' })
      setExistingApplication(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to apply')
    } finally {
      setApplying(false)
    }
  }

  const handleHire = async (studentId) => {
    setHiring(true)
    try {
      await api.post('/gigs/hire', { gigId: id, studentId })
      toast.success('Student hired!')
      fetchGig()
      fetchApplications()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to hire student')
    } finally {
      setHiring(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading gig...</p>
      </div>
    )
  }

  if (!gig) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Gig Not Found</h2>
          <p className="mt-3 text-gray-600">
            We couldn't find the gig you're looking for. It may have been removed or the link is incorrect.
          </p>
          <button
            onClick={() => navigate('/gigs')}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Browse Gigs
          </button>
        </div>
      </div>
    )
  }

  const deadlineText = gig.deadline ? new Date(gig.deadline).toLocaleDateString() : 'N/A'

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {fetchError && gig && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
          <p>
            {fetchError}. Showing demo content while the issue is resolved.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={fetchGig}
              className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/gigs')}
              className="inline-flex items-center justify-center rounded-md border border-primary-600 bg-white px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
            >
              Back to gigs
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{gig.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{gig.category}</p>
          <p className="mt-4 text-gray-700 whitespace-pre-line">{gig.description}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-card p-5">
              <h2 className="text-sm font-semibold text-gray-800">Budget</h2>
              <p className="mt-1 text-lg font-semibold">
                ${gig.budget?.min?.toLocaleString()} - ${gig.budget?.max?.toLocaleString()} {gig.budget?.type}
              </p>
            </div>

            <div className="rounded-lg border bg-card p-5">
              <h2 className="text-sm font-semibold text-gray-800">Details</h2>
              <p className="mt-1 text-sm text-gray-600">Deadline: {deadlineText}</p>
              <p className="mt-1 text-sm text-gray-600">Location: {gig.location || 'Remote'}</p>
              <p className="mt-1 text-sm text-gray-600">Status: {gig.status}</p>
            </div>
          </div>

          {gig.skillsRequired?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-800">Skills Required</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {gig.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-lg border bg-card p-5">
            <h2 className="text-sm font-semibold text-gray-800">Client</h2>
            <p className="mt-1 text-sm text-gray-600">
              {gig.client?.profile?.companyName ||
                `${gig.client?.profile?.firstName ?? ''} ${gig.client?.profile?.lastName ?? ''}`}
            </p>
            {gig.client?.profile?.bio && (
              <p className="mt-1 text-sm text-gray-600">{gig.client.profile.bio}</p>
            )}
          </div>
        </div>

        <aside className="w-full md:w-96">
          {isStudent && gig.status === 'open' && (
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Apply for this gig</h2>

              {existingApplication ? (
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-700">
                    You already applied for this gig. Your current status is{' '}
                    <span className="font-semibold">{existingApplication.status}</span>.
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    You can view and manage your applications in the "My Applications" page.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                    <textarea
                      className={`input-field w-full min-h-[110px] ${
                        errors.coverLetter ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      value={form.coverLetter}
                      onChange={(e) => {
                        setForm({ ...form, coverLetter: e.target.value })
                        setErrors((prev) => ({ ...prev, coverLetter: null }))
                      }}
                      required
                    />
                    {errors.coverLetter && <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Proposed Rate</label>
                    <input
                      type="number"
                      className={`input-field w-full ${
                        errors.proposedRate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      value={form.proposedRate}
                      onChange={(e) => {
                        setForm({ ...form, proposedRate: e.target.value })
                        setErrors((prev) => ({ ...prev, proposedRate: null }))
                      }}
                      required
                    />
                    {errors.proposedRate && <p className="mt-1 text-sm text-red-600">{errors.proposedRate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimated Duration</label>
                    <input
                      className={`input-field w-full ${
                        errors.estimatedDuration ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      value={form.estimatedDuration}
                      onChange={(e) => {
                        setForm({ ...form, estimatedDuration: e.target.value })
                        setErrors((prev) => ({ ...prev, estimatedDuration: null }))
                      }}
                      placeholder="e.g. 2 weeks, 1 month"
                      required
                    />
                    {errors.estimatedDuration && (
                      <p className="mt-1 text-sm text-red-600">{errors.estimatedDuration}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={applying}
                    className="btn-primary w-full"
                  >
                    {applying ? 'Sending...' : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          )}

          {isClientOwner && (
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Applicants</h2>
                <button
                  onClick={fetchApplications}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Refresh
                </button>
              </div>
              {applications.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No applications yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {applications.map((app) => {
                    const conversation = getConversationFor(app.student._id)
                    const unread = conversation?.unreadCount || 0
                    const hasConversation = Boolean(conversation)

                    return (
                      <div key={app._id} className="rounded-lg bg-white p-4 shadow-sm border">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex flex-1 items-start gap-4">
                            <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-100">
                              {app.student?.profile?.avatar ? (
                                <img
                                  src={app.student.profile.avatar}
                                  alt={`${app.student.profile?.firstName} ${app.student.profile?.lastName}`}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400">?
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">
                                {app.student?.profile?.firstName} {app.student?.profile?.lastName}
                              </p>
                              {app.student?.profile?.major && (
                                <p className="text-sm text-muted-foreground">{app.student.profile.major}</p>
                              )}
                              {app.student?.profile?.bio && (
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{app.student.profile.bio}</p>
                              )}
                              <div className="mt-2 text-xs text-gray-600 space-y-1">
                                <p>Proposed rate: <span className="font-medium">${app.proposedRate}</span></p>
                                <p>Estimated duration: <span className="font-medium">{app.estimatedDuration}</span></p>
                              </div>
                              {app.student?.profile?.skills?.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {app.student.profile.skills.slice(0, 4).map((skill) => (
                                    <span
                                      key={skill}
                                      className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {app.student.profile.skills.length > 4 && (
                                    <span className="text-xs text-gray-500">+{app.student.profile.skills.length - 4} more</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className="text-sm font-semibold">{app.status}</span>
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => navigate(`/chat/${app.student._id}`)}
                                className="rounded-md border border-primary-600 bg-white px-3 py-1 text-sm font-medium text-primary-600 hover:bg-primary-50"
                              >
                                {hasConversation ? 'Open Chat' : 'Start Chat'}
                              </button>
                              {unread > 0 && (
                                <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                                  {unread} new
                                </span>
                              )}
                              {app.status === 'pending' && (
                                <button
                                  onClick={() => handleHire(app.student._id)}
                                  className="rounded-md bg-primary-600 px-3 py-1 text-sm font-medium text-white hover:bg-primary-700"
                                  disabled={hiring}
                                >
                                  {hiring ? 'Hiring…' : 'Hire'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
