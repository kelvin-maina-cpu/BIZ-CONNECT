import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../services/api'

const categories = [
  'Web Development',
  'Mobile App',
  'Design',
  'Writing',
  'Marketing',
  'Data Entry',
  'Tutoring',
  'Research',
  'Other'
]

export default function CreateGig() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: categories[0],
    skillsRequired: '',
    budgetMin: '',
    budgetMax: '',
    budgetType: 'fixed',
    deadline: '',
    location: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const nextErrors = {}

    if (!form.title) nextErrors.title = 'Title is required.'
    if (!form.description) nextErrors.description = 'Description is required.'
    if (!form.budgetMin) nextErrors.budgetMin = 'Minimum budget is required.'
    if (!form.budgetMax) nextErrors.budgetMax = 'Maximum budget is required.'
    if (form.budgetMin && form.budgetMax && Number(form.budgetMin) > Number(form.budgetMax)) {
      nextErrors.budgetMax = 'Maximum budget must be greater than minimum.'
    }
    if (!form.deadline) nextErrors.deadline = 'Deadline is required.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await api.post('/gigs', {
        title: form.title,
        description: form.description,
        category: form.category,
        skillsRequired: form.skillsRequired
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        budget: {
          min: Number(form.budgetMin),
          max: Number(form.budgetMax),
          type: form.budgetType
        },
        deadline: form.deadline,
        location: form.location
      })
      toast.success('Gig created successfully')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create gig')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Post a New Gig</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            className={`input-field w-full ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            name="title"
            value={form.title}
            onChange={(e) => {
              handleChange(e)
              setErrors((prev) => ({ ...prev, title: null }))
            }}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className={`input-field w-full min-h-[120px] ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            name="description"
            value={form.description}
            onChange={(e) => {
              handleChange(e)
              setErrors((prev) => ({ ...prev, description: null }))
            }}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              className="input-field w-full"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              className="input-field w-full"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Remote or city"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Skills Required (comma-separated)</label>
          <input
            className="input-field w-full"
            name="skillsRequired"
            value={form.skillsRequired}
            onChange={handleChange}
            placeholder="e.g. React, Figma, Node.js"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget Min</label>
            <input
              type="number"
              className={`input-field w-full ${errors.budgetMin ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              name="budgetMin"
              value={form.budgetMin}
              onChange={(e) => {
                handleChange(e)
                setErrors((prev) => ({ ...prev, budgetMin: null, budgetMax: null }))
              }}
              required
            />
            {errors.budgetMin && <p className="mt-1 text-sm text-red-600">{errors.budgetMin}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget Max</label>
            <input
              type="number"
              className={`input-field w-full ${errors.budgetMax ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              name="budgetMax"
              value={form.budgetMax}
              onChange={(e) => {
                handleChange(e)
                setErrors((prev) => ({ ...prev, budgetMax: null }))
              }}
              required
            />
            {errors.budgetMax && <p className="mt-1 text-sm text-red-600">{errors.budgetMax}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget Type</label>
            <select
              className="input-field w-full"
              name="budgetType"
              value={form.budgetType}
              onChange={handleChange}
              required
            >
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              className={`input-field w-full ${errors.deadline ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              name="deadline"
              value={form.deadline}
              onChange={(e) => {
                handleChange(e)
                setErrors((prev) => ({ ...prev, deadline: null }))
              }}
              required
            />
            {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Posting...' : 'Post Gig'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
