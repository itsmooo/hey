

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const UserDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalJournals: 0,
    upcomingSessions: 0,
    completedSessions: 0,
  })
  const [recentJournals, setRecentJournals] = useState([])
  const [upcomingSessions, setUpcomingSessions] = useState([])
  const [motivation, setMotivation] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }

      // Fetch journals
      const journalsResponse = await axios.get(`http://localhost:8080/api/journals/user/${user.id}`, { headers })
      setRecentJournals(journalsResponse.data.slice(0, 3))
      setStats((prev) => ({ ...prev, totalJournals: journalsResponse.data.length }))

      // Fetch sessions
      const sessionsResponse = await axios.get(`http://localhost:8080/api/sessions/user/${user.id}`, { headers })
      const sessions = sessionsResponse.data
      const upcoming = sessions.filter((s) => s.status === "SCHEDULED")
      const completed = sessions.filter((s) => s.status === "COMPLETED")

      setUpcomingSessions(upcoming.slice(0, 3))
      setStats((prev) => ({
        ...prev,
        upcomingSessions: upcoming.length,
        completedSessions: completed.length,
      }))

      // Fetch motivation
      const motivationResponse = await axios.get("http://localhost:8080/api/motivations/active")
      if (motivationResponse.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * motivationResponse.data.length)
        setMotivation(motivationResponse.data[randomIndex])
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
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
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, {user.firstName}!</h1>
        <p className="text-lg text-gray-600">Here's your mental health journey overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div className="text-4xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            📝
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.totalJournals}</h3>
            <p className="text-sm text-gray-600">Journal Entries</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div className="text-4xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            📅
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.upcomingSessions}</h3>
            <p className="text-sm text-gray-600">Upcoming Sessions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div className="text-4xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            ✅
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.completedSessions}</h3>
            <p className="text-sm text-gray-600">Completed Sessions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800">Recent Journal Entries</h2>
            <Link to="/journals" className="text-indigo-600 text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {recentJournals.length > 0 ? (
              recentJournals.map((journal) => (
                <div key={journal.id} className="flex gap-3 p-4 border border-gray-200 rounded-lg transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                    {getMoodEmoji(journal.mood)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-800 mb-1">{journal.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{journal.content.substring(0, 100)}...</p>
                    <span className="text-xs text-gray-400">{new Date(journal.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No journal entries yet</p>
                <Link to="/journal/new" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium">
                  Write Your First Entry
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Sessions</h2>
            <Link to="/sessions" className="text-indigo-600 text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <div key={session.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center w-15 h-15 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg text-center">
                    <div className="text-lg font-bold leading-none">
                      {new Date(session.sessionDate).getDate()}
                    </div>
                    <div className="text-xs uppercase tracking-wider">
                      {new Date(session.sessionDate).toLocaleDateString("en", { month: "short" })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-800 mb-1">
                      Dr. {session.therapist?.firstName} {session.therapist?.lastName}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">{session.therapist?.specialization}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(session.sessionDate).toLocaleTimeString("en", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No upcoming sessions</p>
                <Link to="/book-session" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium">
                  Book a Session
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {motivation && (
        <div className="mb-10">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-8 text-center">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold">Daily Motivation</h3>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                {motivation.type}
              </span>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">{motivation.title}</h4>
              <p className="text-base leading-relaxed mb-4">{motivation.content}</p>
              {motivation.author && <cite className="italic opacity-90">— {motivation.author}</cite>}
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link to="/journal/new" className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50 hover:-translate-y-1">
            <span className="text-3xl">✍️</span>
            Write Journal Entry
          </Link>
          <Link to="/book-session" className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50 hover:-translate-y-1">
            <span className="text-3xl">📅</span>
            Book Session
          </Link>
          <Link to="/therapists" className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50 hover:-translate-y-1">
            <span className="text-3xl">👨‍⚕️</span>
            Find Therapist
          </Link>
          <Link to="/motivation" className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50 hover:-translate-y-1">
            <span className="text-3xl">💪</span>
            Get Motivated
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
