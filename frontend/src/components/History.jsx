import React from 'react'

const History = ({ history, clearHistory, exportHistory }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <main className="flex-1 p-8" style={{ background: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(72, 187, 120, 0.1)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--success)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Recognition History</h2>
                <p style={{ color: 'var(--muted)' }}>View detailed recognition history and analytics</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={exportHistory}
                className="px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105"
                style={{ 
                  background: 'rgba(159, 122, 234, 0.1)', 
                  color: 'var(--secondary)',
                  border: '1px solid rgba(159, 122, 234, 0.2)'
                }}
              >
                Export CSV
              </button>
              
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105"
                  style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    color: 'var(--danger)',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}
                >
                  Clear History
                </button>
              )}
            </div>
          </div>
        </div>

        {/* History Content */}
        <div className="glass-card">
          {history.length > 0 ? (
            <div>
              <div className="p-6 border-b" style={{ borderColor: 'rgba(0, 0, 0, 0.05)' }}>
                <h3 className="font-semibold" style={{ color: 'var(--text)' }}>
                  {history.length} Recognition{history.length !== 1 ? 's' : ''} Found
                </h3>
              </div>
              
              <div className="divide-y" style={{ borderColor: 'rgba(0, 0, 0, 0.05)' }}>
                {history.map((item, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50/50 transition-colors duration-300">
                    <div className="flex items-start space-x-4">
                      {/* Timeline dot */}
                      <div className="relative">
                        <div className="w-3 h-3 rounded-full mt-2" style={{ background: 'var(--success)' }}></div>
                        {index < history.length - 1 && (
                          <div className="absolute top-5 left-1/2 w-px h-12 -translate-x-px" 
                            style={{ background: 'rgba(72, 187, 120, 0.2)' }}></div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                              style={{ background: 'var(--gradient-primary)' }}>
                              <span className="text-white font-semibold text-sm">
                                {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold" style={{ color: 'var(--text)' }}>
                                {item.name || 'Unknown Person'}
                              </h4>
                              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                                Recognition attempt
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                              {item.similarity ?? item.confidence ?? 'N/A'}% confidence
                            </div>
                            <div className="text-xs" style={{ color: 'var(--muted)' }}>
                              {formatDate(item.time || item.timestamp)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full" 
                              style={{ background: (item.success ?? true) ? 'var(--success)' : 'var(--danger)' }}></div>
                            <span className="text-sm font-medium" 
                              style={{ color: (item.success ?? true) ? 'var(--success)' : 'var(--danger)' }}>
                              {(item.success ?? true) ? 'Successful' : 'Failed'}
                            </span>
                          </div>
                          
                          <div className="text-xs" style={{ color: 'var(--muted)' }}>
                            Processing time: {item.processingTime || '0.5'}s
                          </div>
                        </div>
                        
                        {item.notes && (
                          <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(107, 114, 128, 0.05)' }}>
                            <p className="text-sm" style={{ color: 'var(--muted)' }}>{item.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Load More */}
              <div className="p-6 border-t text-center" style={{ borderColor: 'rgba(0, 0, 0, 0.05)' }}>
                <button 
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-gray-50"
                  style={{ color: 'var(--muted)' }}
                >
                  Load More History
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center" 
                style={{ background: 'rgba(107, 114, 128, 0.1)' }}>
                <svg className="w-10 h-10" style={{ color: 'var(--muted)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
                No recognition history yet
              </h3>
              <p className="mb-6" style={{ color: 'var(--muted)' }}>
                Recognition activities will appear here once you start using the face recognition feature.
              </p>
              <button 
                className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:transform hover:scale-105"
                style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-sm)' }}
              >
                Start Recognition
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default History
