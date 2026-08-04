import React from 'react'

const Sidebar = ({ activeTab, setActiveTab, darkMode, setDarkMode }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' },
    { id: 'register', label: 'Register Face', icon: 'M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z' },
    { id: 'faces', label: 'Registered Faces', icon: 'M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' },
    { id: 'history', label: 'History', icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' }
  ]

  return (
    <div className="w-64 shadow-lg flex flex-col min-h-screen" style={{ background: 'var(--card)', boxShadow: 'var(--shadow-lg)', borderRight: '1px solid var(--border)' }}>
      {/* Logo Section */}
      <div className="p-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>FaceID</h1>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Face Recognition</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                activeTab === item.id
                  ? 'text-white shadow-md transform scale-105'
                  : 'hover:transform hover:scale-102'
              }`}
              style={activeTab === item.id ? { 
                background: 'var(--gradient-primary)',
                boxShadow: 'var(--shadow-md)',
                color: 'white'
              } : {
                color: 'var(--muted)'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) {
                  e.target.style.backgroundColor = 'var(--background)'
                  e.target.style.color = 'var(--text)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = 'var(--muted)'
                }
              }}
            >
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Dark Mode Toggle */}
      <div className="px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Dark Mode</span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
              darkMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div 
          className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 cursor-pointer"
          style={{ ':hover': { background: 'var(--background)' } }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--background)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ background: 'var(--gradient-primary)' }}>
            <span className="text-white font-semibold text-sm">A</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Admin</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar