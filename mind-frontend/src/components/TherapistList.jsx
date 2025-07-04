"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const TherapistList = () => {
  const [therapists, setTherapists] = useState([])
  const [filteredTherapists, setFilteredTherapists] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [specializationFilter, setSpecializationFilter] = useState("all")

  useEffect(() => {
    fetchTherapists()
  }, [])

  useEffect(() => {
    filterTherapists()
  }, [therapists, searchTerm, specializationFilter])

  const fetchTherapists = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/therapists/available")
      setTherapists(response.data)
    } catch (error) {
      console.error("Error fetching therapists:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterTherapists = () => {
    let filtered = therapists

    if (searchTerm) {
      filtered = filtered.filter(
        (therapist) =>
          `${therapist.firstName} ${therapist.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          therapist.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (specializationFilter !== "all") {
      filtered = filtered.filter((therapist) =>
        therapist.specialization.toLowerCase().includes(specializationFilter.toLowerCase()),
      )
    }

    setFilteredTherapists(filtered)
  }

  const getSpecializations = () => {
    const specializations = [...new Set(therapists.map((t) => t.specialization))]
    return specializations
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading therapists...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Therapist</h1>
        <p className="text-lg text-gray-600">Connect with qualified mental health professionals</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5 mb-8 items-center">
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="min-w-48">
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Specializations</option>
            {getSpecializations().map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredTherapists.length > 0 ? (
          filteredTherapists.map((therapist) => (
            <div key={therapist.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex justify-between items-center p-6 pb-0">
                <div className="w-15 h-15 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-lg">
                  Dr. {therapist.firstName.charAt(0)}
                  {therapist.lastName.charAt(0)}
                </div>
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Available
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Dr. {therapist.firstName} {therapist.lastName}
                </h3>
                <p className="text-indigo-600 font-medium text-base mb-1">{therapist.specialization}</p>
                <p className="text-gray-600 text-sm mb-4">{therapist.qualification}</p>

                <div className="flex gap-6 mb-4">
                  <div className="text-center">
                    <span className="block text-lg font-semibold text-gray-800">{therapist.experience}</span>
                    <span className="text-xs text-gray-600">Years Experience</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-semibold text-gray-800">⭐ {therapist.rating}</span>
                    <span className="text-xs text-gray-600">Rating</span>
                  </div>
                </div>

                {therapist.bio && (
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {therapist.bio.length > 150 ? `${therapist.bio.substring(0, 150)}...` : therapist.bio}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2 mb-5">
                  {therapist.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-base">📞</span>
                      <span>{therapist.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-base">✉️</span>
                    <span>{therapist.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 px-6 pb-6">
                <Link 
                  to="/book-session" 
                  state={{ selectedTherapist: therapist }} 
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-center font-medium"
                >
                  Book Session
                </Link>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
                  View Profile
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-4">👨‍⚕️</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No therapists found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <div className="mt-10">
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Need Help Choosing?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Not sure which therapist is right for you? Consider these factors:
          </p>
          <ul className="list-none pl-0 mb-4">
            <li className="relative pl-6 mb-2 text-gray-700 before:content-['✓'] before:absolute before:left-0 before:text-green-600 before:font-semibold">
              Specialization that matches your needs
            </li>
            <li className="relative pl-6 mb-2 text-gray-700 before:content-['✓'] before:absolute before:left-0 before:text-green-600 before:font-semibold">
              Years of experience
            </li>
            <li className="relative pl-6 mb-2 text-gray-700 before:content-['✓'] before:absolute before:left-0 before:text-green-600 before:font-semibold">
              Communication style and approach
            </li>
            <li className="relative pl-6 mb-2 text-gray-700 before:content-['✓'] before:absolute before:left-0 before:text-green-600 before:font-semibold">
              Availability that fits your schedule
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Remember, finding the right therapist is a personal journey. Don't hesitate to book consultations with
            multiple therapists to find the best fit.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TherapistList
