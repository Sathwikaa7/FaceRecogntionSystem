import React from 'react'
import Webcam from 'react-webcam'

const Dashboard = ({ 
  stats, 
  cameraStarted, 
  setCameraStarted, 
  webcamRef, 
  setWebcamRef, 
  capturedImage, 
  captureImage, 
  recognizeFace, 
  isRecognizing, 
  recognitionResult 
}) => {
  return (
    <main className="flex-1 p-8" style={{ background: 'var(--background)' }}>
      {/* Quick Intro Section */}
      <div className="mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <span className="text-white text-2xl">🚀</span>
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Welcome to FaceID System</h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Your intelligent face recognition dashboard</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3 p-4 rounded-lg" style={{ background: 'rgba(198, 93, 123, 0.05)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(198, 93, 123, 0.1)' }}>
                <span className="text-lg">📸</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>1. Register Faces</h4>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Add people to the system using camera or upload photos</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg" style={{ background: 'rgba(72, 187, 120, 0.05)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(72, 187, 120, 0.1)' }}>
                <span className="text-lg">🔍</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>2. Live Recognition</h4>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Use the live camera to identify registered faces</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg" style={{ background: 'rgba(159, 122, 234, 0.05)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(159, 122, 234, 0.1)' }}>
                <span className="text-lg">📊</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>3. Track History</h4>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Monitor recognition activities and manage data</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  {stats.registered_faces === 0 ? 'Ready to get started?' : 'System is active and ready!'}
                </p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {stats.registered_faces === 0 
                    ? 'Register your first face to begin using the recognition system' 
                    : `${stats.registered_faces} faces registered • ${stats.recognitions} recognitions completed`
                  }
                </p>
              </div>
              <div className="flex space-x-3">
                <button 
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:transform hover:scale-105"
                  style={{ 
                    background: 'var(--gradient-primary)', 
                    color: 'white',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {stats.registered_faces === 0 ? 'Register First Face' : 'Add New Face'}
                </button>
                {stats.registered_faces > 0 && (
                  <button 
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gray-50"
                    style={{ 
                      color: 'var(--text)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    View All Faces
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(198, 93, 123, 0.1)' }}>
              <svg className="w-6 h-6" style={{ color: '#C65D7B' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
            <div className="w-2 h-2 rounded-full" style={{ background: '#C65D7B' }}></div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>Registered Faces</h3>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{stats.registered_faces}</div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Total people</p>
          </div>
        </div>

        <div className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(72, 187, 120, 0.1)' }}>
              <svg className="w-6 h-6" style={{ color: '#48BB78' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
              </svg>
            </div>
            <div className="w-2 h-2 rounded-full" style={{ background: '#48BB78' }}></div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>Total Recognitions</h3>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{stats.recognitions}</div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>All time</p>
          </div>
        </div>

        <div className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(246, 173, 85, 0.1)' }}>
              <svg className="w-6 h-6" style={{ color: '#F6AD55' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
            </div>
            <div className="w-2 h-2 rounded-full" style={{ background: '#F6AD55' }}></div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>Accuracy</h3>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>95%</div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Recognition rate</p>
          </div>
        </div>

        <div className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(159, 122, 234, 0.1)' }}>
              <svg className="w-6 h-6" style={{ color: '#9F7AEA' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
              </svg>
            </div>
            <div className="w-2 h-2 rounded-full" style={{ background: '#9F7AEA' }}></div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>Last Recognition</h3>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>N/A</div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>No data yet</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Live Camera Section */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(198, 93, 123, 0.1)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Live Camera</h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Camera feed will appear here</p>
              </div>
            </div>
            {cameraStarted && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700">Live</span>
              </div>
            )}
          </div>

          <div className="relative mb-6 rounded-2xl overflow-hidden" style={{ background: 'var(--background)', aspectRatio: '16/9' }}>
            {cameraStarted ? (
              <Webcam
                ref={setWebcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl border-2 border-dashed flex items-center justify-center" 
                    style={{ borderColor: 'var(--primary)', background: 'rgba(198, 93, 123, 0.05)' }}>
                    <svg className="w-10 h-10" style={{ color: 'var(--primary)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>Click 'Start Camera' to begin</h4>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Make sure your camera is connected</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setCameraStarted(!cameraStarted)}
            className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:transform hover:scale-105"
            style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-md)' }}
          >
            <div className="flex items-center justify-center space-x-2">
              {cameraStarted ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v6a1 1 0 11-2 0V7zM12 7a1 1 0 012 0v6a1 1 0 11-2 0V7z"/>
                  </svg>
                  <span>Stop Camera</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
                  </svg>
                  <span>Start Camera</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Recognition Section */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(72, 187, 120, 0.1)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--success)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Recognition</h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Recognize faces in real-time</p>
              </div>
            </div>
            {recognitionResult && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                <span className="text-xs font-medium text-green-700">Recognized</span>
              </div>
            )}
          </div>

          <div className="relative mb-6 rounded-2xl overflow-hidden" style={{ background: 'var(--background)', aspectRatio: '16/9' }}>
            {capturedImage ? (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl border-2 border-dashed flex items-center justify-center" 
                    style={{ borderColor: 'var(--muted)', background: 'rgba(107, 114, 128, 0.05)' }}>
                    <svg className="w-10 h-10" style={{ color: 'var(--muted)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>No face detected</h4>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Start the camera to begin recognition</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (cameraStarted && !capturedImage) {
                captureImage()
              } else if (capturedImage) {
                recognizeFace()
              }
            }}
            disabled={!cameraStarted || isRecognizing}
            className="w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ 
              background: !cameraStarted || isRecognizing ? 'var(--muted)' : 'var(--gradient-secondary)', 
              color: 'white',
              boxShadow: 'var(--shadow-md)' 
            }}
          >
            <div className="flex items-center justify-center space-x-2">
              {isRecognizing ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"/>
                  </svg>
                  <span>Recognizing...</span>
                </>
              ) : !capturedImage ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                  </svg>
                  <span>Capture & Recognize</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
                  </svg>
                  <span>Recognize Face</span>
                </>
              )}
            </div>
          </button>

          {recognitionResult && (
            <div className="mt-4 p-4 rounded-xl border" style={{ 
              background: 'rgba(72, 187, 120, 0.05)', 
              borderColor: 'var(--success)' 
            }}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--success)' }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold" style={{ color: 'var(--success)' }}>Recognition Successful!</h4>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    <span className="font-medium" style={{ color: 'var(--text)' }}>{recognitionResult.name}</span>
                    {' '} - {recognitionResult.similarity}% confidence
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Dashboard