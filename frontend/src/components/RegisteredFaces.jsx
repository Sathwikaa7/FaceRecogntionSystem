import React, { useState } from 'react'

const RegisteredFaces = ({ registeredFaces, deleteFace, loadRegisteredFaces, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)

  const filteredFaces = registeredFaces.filter(face =>
    face.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewImage = (faceName) => {
    // Open the face image in a modal
    setSelectedImage(`http://127.0.0.1:5000/uploads/${faceName}.jpg`)
  }

  const handleDeleteClick = (faceName) => {
    setDeleteConfirmation(faceName)
  }

  const confirmDelete = async () => {
    if (deleteConfirmation) {
      await deleteFace(deleteConfirmation)
      setDeleteConfirmation(null)
      loadRegisteredFaces()
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmation(null)
  }

  return (
    <main className="flex-1 p-8" style={{ background: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(159, 122, 234, 0.1)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--secondary)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Registered Faces</h2>
                <p style={{ color: 'var(--muted)' }}>Manage all registered faces in your system</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{registeredFaces.length}</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>Total Faces</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="glass-card p-6 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5" style={{ color: 'var(--muted)' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search registered faces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                borderColor: 'rgba(0, 0, 0, 0.1)',
                background: 'var(--card)',
                color: 'var(--text)',
                focusRingColor: 'var(--primary)'
              }}
            />
          </div>
        </div>

        {/* Faces List */}
        <div className="glass-card">
          {filteredFaces.length > 0 ? (
            <div>
              <div className="p-6 border-b" style={{ borderColor: 'rgba(0, 0, 0, 0.05)' }}>
                <h3 className="font-semibold" style={{ color: 'var(--text)' }}>
                  {filteredFaces.length} {filteredFaces.length === 1 ? 'Person' : 'People'} Found
                </h3>
              </div>

              <div className="divide-y" style={{ borderColor: 'rgba(0, 0, 0, 0.05)' }}>
                {filteredFaces.map((face, index) => (
                  <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${['#C65D7B', '#48BB78', '#F6AD55', '#9F7AEA'][index % 4]} 0%, ${['#E91E63', '#38A169', '#ED8936', '#805AD5'][index % 4]} 100%)` }}>
                          <span className="text-white font-semibold text-lg">
                            {face.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg" style={{ color: 'var(--text)' }}>{face}</h4>
                        <p className="text-sm" style={{ color: 'var(--muted)' }}>
                          Registered just now • ID: {String(index + 1).padStart(3, '0')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleViewImage(face)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                        title="View Image"
                      >
                        <svg className="w-5 h-5" style={{ color: 'var(--muted)' }} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"/>
                        </svg>
                      </button>

                      <button 
                        onClick={() => handleDeleteClick(face)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors duration-300 group"
                        title="Delete Face"
                      >
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3l1.586-1.586a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 9V6a1 1 0 011-1z"/>
                          <path d="M3 5a2 2 0 012-2h1a1 1 0 000 2H5v11a2 2 0 002 2h6a2 2 0 002-2V5h-1a1 1 0 100-2h1a2 2 0 012 2v11a4 4 0 01-4 4H7a4 4 0 01-4-4V5z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(107, 114, 128, 0.1)' }}>
                <svg className="w-10 h-10" style={{ color: 'var(--muted)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
                {searchQuery ? 'No faces found' : 'No registered faces yet'}
              </h3>
              <p className="mb-6" style={{ color: 'var(--muted)' }}>
                {searchQuery
                  ? `No faces match "${searchQuery}". Try a different search term.`
                  : 'Get started by registering your first face in the system.'
                }
              </p>
              {!searchQuery && (
                <button 
                  onClick={() => setActiveTab('register')}
                  className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:transform hover:scale-105"
                  style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-sm)' }}
                >
                  Register First Face
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image View Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-2xl max-h-screen p-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
              </svg>
            </button>
            <img 
              src={selectedImage} 
              alt="Face preview" 
              className="max-w-full max-h-full rounded-xl shadow-2xl"
              style={{ maxHeight: 'calc(100vh - 8rem)' }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-card p-8 mx-4 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--danger)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/>
                </svg>
              </div>
              
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Confirm Deletion</h3>
              
              <p className="mb-6" style={{ color: 'var(--muted)' }}>
                Are you sure you want to delete <span className="font-semibold" style={{ color: 'var(--text)' }}>"{deleteConfirmation}"</span>? This action cannot be undone.
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:transform hover:scale-105"
                  style={{ 
                    background: 'var(--card)', 
                    border: '1px solid var(--border)',
                    color: 'var(--muted)' 
                  }}
                >
                  Cancel
                </button>
                
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 hover:transform hover:scale-105"
                  style={{ background: 'var(--danger)', boxShadow: 'var(--shadow-sm)' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default RegisteredFaces