"use client"

import { useState } from "react"
import axios from "axios"

const Profile = ({ user, userType }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    age: user?.age || "",
    emergencyContact: user?.emergencyContact || "",
    // Therapist specific fields
    specialization: user?.specialization || "",
    qualification: user?.qualification || "",
    experience: user?.experience || "",
    bio: user?.bio || "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const token = localStorage.getItem("token")
      const endpoint =
        userType === "therapist"
          ? `http://localhost:8080/api/therapists/${user.id}`
          : `http://localhost:8080/api/users/${user.id}`

      await axios.put(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setMessage("Profile updated successfully!")

      // Update local storage
      const updatedUser = { ...user, ...formData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-white p-8 rounded-xl shadow-sm">
        <div className="w-24 h-24 md:w-25 h-25 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-3xl">
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {userType === "therapist" ? "Dr." : ""} {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-lg text-gray-600 mb-2">{userType === "therapist" ? user?.specialization : user?.role?.name}</p>
          {userType === "therapist" && (
            <div className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-medium">
              ⭐ {user?.rating}/5.0 • {user?.experience} years experience
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                disabled
              />
              <small className="text-sm text-gray-500 mt-1">Email cannot be changed</small>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              {userType !== "therapist" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="18"
                  />
                </div>
              )}
            </div>

            {userType !== "therapist" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Name and phone number"
                />
              </div>
            )}

            {userType === "therapist" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="4"
                    placeholder="Tell clients about yourself, your approach, and your experience..."
                  />
                </div>
              </>
            )}

            <div className="pt-4">
              <button 
                type="submit" 
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm h-fit">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Statistics</h2>
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                📅
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">Member Since</h3>
                <p className="text-sm text-gray-600">{new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {userType !== "therapist" && (
              <>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    📝
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-1">Journal Entries</h3>
                    <p className="text-sm text-gray-600">Track your thoughts</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-1">Sessions Completed</h3>
                    <p className="text-sm text-gray-600">Your progress</p>
                  </div>
                </div>
              </>
            )}

            {userType === "therapist" && (
              <>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    👥
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-1">Clients Helped</h3>
                    <p className="text-sm text-gray-600">Making a difference</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    ⭐
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-1">Rating</h3>
                    <p className="text-sm text-gray-600">{user?.rating}/5.0</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
