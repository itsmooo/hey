"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const SessionBooking = ({ user }) => {
  const [therapists, setTherapists] = useState([])
  const [selectedTherapist, setSelectedTherapist] = useState(null)
  const [formData, setFormData] = useState({
    sessionDate: "",
    sessionType: "online",
    duration: 60,
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    fetchTherapists()
  }, [])

  const fetchTherapists = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/therapists/available")
      setTherapists(response.data)
    } catch (error) {
      console.error("Error fetching therapists:", error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedTherapist) {
      setError("Please select a therapist")
      return
    }

    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const sessionData = {
        ...formData,
        user: { id: user.id },
        therapist: { id: selectedTherapist.id },
        sessionDate: new Date(formData.sessionDate).toISOString(),
      }

      await axios.post("http://localhost:8080/api/sessions", sessionData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      navigate("/sessions")
    } catch (error) {
      console.error("Error booking session:", error)
      setError("Failed to book session")
    } finally {
      setLoading(false)
    }
  }

  const getMinDateTime = () => {
    const now = new Date()
    now.setHours(now.getHours() + 1) // Minimum 1 hour from now
    return now.toISOString().slice(0, 16)
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Book a Therapy Session</h1>
        <p className="text-lg text-gray-600">Choose a therapist and schedule your session</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select a Therapist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {therapists.map((therapist) => (
              <div
                key={therapist.id}
                className={`bg-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-indigo-500 hover:-translate-y-0.5 hover:shadow-lg ${
                  selectedTherapist?.id === therapist.id ? "border-indigo-500 bg-gray-50" : "border-gray-200"
                }`}
                onClick={() => setSelectedTherapist(therapist)}
              >
                <div className="w-15 h-15 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-lg mb-4">
                  Dr. {therapist.firstName.charAt(0)}
                  {therapist.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Dr. {therapist.firstName} {therapist.lastName}
                  </h3>
                  <p className="text-indigo-600 font-medium mb-1">{therapist.specialization}</p>
                  <p className="text-gray-600 text-sm mb-1">{therapist.qualification}</p>
                  <p className="text-gray-600 text-sm mb-2">{therapist.experience} years experience</p>
                  <div className="text-yellow-500 font-medium">⭐ {therapist.rating}/5.0</div>
                </div>
                {therapist.bio && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-gray-600 text-sm leading-relaxed">{therapist.bio}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedTherapist && (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Session Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Date & Time</label>
                <input
                  type="datetime-local"
                  name="sessionDate"
                  value={formData.sessionDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min={getMinDateTime()}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                <select
                  name="sessionType"
                  value={formData.sessionType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="online">Online Session</option>
                  <option value="in-person">In-Person Session</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <select 
                  name="duration" 
                  value={formData.duration} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="4"
                  placeholder="Any specific topics you'd like to discuss or concerns you have..."
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 my-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Therapist:</span>
                    <span className="text-gray-600">
                      Dr. {selectedTherapist.firstName} {selectedTherapist.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Specialization:</span>
                    <span className="text-gray-600">{selectedTherapist.specialization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Date & Time:</span>
                    <span className="text-gray-600">
                      {formData.sessionDate ? new Date(formData.sessionDate).toLocaleString() : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="text-gray-600">{formData.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="text-gray-600">{formData.sessionType}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => navigate("/dashboard")} 
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Booking..." : "Book Session"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionBooking
