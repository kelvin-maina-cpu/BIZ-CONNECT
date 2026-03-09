import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    )
  }

  const profile = user.profile || {}

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">?
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{profile.firstName} {profile.lastName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your profile information and settings.</p>
          </div>
        </div>
        <Link
          to="/profile/edit"
          className="btn-primary"
        >
          Edit Profile
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Basic Info</h2>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-800">Name:</span> {profile.firstName} {profile.lastName}
            </p>
            <p>
              <span className="font-medium text-gray-800">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium text-gray-800">Role:</span> {user.role}
            </p>
            {profile.location && (
              <p>
                <span className="font-medium text-gray-800">Location:</span> {profile.location}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">About</h2>
          <p className="mt-4 text-sm text-gray-600 whitespace-pre-line">
            {profile.bio || 'No biography added yet.'}
          </p>

          {user.role === 'student' ? (
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              {profile.university && (
                <p>
                  <span className="font-medium text-gray-800">University:</span> {profile.university}
                </p>
              )}
              {profile.major && (
                <p>
                  <span className="font-medium text-gray-800">Major:</span> {profile.major}
                </p>
              )}
              {profile.graduationYear && (
                <p>
                  <span className="font-medium text-gray-800">Graduation Year:</span> {profile.graduationYear}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              {profile.companyName && (
                <p>
                  <span className="font-medium text-gray-800">Company:</span> {profile.companyName}
                </p>
              )}
              {profile.companyWebsite && (
                <p>
                  <span className="font-medium text-gray-800">Website:</span> {profile.companyWebsite}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {profile.skills?.length > 0 && (
        <div className="mt-6 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
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

      {Array.isArray(profile.portfolio) && profile.portfolio.length > 0 && (
        <div className="mt-6 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Portfolio</h2>
          <ul className="mt-3 space-y-4 text-sm text-gray-600">
            {profile.portfolio.map((item, idx) => {
              const isString = typeof item === 'string';
              const link = isString ? item : item.link;
              const title = isString ? link : item.title;
              const description = isString ? '' : item.description;

              return (
                <li key={`${title}-${idx}`}>
                  <a
                    href={link?.startsWith('http') ? link : `https://${link}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    {title}
                  </a>
                  {description && (
                    <p className="mt-1 text-gray-600">{description}</p>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {profile.resume && (
        <div className="mt-6 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Resume</h2>
          <p className="mt-2 text-sm text-gray-600">
            <a
              href="/api/users/profile/resume"
              download={profile.resumeName || 'resume.pdf'}
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Download {profile.resumeName || 'Resume'}
            </a>
          </p>
        </div>
      )}

      {profile.otherDetails && (
        <div className="mt-6 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">More About Me</h2>
          <p className="mt-3 text-sm text-gray-600 whitespace-pre-line">{profile.otherDetails}</p>
        </div>
      )}
    </div>
  )
}
