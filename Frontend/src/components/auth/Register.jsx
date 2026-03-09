import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, User, Building2, GraduationCap } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    university: '',
    major: '',
    companyName: ''
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const nextErrors = {}

    if (!formData.firstName) nextErrors.firstName = 'First name is required.'
    if (!formData.lastName) nextErrors.lastName = 'Last name is required.'

    if (!formData.email) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email.'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    if (role === 'student') {
      if (!formData.university) nextErrors.university = 'University is required.'
      if (!formData.major) nextErrors.major = 'Major is required.'
    }

    if (role === 'client') {
      if (!formData.companyName) nextErrors.companyName = 'Company name is required.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const success = await register({ ...formData, role })
    if (success) navigate('/dashboard')
  }

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <h2 className="text-center text-3xl font-bold mb-8">Join Biz Connet</h2>
          <p className="text-center text-gray-600 mb-8">I want to...</p>
          
          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelect('student')}
              className="w-full p-6 bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-primary-500 transition-all text-left"
            >
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-primary-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">Find Work</h3>
                  <p className="text-gray-500 text-sm">I'm a student looking for freelance opportunities</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('client')}
              className="w-full p-6 bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-primary-500 transition-all text-left"
            >
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-primary-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">Hire Talent</h3>
                  <p className="text-gray-500 text-sm">I'm looking to hire skilled students</p>
                </div>
              </div>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <h2 className="text-center text-3xl font-bold mb-8">
          Create your {role === 'student' ? 'Student' : 'Client'} Account
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className={`input-field pl-10 ${errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({ ...formData, firstName: e.target.value })
                    setErrors((prev) => ({ ...prev, firstName: null }))
                  }}
                />
              </div>
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                className={`input-field ${errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value })
                  setErrors((prev) => ({ ...prev, lastName: null }))
                }}
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                className={`input-field pl-10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  setErrors((prev) => ({ ...prev, email: null }))
                }}
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                className={`input-field pl-10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  setErrors((prev) => ({ ...prev, password: null }))
                }}
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {role === 'student' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <input
                  type="text"
                  className={`input-field ${errors.university ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.university}
                  onChange={(e) => {
                    setFormData({ ...formData, university: e.target.value })
                    setErrors((prev) => ({ ...prev, university: null }))
                  }}
                />
                {errors.university && <p className="mt-1 text-sm text-red-600">{errors.university}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                <input
                  type="text"
                  className={`input-field ${errors.major ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.major}
                  onChange={(e) => {
                    setFormData({ ...formData, major: e.target.value })
                    setErrors((prev) => ({ ...prev, major: null }))
                  }}
                />
                {errors.major && <p className="mt-1 text-sm text-red-600">{errors.major}</p>}
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                className={`input-field ${errors.companyName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                value={formData.companyName}
                onChange={(e) => {
                  setFormData({ ...formData, companyName: e.target.value })
                  setErrors((prev) => ({ ...prev, companyName: null }))
                }}
              />
              {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
            </div>
          )}

          <button type="submit" className="btn-primary w-full mt-6">
            Create Account
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-center text-sm text-gray-600 hover:text-gray-900 mt-4"
          >
            ← Back to role selection
          </button>
        </form>
      </div>
    </div>
  )
}
