import React from 'react'

const Header = ({ activeTab }) => {
  const getTabInfo = (tab) => {
    const tabInfo = {
      dashboard: {
        title: 'Dashboard',
        description: "Welcome back! Here's what's happening with your system."
      },
      register: {
        title: 'Register Face',
        description: 'Add new faces to the recognition system.'
      },
      faces: {
        title: 'Registered Faces',
        description: 'Manage all registered faces in your system.'
      },
      history: {
        title: 'Recognition History',
        description: 'View detailed recognition history and analytics.'
      }
    }
    return tabInfo[tab] || { title: 'Dashboard', description: 'Welcome back!' }
  }

  const { title, description } = getTabInfo(activeTab)

  return (
    <header className="px-8 py-6" style={{ 
      background: 'var(--card)', 
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)', lineHeight: '1.2' }}>
            {title}
          </h1>
          <p className="text-base" style={{ color: 'var(--muted)' }}>
            {description}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Live Camera Button */}
          <button className="flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:transform hover:scale-105 hover:shadow-md" 
            style={{ 
              background: 'var(--gradient-primary)',
              color: 'white',
              boxShadow: 'var(--shadow-sm)'
            }}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            <span>Live Camera</span>
          </button>

          {/* Theme Toggle Button */}
          <button className="p-3 rounded-xl transition-all duration-300 hover:bg-gray-50 hover:transform hover:scale-110" 
            style={{ color: 'var(--muted)' }}>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header