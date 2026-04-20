'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiEdit2, FiPlus, FiTrash2, FiCheckCircle, FiDownload, FiUpload, FiX, FiFile } from 'react-icons/fi'
import RoleGuard from '@/components/RoleGuard'

interface Education {
  id: number
  degree: string
  school: string
  year: number
}

interface Experience {
  id: number
  position: string
  school: string
  startYear: number
  endYear?: number
  current: boolean
}

interface Certificate {
  id: number
  name: string
  issuer: string
  year: number
  fileUrl?: string
  fileName?: string
}

interface ExtraCurricular {
  id: number
  title: string
  description: string
  date: string
  fileUrl?: string
  fileName?: string
}

const mockProfile = {
  name: 'Rajesh Kumar',
  email: 'rajesh@example.com',
  phone: '9876543210',
  headline: 'Senior English Teacher | 8 years exp | Cambridge Certified',
  bio: 'Passionate educator with 8+ years of experience in teaching English literature and communication skills. Specialized in ICSE and CBSE curriculum.',
  profileCompleteness: 75,
  education: [
    { id: 1, degree: 'M.A. English', school: 'Delhi University', year: 2012 },
    { id: 2, degree: 'B.A. English', school: 'Delhi University', year: 2010 },
  ],
  experience: [
    { id: 1, position: 'Senior English Teacher', school: 'Delhi Public School', startYear: 2019, current: true },
    { id: 2, position: 'English Teacher', school: 'The Heritage School', startYear: 2015, endYear: 2019 },
  ],
  certificates: [
    { id: 1, name: 'Cambridge CELTA', issuer: 'Cambridge University', year: 2018, fileName: 'cambridge-celta.pdf' },
    { id: 2, name: 'TEFL Certification', issuer: 'International TEFL Institute', year: 2015, fileName: 'tefl-cert.pdf' },
  ],
  extraCurricular: [
    { id: 1, title: 'National Debate Championship', description: 'Finalist in National Debate Championship 2022', date: '2022-11-15', fileName: 'debate-cert.pdf' },
    { id: 2, title: 'Literary Festival Organizer', description: 'Organized annual school literary festival with 500+ participants', date: '2021-09-20', fileName: 'festival-org.pdf' },
  ],
  skills: ['English Literature', 'Communication', 'Curriculum Planning', 'Student Mentorship'],
  preferences: {
    jobType: 'Full-time',
    location: ['Delhi', 'Bangalore', 'Mumbai'],
    salaryExpectation: 40000,
  }
}

export default function TeacherProfile() {
  const [profile, setProfile] = useState(mockProfile)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [newEducation, setNewEducation] = useState({ degree: '', school: '', year: new Date().getFullYear() })
  const [newCertificate, setNewCertificate] = useState({ name: '', issuer: '', year: new Date().getFullYear(), file: null as File | null })
  const [newExtraCurricular, setNewExtraCurricular] = useState({ title: '', description: '', date: '', file: null as File | null })

  const removeEducation = (id: number) => {
    setProfile({
      ...profile,
      education: profile.education.filter(edu => edu.id !== id),
    })
  }

  const removeExperience = (id: number) => {
    setProfile({
      ...profile,
      experience: profile.experience.filter(exp => exp.id !== id),
    })
  }

  const removeCertificate = (id: number) => {
    setProfile({
      ...profile,
      certificates: profile.certificates.filter(cert => cert.id !== id),
    })
  }

  const removeExtraCurricular = (id: number) => {
    setProfile({
      ...profile,
      extraCurricular: profile.extraCurricular.filter(activity => activity.id !== id),
    })
  }

  const addCertificate = () => {
    if (newCertificate.name && newCertificate.issuer) {
      setProfile({
        ...profile,
        certificates: [...profile.certificates, {
          id: Date.now(),
          name: newCertificate.name,
          issuer: newCertificate.issuer,
          year: newCertificate.year,
          fileName: newCertificate.file?.name || 'certificate.pdf'
        }],
      })
      setNewCertificate({ name: '', issuer: '', year: new Date().getFullYear(), file: null })
    }
  }

  const addExtraCurricular = () => {
    if (newExtraCurricular.title && newExtraCurricular.description) {
      setProfile({
        ...profile,
        extraCurricular: [...profile.extraCurricular, {
          id: Date.now(),
          title: newExtraCurricular.title,
          description: newExtraCurricular.description,
          date: newExtraCurricular.date,
          fileName: newExtraCurricular.file?.name || 'activity.pdf'
        }],
      })
      setNewExtraCurricular({ title: '', description: '', date: '', file: null })
    }
  }

  return (
    <RoleGuard allowedRoles={['teacher']}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
              <p className="text-xl text-blue-100 mb-4">{profile.headline}</p>
              <p className="text-blue-100">{profile.email} | {profile.phone}</p>
            </div>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 font-medium flex items-center gap-2">
              <FiEdit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Completeness */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-lg">Profile Completeness</h2>
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{profile.profileCompleteness}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${profile.profileCompleteness}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            {100 - profile.profileCompleteness}% more information needed to complete your profile
          </p>
        </div>

        {/* Bio Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">About You</h2>
            <button
              onClick={() => setEditingSection(editingSection === 'bio' ? null : 'bio')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
        </div>

        {/* Education Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Education</h2>
            <button
              onClick={() => setEditingSection(editingSection === 'education' ? null : 'education')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
            </button>
          </div>

          {editingSection === 'education' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <input
                type="text"
                placeholder="Degree"
                value={newEducation.degree}
                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Institute/School"
                value={newEducation.school}
                onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                placeholder="Year"
                value={newEducation.year}
                onChange={(e) => setNewEducation({ ...newEducation, year: parseInt(e.target.value) })}
                className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => setProfile({
                  ...profile,
                  education: [...profile.education, { id: Date.now(), ...newEducation }],
                })}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium"
              >
                Add Education
              </button>
            </div>
          )}

          <div className="space-y-4">
            {profile.education.map(edu => (
              <div key={edu.id} className="border-l-4 border-blue-600 pl-4 py-2 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{edu.degree}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{edu.school}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{edu.year}</p>
                </div>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Experience</h2>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2">
              <FiPlus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {profile.experience.map(exp => (
              <div key={exp.id} className="border-l-4 border-green-600 pl-4 py-2 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{exp.position}</h3>
                    {exp.current && (
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{exp.school}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {exp.startYear} - {exp.current ? 'Present' : exp.endYear}
                  </p>
                </div>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates Section with File Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Certifications & Awards</h2>
            <button
              onClick={() => setEditingSection(editingSection === 'certificates' ? null : 'certificates')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
            </button>
          </div>

          {editingSection === 'certificates' && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FiUpload className="w-5 h-5" />
                Add New Certificate
              </h3>
              <input
                type="text"
                placeholder="Certificate Name"
                value={newCertificate.name}
                onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
                className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Issuing Organization"
                value={newCertificate.issuer}
                onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                placeholder="Year Issued"
                value={newCertificate.year}
                onChange={(e) => setNewCertificate({ ...newCertificate, year: parseInt(e.target.value) })}
                className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <div className="relative mb-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={(e) => setNewCertificate({ ...newCertificate, file: e.target.files?.[0] || null })}
                  className="hidden"
                  id="cert-file"
                />
                <label
                  htmlFor="cert-file"
                  className="block w-full px-4 py-3 border-2 border-dashed border-purple-400 dark:border-purple-600 rounded-lg text-center cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2 text-purple-700 dark:text-purple-300">
                    <FiUpload className="w-5 h-5" />
                    <span>{newCertificate.file?.name || 'Click to upload certificate'}</span>
                  </div>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={addCertificate}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 font-medium flex items-center justify-center gap-2"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Certificate
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  className="flex-1 border border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 py-2 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {profile.certificates.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 py-4">No certificates added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-3 font-bold text-gray-700 dark:text-gray-300">Certificate Name</th>
                    <th className="text-left py-3 px-3 font-bold text-gray-700 dark:text-gray-300">Issuer</th>
                    <th className="text-left py-3 px-3 font-bold text-gray-700 dark:text-gray-300">Year</th>
                    <th className="text-left py-3 px-3 font-bold text-gray-700 dark:text-gray-300">File</th>
                    <th className="text-center py-3 px-3 font-bold text-gray-700 dark:text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.certificates.map(cert => (
                    <tr key={cert.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-3 px-3 text-gray-900 dark:text-gray-100">{cert.name}</td>
                      <td className="py-3 px-3 text-gray-700 dark:text-gray-400">{cert.issuer}</td>
                      <td className="py-3 px-3 text-gray-700 dark:text-gray-400">{cert.year}</td>
                      <td className="py-3 px-3">
                        {cert.fileName && (
                          <a href="#" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                            <FiFile className="w-4 h-4" />
                            <span className="text-sm truncate">{cert.fileName}</span>
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => removeCertificate(cert.id)}
                          className="inline-flex items-center gap-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Extra-Curricular Activities Section with File Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Extra-Curricular Activities</h2>
            <button
              onClick={() => setEditingSection(editingSection === 'activities' ? null : 'activities')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
            </button>
          </div>

          {editingSection === 'activities' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FiUpload className="w-5 h-5" />
                Add New Activity
              </h3>
              <input
                type="text"
                placeholder="Activity Title"
                value={newExtraCurricular.title}
                onChange={(e) => setNewExtraCurricular({ ...newExtraCurricular, title: e.target.value })}
                className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <textarea
                placeholder="Description of your involvement and achievement"
                value={newExtraCurricular.description}
                onChange={(e) => setNewExtraCurricular({ ...newExtraCurricular, description: e.target.value })}
                rows={3}
                className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="date"
                value={newExtraCurricular.date}
                onChange={(e) => setNewExtraCurricular({ ...newExtraCurricular, date: e.target.value })}
                className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <div className="relative mb-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={(e) => setNewExtraCurricular({ ...newExtraCurricular, file: e.target.files?.[0] || null })}
                  className="hidden"
                  id="activity-file"
                />
                <label
                  htmlFor="activity-file"
                  className="block w-full px-4 py-3 border-2 border-dashed border-yellow-400 dark:border-yellow-600 rounded-lg text-center cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2 text-yellow-700 dark:text-yellow-300">
                    <FiUpload className="w-5 h-5" />
                    <span>{newExtraCurricular.file?.name || 'Click to upload proof/certificate'}</span>
                  </div>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={addExtraCurricular}
                  className="flex-1 bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 font-medium flex items-center justify-center gap-2"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Activity
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  className="flex-1 border border-yellow-600 dark:border-yellow-400 text-yellow-600 dark:text-yellow-400 py-2 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {profile.extraCurricular.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 py-4">No activities added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-3 font-bold text-gray-700 dark:text-gray-300">Activity Title</th>
                    <th className="text-left py-3 px-3 font-bold text-gray-700 dark:text-gray-300">Description</th>
                    <th className="text-left py-3 px-3 font-bold text-gray-700 dark:text-gray-300">Date</th>
                    <th className="text-left py-3 px-3 font-bold text-gray-700 dark:text-gray-300">File</th>
                    <th className="text-center py-3 px-3 font-bold text-gray-700 dark:text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.extraCurricular.map(activity => (
                    <tr key={activity.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-3 px-3 text-gray-900 dark:text-gray-100 font-semibold">{activity.title}</td>
                      <td className="py-3 px-3 text-gray-700 dark:text-gray-400 line-clamp-2">{activity.description}</td>
                      <td className="py-3 px-3 text-gray-700 dark:text-gray-400">{activity.date}</td>
                      <td className="py-3 px-3">
                        {activity.fileName && (
                          <a href="#" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                            <FiFile className="w-4 h-4" />
                            <span className="text-xs truncate">{activity.fileName}</span>
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => removeExtraCurricular(activity.id)}
                          className="inline-flex items-center gap-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-6">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
              >
                {skill}
                <button className="hover:text-blue-900 dark:hover:text-blue-100">✕</button>
              </span>
            ))}
            <button className="border-2 border-dashed border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20">
              + Add Skill
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Job Preferences</h2>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2">
              <FiEdit2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preferred Job Type</p>
              <p className="font-semibold text-lg">{profile.preferences.jobType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preferred Locations</p>
              <div className="flex flex-wrap gap-2">
                {profile.preferences.location.map((loc, idx) => (
                  <span key={idx} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm">
                    {loc}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Expected Salary</p>
              <p className="font-semibold text-lg">₹{profile.preferences.salaryExpectation.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/teacher/browse-jobs"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 text-center font-semibold transition-colors"
          >
            Browse Jobs
          </Link>
          <button className="flex-1 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold transition-colors flex items-center justify-center gap-2">
            <FiDownload className="w-5 h-5" />
            Download CV
          </button>
        </div>
      </div>
    </RoleGuard>
  )
}
