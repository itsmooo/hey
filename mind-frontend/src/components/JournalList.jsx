"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const JournalList = ({ user }) => {
  const [journals, setJournals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    if (user && user.id) {
      fetchJournals()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchJournals = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No token found")
        return
      }
      const response = await axios.get(`http://localhost:8080/api/journals/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setJournals(response.data)
    } catch (error) {
      console.error("Error fetching journals:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteJournal = async (id) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`http://localhost:8080/api/journals/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        fetchJournals()
      } catch (error) {
        console.error("Error deleting journal:", error)
      }
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

  const filteredJournals = journals.filter((journal) => {
    if (filter === "all") return true
    return journal.mood === filter
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading journals...</div>
      </div>
    )
  }

  if (!user || !user.id) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Please log in to view your journals</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-5">
        <h1 className="text-4xl font-bold text-gray-800">My Journal Entries</h1>
        <Link 
          to="/journal/new" 
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 inline-block text-center"
        >
          New Entry
        </Link>
      </div>

      <div className="mb-8">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Moods</option>
          <option value="VERY_HAPPY">Very Happy</option>
          <option value="HAPPY">Happy</option>
          <option value="NEUTRAL">Neutral</option>
          <option value="SAD">Sad</option>
          <option value="VERY_SAD">Very Sad</option>
          <option value="ANXIOUS">Anxious</option>
          <option value="STRESSED">Stressed</option>
          <option value="CALM">Calm</option>
          <option value="EXCITED">Excited</option>
          <option value="ANGRY">Angry</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJournals.length > 0 ? (
          filteredJournals.map((journal) => (
            <div key={journal.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex justify-between items-center p-5 pb-0">
                <div className="text-3xl w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
                  {getMoodEmoji(journal.mood)}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {new Date(journal.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{journal.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {journal.content.substring(0, 150)}...
                </p>
                {journal.tags && (
                  <div className="flex flex-wrap gap-2">
                    {journal.tags.split(",").map((tag, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-5 pt-0">
                <Link 
                  to={`/journal/edit/${journal.id}`} 
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => deleteJournal(journal.id)} 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No journal entries found</h3>
            <p className="text-gray-600 mb-6">Start your mental health journey by writing your first entry</p>
            <Link 
              to="/journal/new" 
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 inline-block"
            >
              Write First Entry
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default JournalList
