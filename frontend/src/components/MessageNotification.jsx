import React from 'react'

const MessageNotification = ({ message, messageType }) => {
  if (!message) return null

  return (
    <div className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-lg backdrop-blur-lg transition-all duration-300 transform scale-in ${
      messageType === 'success' 
        ? 'bg-green-500/90 text-white border border-green-400/20' 
        : 'bg-red-500/90 text-white border border-red-400/20'
    }`} 
    style={{ 
      boxShadow: 'var(--shadow-lg)',
      backdropFilter: 'blur(12px)'
    }}>
      <div className="flex items-center space-x-3">
        {messageType === 'success' ? (
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
            </svg>
          </div>
        ) : (
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
            </svg>
          </div>
        )}
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  )
}

export default MessageNotification