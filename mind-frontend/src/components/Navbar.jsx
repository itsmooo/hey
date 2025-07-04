"use client"
import { Link, useNavigate } from "react-router-dom"

const Navbar = ({ user, userType, onLogout }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

  const navLinkStyle =
    "text-white font-medium text-sm md:text-base px-3 py-2 md:px-4 md:py-2 rounded-md transition duration-200 hover:bg-white/10 hover:scale-[1.02]"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-18 flex items-center justify-between">
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 text-white text-xl md:text-2xl font-bold"
        >
          <span className="text-3xl">🧠</span> MindConnect
        </Link>

        {!user ? (
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/login" className={navLinkStyle}>
              Login
            </Link>
            <Link to="/register" className={navLinkStyle}>
              Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/dashboard" className={navLinkStyle}>Dashboard</Link>

            {userType !== "therapist" && user?.role?.name !== "ADMIN" && (
              <>
                <Link to="/journals" className={navLinkStyle}>Journals</Link>
                <Link to="/sessions" className={navLinkStyle}>Sessions</Link>
                <Link to="/book-session" className={navLinkStyle}>Book Session</Link>
                <Link to="/therapists" className={navLinkStyle}>Therapists</Link>
              </>
            )}

            {userType === "therapist" && (
              <Link to="/sessions" className={navLinkStyle}>My Sessions</Link>
            )}

            <Link to="/motivation" className={navLinkStyle}>Motivation</Link>
            <Link to="/profile" className={navLinkStyle}>Profile</Link>

            <div className="flex items-center gap-3 md:gap-4 pl-3 md:pl-5 border-l border-white/20">
              <span className="text-white font-medium hidden md:block">
                {user.firstName} {user.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white/10 text-white border border-white/20 px-3 py-2 md:px-4 md:py-2 rounded-md transition duration-200 hover:bg-white/20 hover:scale-[1.03]"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
