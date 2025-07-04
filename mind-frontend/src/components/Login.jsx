"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "user",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", formData)
      const { token, user, userType } = response.data
      onLogin(user, token, userType)
    } catch (error) {
      setError(error.response?.data || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Welcome Back 👋</h2>
          <p className="text-sm text-gray-600">Sign in to your MindConnect account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
            <select 
              name="userType" 
              value={formData.userType} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="user">User</option>
              <option value="therapist">Therapist</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-200 text-sm">
          <p className="text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
