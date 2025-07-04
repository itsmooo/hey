"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const MotivationContent = () => {
  const [motivations, setMotivations] = useState([])
  const [filteredMotivations, setFilteredMotivations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchMotivations()
  }, [])

  useEffect(() => {
    filterMotivations()
  }, [motivations, filter, searchTerm])

  const fetchMotivations = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/motivations/active")
      setMotivations(response.data)
    } catch (error) {
      console.error("Error fetching motivations:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterMotivations = () => {
    let filtered = motivations

    if (filter !== "all") {
      filtered = filtered.filter((item) => item.type === filter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredMotivations(filtered)
  }

  const getTypeIcon = (type) => {
    const icons = {
      QUOTE: "💭",
      ARTICLE: "📖",
      TIP: "💡",
      EXERCISE: "🧘",
      VIDEO: "🎥",
      AUDIO: "🎧",
    }
    return icons[type] || "📝"
  }

  const getTypeColor = (type) => {
    const colors = {
      QUOTE: "#e3f2fd",
      ARTICLE: "#f3e5f5",
      TIP: "#fff3e0",
      EXERCISE: "#e8f5e8",
      VIDEO: "#fce4ec",
      AUDIO: "#f1f8e9",
    }
    return colors[type] || "#f5f5f5"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading motivational content...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Motivational Content</h1>
        <p className="text-lg text-gray-600">Discover inspiration, tips, and exercises to support your mental health journey</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5 mb-8 items-center">
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 border-2 border-gray-200 bg-white rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${filter === "all" ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-500" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 border-2 border-gray-200 bg-white rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${filter === "QUOTE" ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-500" : ""}`}
            onClick={() => setFilter("QUOTE")}
          >
            💭 Quotes
          </button>
          <button
            className={`px-4 py-2 border-2 border-gray-200 bg-white rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${filter === "TIP" ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-500" : ""}`}
            onClick={() => setFilter("TIP")}
          >
            💡 Tips
          </button>
          <button
            className={`px-4 py-2 border-2 border-gray-200 bg-white rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${filter === "EXERCISE" ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-500" : ""}`}
            onClick={() => setFilter("EXERCISE")}
          >
            🧘 Exercises
          </button>
          <button
            className={`px-4 py-2 border-2 border-gray-200 bg-white rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${filter === "ARTICLE" ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-500" : ""}`}
            onClick={() => setFilter("ARTICLE")}
          >
            📖 Articles
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredMotivations.length > 0 ? (
          filteredMotivations.map((item) => (
            <div
              key={item.id}
              className="rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: getTypeColor(item.type) }}
            >
              <div className="flex justify-between items-center px-5 pt-5 pb-0">
                <div className="flex items-center gap-2 bg-white/90 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                  <span className="text-base">{getTypeIcon(item.type)}</span>
                  <span>{item.type}</span>
                </div>
                {item.category && (
                  <span className="bg-white/90 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                )}
              </div>

              <div className="px-5 py-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{item.title}</h3>
                <div className="text-gray-700 leading-relaxed mb-4">
                  {item.content.length > 200 ? (
                    <>
                      {item.content.substring(0, 200)}...
                      <button className="text-indigo-600 bg-none border-none cursor-pointer font-medium underline ml-1">Read More</button>
                    </>
                  ) : (
                    item.content
                  )}
                </div>

                {item.author && (
                  <div className="italic text-gray-500 text-sm">
                    <cite>— {item.author}</cite>
                  </div>
                )}
              </div>

              <div className="px-5 pb-5">
                <div className="flex gap-3">
                  <button className="bg-none border border-gray-200 px-3 py-1 rounded-full text-xs cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:text-red-500 hover:border-red-500">
                    ❤️ Like
                  </button>
                  <button className="bg-none border border-gray-200 px-3 py-1 rounded-full text-xs cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:text-blue-500 hover:border-blue-500">
                    📤 Share
                  </button>
                  <button className="bg-none border border-gray-200 px-3 py-1 rounded-full text-xs cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:text-green-500 hover:border-green-500">
                    🔖 Save
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No content found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <div className="mt-10">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-10 text-center">
          <h2 className="text-2xl font-semibold mb-5">💪 Daily Motivation</h2>
          <p className="text-lg leading-relaxed mb-4">
            "The greatest revolution of our generation is the discovery that human beings, by changing the inner
            attitudes of their minds, can change the outer aspects of their lives."
          </p>
          <cite className="italic opacity-90">— William James</cite>
        </div>
      </div>
    </div>
  )
}

export default MotivationContent
