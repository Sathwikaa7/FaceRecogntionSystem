import React from 'react'
import Webcam from 'react-webcam'

const RegisterFace = ({ 
  webcamRef, 
  setWebcamRef, 
  capturedImage, 
  captureImage, 
  captureWebcamImage,
  clearImage, 
  registerName, 
  setRegisterName, 
  registerFace, 
  isRegistering, 
  cameraStarted, 
  setCameraStarted 
}) => {
  const [uploadMethod, setUploadMethod] = React.useState('camera') // 'camera' or 'upload'
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        captureImage(e.target.result) // Reuse the captureImage function with base64 data
      }
      reader.readAsDataURL(file)
    }
  }
  return (
    <main className="flex-1 p-8" style={{ background: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Registration Form */}
        <div className="glass-card p-8 mb-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(198, 93, 123, 0.1)' }}>
              <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-6 2c-1.1 0-2 .9-2 2v1h16v-1c0-1.1-.9-2-2-2H6z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Register New Face</h2>
              <p style={{ color: 'var(--muted)' }}>Add a new person to the face recognition system</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Camera Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Capture Photo</h3>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setUploadMethod('camera')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                      uploadMethod === 'camera' 
                        ? 'bg-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    style={{ color: uploadMethod === 'camera' ? 'var(--primary)' : undefined }}
                  >
                    Camera
                  </button>
                  <button
                    onClick={() => setUploadMethod('upload')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                      uploadMethod === 'upload' 
                        ? 'bg-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    style={{ color: uploadMethod === 'upload' ? 'var(--primary)' : undefined }}
                  >
                    Upload
                  </button>
                </div>
              </div>
              
              <div className="relative mb-6 rounded-2xl overflow-hidden" style={{ background: 'var(--background)', aspectRatio: '4/3' }}>
                {uploadMethod === 'camera' ? (
                  // Camera Mode
                  cameraStarted ? (
                    <Webcam
                      ref={setWebcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-full object-cover"
                      videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
                    />
                  ) : capturedImage ? (
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-2xl border-2 border-dashed flex items-center justify-center" 
                          style={{ borderColor: 'var(--primary)', background: 'rgba(198, 93, 123, 0.05)' }}>
                          <span className="text-4xl">📷</span>
                        </div>
                        <h4 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>No photo captured</h4>
                        <p className="text-sm" style={{ color: 'var(--muted)' }}>Start camera and capture a clear face photo</p>
                      </div>
                    </div>
                  )
                ) : (
                  // Upload Mode
                  capturedImage ? (
                    <img src={capturedImage} alt="Uploaded" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-2xl border-2 border-dashed flex items-center justify-center" 
                          style={{ borderColor: 'var(--secondary)', background: 'rgba(159, 122, 234, 0.05)' }}>
                          <span className="text-4xl">📁</span>
                        </div>
                        <h4 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>No image uploaded</h4>
                        <p className="text-sm" style={{ color: 'var(--muted)' }}>Choose an image file from your device</p>
                      </div>
                    </div>
                  )
                )}
              </div>

              {uploadMethod === 'camera' ? (
                // Camera Controls
                <div className="flex space-x-4">
                  <button
                    onClick={() => setCameraStarted(!cameraStarted)}
                    className="flex-1 py-3 rounded-xl font-semibold transition-all duration-300 hover:transform hover:scale-105"
                    style={{ 
                      background: cameraStarted ? 'var(--muted)' : 'var(--gradient-primary)', 
                      color: 'white',
                      boxShadow: 'var(--shadow-sm)' 
                    }}
                  >
                    {cameraStarted ? 'Stop Camera' : 'Start Camera'}
                  </button>
                  
                  {cameraStarted && (
                    <button
                      onClick={captureWebcamImage}
                      className="flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:transform hover:scale-105"
                      style={{ background: 'var(--gradient-secondary)', boxShadow: 'var(--shadow-sm)' }}
                    >
                      Capture Photo
                    </button>
                  )}
                  
                  {capturedImage && (
                    <button
                      onClick={clearImage}
                      className="px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-100"
                      style={{ color: 'var(--muted)', border: '1px solid var(--muted)' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              ) : (
                // Upload Controls
                <div className="flex space-x-4">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div
                      className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:transform hover:scale-105 cursor-pointer text-center"
                      style={{ background: 'var(--gradient-secondary)', boxShadow: 'var(--shadow-sm)' }}
                    >
                      Choose Image File
                    </div>
                  </label>
                  
                  {capturedImage && (
                    <button
                      onClick={clearImage}
                      className="px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-100"
                      style={{ color: 'var(--muted)', border: '1px solid var(--muted)' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Form Section */}
            <div>
              <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--text)' }}>Person Details</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                    Full Name <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Enter the person's full name"
                    className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                      background: 'var(--card)',
                      color: 'var(--text)',
                      focusRingColor: 'var(--primary)'
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(246, 173, 85, 0.1)' }}>
                    <div className="flex items-start space-x-3">
                      <span className="text-lg mt-0.5">💡</span>
                      <div>
                        <h4 className="font-medium text-sm" style={{ color: 'var(--text)' }}>Registration Tips</h4>
                        <ul className="text-xs mt-2 space-y-1" style={{ color: 'var(--muted)' }}>
                          <li>• Ensure good lighting on the face</li>
                          <li>• Look directly at the camera</li>
                          <li>• Remove sunglasses or masks</li>
                          <li>• Use a neutral facial expression</li>
                          <li>• Upload JPG, PNG, or WEBP formats</li>
                          <li>• Maximum file size: 10MB</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={registerFace}
                  disabled={!capturedImage || !registerName.trim() || isRegistering}
                  className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ 
                    background: !capturedImage || !registerName.trim() || isRegistering ? 'var(--muted)' : 'var(--gradient-primary)',
                    boxShadow: 'var(--shadow-md)' 
                  }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {isRegistering ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"/>
                        </svg>
                        <span>Registering Face...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                        </svg>
                        <span>Register Face</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default RegisterFace