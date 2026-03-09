import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function EditProfile() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    avatar: '',
    skills: '',
    portfolio: '',
    portfolioItems: [],
    otherDetails: '',
    resume: '',
    resumeName: '',
    university: '',
    major: '',
    graduationYear: '',
    hourlyRate: '',
    companyName: '',
    companyWebsite: ''
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const nextErrors = {}

    if (!form.email) nextErrors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      nextErrors.email = 'Please enter a valid email.'

    if (!form.firstName) nextErrors.firstName = 'First name is required.'
    if (!form.lastName) nextErrors.lastName = 'Last name is required.'

    if (user?.role === 'student') {
      if (form.graduationYear && Number(form.graduationYear) < 1900) {
        nextErrors.graduationYear = 'Please enter a valid year.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  useEffect(() => {
    if (!user) return
    const profile = user.profile || {}
    const portfolioItems = (profile.portfolio || []).map((item) => {
      if (typeof item === 'string') {
        return { title: item, description: '', link: item, image: '' }
      }
      return item
    });

    setForm({
      email: user.email || '',
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      bio: profile.bio || '',
      location: profile.location || '',
      avatar: profile.avatar || '',
      skills: (profile.skills || []).join(', '),
      portfolio: (profile.portfolio || []).join(', '),
      portfolioItems,
      otherDetails: profile.otherDetails || '',
      resume: profile.resume || '',
      resumeName: profile.resumeName || '',
      university: profile.university || '',
      major: profile.major || '',
      graduationYear: profile.graduationYear || '',
      hourlyRate: profile.hourlyRate || '',
      companyName: profile.companyName || '',
      companyWebsite: profile.companyWebsite || ''
    })
  }, [user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const updatePortfolioItem = (index, field, value) => {
    setForm((prev) => {
      const items = [...(prev.portfolioItems || [])]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, portfolioItems: items }
    })
  }

  const addPortfolioItem = () => {
    setForm((prev) => ({
      ...prev,
      portfolioItems: [
        ...(prev.portfolioItems || []),
        { title: '', description: '', link: '', image: '' }
      ]
    }))
  }

  const removePortfolioItem = (index) => {
    setForm((prev) => ({
      ...prev,
      portfolioItems: (prev.portfolioItems || []).filter((_, i) => i !== index)
    }))
  }

  const validateUrl = (value) => {
    if (!value) return false
    try {
      // allow URLs without protocol (add https)
      const normalized = value.startsWith('http') ? value : `https://${value}`
      new URL(normalized)
      return true
    } catch {
      return false
    }
  }

  const portfolioLinks = (form.portfolioItems?.length > 0
    ? form.portfolioItems.map((item) => item.link || item.title || '')
    : form.portfolio
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
  )
    .filter(Boolean)
    .map((item) => ({
      url: item,
      valid: validateUrl(item)
    }))

  const handleFileChange = async (e, fieldName, metadataField) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (fieldName === 'avatar') {
      const reader = new FileReader()
      reader.onload = () => {
        setForm((prev) => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
      return
    }

    // resume
    if (fieldName === 'resume') {
      const reader = new FileReader()
      reader.onload = () => {
        // store raw base64 for download convenience
        const base64 = reader.result.split(',')[1]
        setForm((prev) => ({
          ...prev,
          resume: base64,
          resumeName: file.name
        }))
      }
      reader.readAsDataURL(file)
      return
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      const updatedProfile = {
        firstName: form.firstName,
        lastName: form.lastName,
        bio: form.bio,
        location: form.location,
        avatar: form.avatar,
        skills: form.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
        portfolio:
          form.portfolioItems?.length > 0
            ? form.portfolioItems
                .map((item) => ({
                  title: item.title || item.link || '',
                  description: item.description || '',
                  link: item.link || '',
                  image: item.image || ''
                }))
                .filter((item) => item.title || item.link)
            : form.portfolio
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
                .map((link) => ({ title: link, description: '', link, image: '' })),
        otherDetails: form.otherDetails,
        resume: form.resume,
        resumeName: form.resumeName
      }

      if (user.role === 'student') {
        updatedProfile.university = form.university
        updatedProfile.major = form.major
        updatedProfile.graduationYear = form.graduationYear ? Number(form.graduationYear) : undefined
        updatedProfile.hourlyRate = form.hourlyRate ? Number(form.hourlyRate) : undefined
      }

      if (user.role === 'client') {
        updatedProfile.companyName = form.companyName
        updatedProfile.companyWebsite = form.companyWebsite
      }

      const { data } = await api.put('/users/profile', {
        email: form.email,
        ...updatedProfile
      })
      updateUser({ profile: data.profile, email: data.email || form.email })
      toast.success('Profile updated')
      navigate('/profile')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              className={`input-field w-full ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => {
                handleChange(e)
                setErrors((prev) => ({ ...prev, email: null }))
              }}
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              className={`input-field w-full ${errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              name="firstName"
              value={form.firstName}
              onChange={(e) => {
                handleChange(e)
                setErrors((prev) => ({ ...prev, firstName: null }))
              }}
              required
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              className={`input-field w-full ${errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              name="lastName"
              value={form.lastName}
              onChange={(e) => {
                handleChange(e)
                setErrors((prev) => ({ ...prev, lastName: null }))
              }}
              required
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            className="input-field w-full min-h-[120px]"
            name="bio"
            value={form.bio}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              className="input-field w-full"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
            <input
              className="input-field w-full"
              name="skills"
              value={form.skills}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <div className="mt-2 flex items-center gap-4">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                {form.avatar ? (
                  <img src={form.avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">?
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="text-sm text-gray-600"
                onChange={(e) => handleFileChange(e, 'avatar')}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Resume / CV (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              className="input-field w-full"
              onChange={(e) => handleFileChange(e, 'resume')}
            />
            {form.resumeName && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: <span className="font-medium">{form.resumeName}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Portfolio Items</label>
              <button
                type="button"
                onClick={addPortfolioItem}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                + Add item
              </button>
            </div>

            {form.portfolioItems?.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">
                Add portfolio items to showcase your work.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {form.portfolioItems.map((item, index) => {
                  const linkValid = item.link ? validateUrl(item.link) : true;
                  return (
                    <div key={index} className="rounded-lg border bg-white p-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Title</label>
                          <input
                            className="input-field w-full"
                            value={item.title}
                            onChange={(e) => updatePortfolioItem(index, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Link</label>
                          <input
                            className="input-field w-full"
                            value={item.link}
                            onChange={(e) => updatePortfolioItem(index, 'link', e.target.value)}
                          />
                          {item.link && (
                            <p className={`mt-1 text-xs ${linkValid ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {linkValid ? 'Valid URL' : 'Invalid URL'}
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700">Description</label>
                          <textarea
                            className="input-field w-full min-h-[80px]"
                            value={item.description}
                            onChange={(e) => updatePortfolioItem(index, 'description', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2 grid gap-2 md:grid-cols-2 items-end">
                          <div>
                            <label className="block text-xs font-medium text-gray-700">Image URL</label>
                            <input
                              className="input-field w-full"
                              value={item.image}
                              onChange={(e) => updatePortfolioItem(index, 'image', e.target.value)}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removePortfolioItem(index)}
                            className="mt-6 w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                          >
                            Remove item
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Details</label>
            <textarea
              className="input-field w-full min-h-[120px]"
              name="otherDetails"
              value={form.otherDetails}
              onChange={handleChange}
            />
          </div>
        </div>

        {user.role === 'student' && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">University</label>
                <input
                  className="input-field w-full"
                  name="university"
                  value={form.university}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Major</label>
                <input
                  className="input-field w-full"
                  name="major"
                  value={form.major}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                <input
                  type="number"
                  className={`input-field w-full ${errors.graduationYear ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  name="graduationYear"
                  value={form.graduationYear}
                  onChange={(e) => {
                    handleChange(e)
                    setErrors((prev) => ({ ...prev, graduationYear: null }))
                  }}
                />
                {errors.graduationYear && <p className="mt-1 text-sm text-red-600">{errors.graduationYear}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                <input
                  type="number"
                  className="input-field w-full"
                  name="hourlyRate"
                  value={form.hourlyRate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}

        {user.role === 'client' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                className="input-field w-full"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Website</label>
              <input
                className="input-field w-full"
                name="companyWebsite"
                value={form.companyWebsite}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
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
