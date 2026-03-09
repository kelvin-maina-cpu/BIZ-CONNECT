import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  DollarSign,
  Calendar,
  FileText,
  Sparkles,
} from 'lucide-react'

const steps = [
  { id: 1, title: 'Basics', icon: Briefcase },
  { id: 2, title: 'Details', icon: FileText },
  { id: 3, title: 'Budget', icon: DollarSign },
  { id: 4, title: 'Review', icon: Sparkles },
]

export default function GigCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [isAnimating, setIsAnimating] = useState(false)

  const nextStep = () => {
    if (currentStep < steps.length) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <motion.div
                animate={{
                  scale: currentStep === step.id ? 1.1 : 1,
                  backgroundColor: currentStep >= step.id ? '#3b82f6' : '#e5e7eb',
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center relative"
              >
                <step.icon
                  className={`h-5 w-5 ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}`}
                />
                {currentStep > step.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                    className="h-full bg-blue-500"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step) => (
            <span
              key={step.id}
              className={`text-sm font-medium ${
                currentStep === step.id ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Let's start with the basics</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gig Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Need a React Developer for E-commerce Site"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Web Development', 'Design', 'Marketing', 'Writing', 'Data', 'Other'].map((cat) => (
                    <motion.button
                      key={cat}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-sm font-medium"
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Describe your project</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Tell us about your project requirements..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Python', 'UI/UX', 'SEO'].map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.1 }}
                      className="px-4 py-2 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      + {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Set your budget</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Type</label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-blue-500 bg-blue-50 rounded-xl cursor-pointer">
                      <input type="radio" name="budgetType" className="mr-3" defaultChecked />
                      <div>
                        <div className="font-medium">Fixed Price</div>
                        <div className="text-sm text-gray-500">Pay when project is complete</div>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300">
                      <input type="radio" name="budgetType" className="mr-3" />
                      <div>
                        <div className="font-medium">Hourly Rate</div>
                        <div className="text-sm text-gray-500">Pay by the hour</div>
                      </div>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">Minimum ($)</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 mt-1"
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Maximum ($)</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 mt-1"
                        placeholder="1000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Review and post</h2>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Title</span>
                  <span className="font-medium">React Developer Needed</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">Web Development</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-medium">$500 - $1,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">2 weeks</span>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-xl">
                <Sparkles className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-green-800">Your gig will be visible to 10,000+ students</span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center px-6 py-3 border border-gray-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextStep}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          {currentStep === steps.length ? 'Post Gig' : 'Continue'}
          {currentStep !== steps.length && <ChevronRight className="ml-2 h-5 w-5" />}
        </motion.button>
      </div>
    </div>
  )
}
