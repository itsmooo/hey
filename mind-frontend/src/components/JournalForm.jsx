"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const JournalForm = ({ user }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "NEUTRAL",
    tags: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  useEffect(() => {
    if (isEditing) {
      fetchJournal()
    }
  }, [id])

  const fetchJournal = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`http://localhost:8080/api/journals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const journal = response.data
      setFormData({
        title: journal.title,
        content: journal.content,
        mood: journal.mood,
        tags: journal.tags || "",
      })
    } catch (error) {
      console.error("Error fetching journal:", error)
      setError("Failed to load journal entry")
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
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const journalData = {
        ...formData,
        user: { id: user.id },
      }

      if (isEditing) {
        await axios.put(`http://localhost:8080/api/journals/${id}`, journalData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await axios.post("http://localhost:8080/api/journals", journalData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }

      navigate("/journals")
    } catch (error) {
      console.error("Error saving journal:", error)
      setError("Failed to save journal entry")
    } finally {
      setLoading(false)
    }
  }

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      VERY_HAPPY: "😄",
      HAPPY: "😊",
      NEUTRAL: "😐",
      SAD: "😢",
      VERY_SAD: "😭",
      ANXIOUS: "😰",
      STRESSED: "😫",
      CALM: "😌",
      EXCITED: "🤩",
      ANGRY: "😠",
    }
    return moodEmojis[mood] || "😐"
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {isEditing ? "Edit Journal Entry" : "New Journal Entry"}
        </h1>
        <p className="text-lg text-gray-600">Express your thoughts and track your emotional well-being</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-10 shadow-sm">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Give your entry a title..."
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How are you feeling? {getMoodEmoji(formData.mood)}
          </label>
          <select 
            name="mood" 
            value={formData.mood} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="VERY_HAPPY">😄 Very Happy</option>
            <option value="HAPPY">😊 Happy</option>
            <option value="EXCITED">🤩 Excited</option>
            <option value="CALM">😌 Calm</option>
            <option value="NEUTRAL">😐 Neutral</option>
            <option value="ANXIOUS">😰 Anxious</option>
            <option value="STRESSED">😫 Stressed</option>
            <option value="SAD">😢 Sad</option>
            <option value="VERY_SAD">😭 Very Sad</option>
            <option value="ANGRY">😠 Angry</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Thoughts</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-48 resize-y font-inherit"
            placeholder="Write about your day, feelings, thoughts, or anything on your mind..."
            rows="10"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="work, family, anxiety, gratitude (separate with commas)"
          />
        </div>

        <div className="flex gap-4 justify-end mt-8">
          <button 
            type="button" 
            onClick={() => navigate("/journals")} 
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Saving..." : isEditing ? "Update Entry" : "Save Entry"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default JournalForm
