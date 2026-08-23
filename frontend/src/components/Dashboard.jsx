import React, { useRef } from 'react'
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
  recognitionResult,
  setActiveTab
}) => {
  const fileInputRef = useRef(null)

  const handleUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    // Allow common image formats
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }

    // 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10 MB.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      // App.jsx already supports captureImage(imageData)
      captureImage(reader.result)

      // Stop webcam if an uploaded image is selected
      if (cameraStarted) {
        setCameraStarted(false)
      }
    }

    reader.onerror = () => {
      alert('Unable to read the selected image.')
    }

    reader.readAsDataURL(file)

    // Allow selecting the same file again later
    event.target.value = ''
  }

  const handleCameraStart = () => {
    // Clear previously uploaded/captured image when starting camera
    if (!cameraStarted) {
      captureImage(null)
    }

    setCameraStarted(!cameraStarted)
  }

  const handleCapture = () => {
    if (cameraStarted && !capturedImage) {
      captureImage()
    } else if (capturedImage) {
      recognizeFace()
    }
  }

  return (
    <main
      className="flex-1 p-8"
      style={{ background: 'var(--background)' }}
    >

      {/* Quick Intro Section */}
      <div className="mb-8">
        <div className="glass-card p-6">

          <div className="flex items-center space-x-4 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <span className="text-white text-2xl">🚀</span>
            </div>

            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: 'var(--text)' }}
              >
                Welcome to FaceID System
              </h2>

              <p
                className="text-sm"
                style={{ color: 'var(--muted)' }}
              >
                Your intelligent face recognition dashboard
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div
              className="flex items-start space-x-3 p-4 rounded-lg"
              style={{ background: 'rgba(198, 93, 123, 0.05)' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(198, 93, 123, 0.1)' }}
              >
                <span className="text-lg">📸</span>
              </div>

              <div>
                <h4
                  className="font-semibold text-sm"
                  style={{ color: 'var(--text)' }}
                >
                  1. Register Faces
                </h4>

                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--muted)' }}
                >
                  Add people to the system using camera or upload photos
                </p>
              </div>
            </div>

            <div
              className="flex items-start space-x-3 p-4 rounded-lg"
              style={{ background: 'rgba(72, 187, 120, 0.05)' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(72, 187, 120, 0.1)' }}
              >
                <span className="text-lg">🔍</span>
              </div>

              <div>
                <h4
                  className="font-semibold text-sm"
                  style={{ color: 'var(--text)' }}
                >
                  2. Face Recognition
                </h4>

                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--muted)' }}
                >
                  Recognize faces using live camera or uploaded images
                </p>
              </div>
            </div>

            <div
              className="flex items-start space-x-3 p-4 rounded-lg"
              style={{ background: 'rgba(159, 122, 234, 0.05)' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(159, 122, 234, 0.1)' }}
              >
                <span className="text-lg">📊</span>
              </div>

              <div>
                <h4
                  className="font-semibold text-sm"
                  style={{ color: 'var(--text)' }}
                >
                  3. Track History
                </h4>

                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--muted)' }}
                >
                  Monitor recognition activities and manage data
                </p>
              </div>
            </div>

          </div>

          <div
            className="mt-6 pt-4"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between">

              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--text)' }}
                >
                  {stats.registered_faces === 0
                    ? 'Ready to get started?'
                    : 'System is active and ready!'
                  }
                </p>

                <p
                  className="text-xs"
                  style={{ color: 'var(--muted)' }}
                >
                  {stats.registered_faces === 0
                    ? 'Register your first face to begin using the recognition system'
                    : `${stats.registered_faces} faces registered • ${stats.recognitions} recognitions completed`
                  }
                </p>
              </div>

              <div className="flex space-x-3">

                <button
                  onClick={() => setActiveTab('register')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:transform hover:scale-105"
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {stats.registered_faces === 0
                    ? 'Register First Face'
                    : 'Add New Face'
                  }
                </button>

                {stats.registered_faces > 0 && (
                  <button
                    onClick={() => setActiveTab('faces')}
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


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="glass-card p-6">
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: 'var(--muted)' }}
          >
            Registered Faces
          </h3>

          <div
            className="text-2xl font-bold mb-1"
            style={{ color: 'var(--text)' }}
          >
            {stats.registered_faces}
          </div>

          <p
            className="text-xs"
            style={{ color: 'var(--muted)' }}
          >
            Total people
          </p>
        </div>


        <div className="glass-card p-6">
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: 'var(--muted)' }}
          >
            Total Recognitions
          </h3>

          <div
            className="text-2xl font-bold mb-1"
            style={{ color: 'var(--text)' }}
          >
            {stats.recognitions}
          </div>

          <p
            className="text-xs"
            style={{ color: 'var(--muted)' }}
          >
            All time
          </p>
        </div>


        <div className="glass-card p-6">
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: 'var(--muted)' }}
          >
            Accuracy
          </h3>

          <div
            className="text-2xl font-bold mb-1"
            style={{ color: 'var(--text)' }}
          >
            95%
          </div>

          <p
            className="text-xs"
            style={{ color: 'var(--muted)' }}
          >
            Recognition rate
          </p>
        </div>


        <div className="glass-card p-6">
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: 'var(--muted)' }}
          >
            Last Recognition
          </h3>

          <div
            className="text-2xl font-bold mb-1"
            style={{ color: 'var(--text)' }}
          >
            N/A
          </div>

          <p
            className="text-xs"
            style={{ color: 'var(--muted)' }}
          >
            No data yet
          </p>
        </div>

      </div>


      {/* Camera + Recognition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        {/* ================= CAMERA ================= */}
        <div className="glass-card p-6">

          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center space-x-3">

              <div
                className="p-2 rounded-lg"
                style={{ background: 'rgba(198, 93, 123, 0.1)' }}
              >
                📷
              </div>

              <div>
                <h3
                  className="font-semibold text-lg"
                  style={{ color: 'var(--text)' }}
                >
                  Live Camera
                </h3>

                <p
                  className="text-sm"
                  style={{ color: 'var(--muted)' }}
                >
                  Use your camera to capture a face
                </p>
              </div>

            </div>

            {cameraStarted && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700">
                  Live
                </span>
              </div>
            )}

          </div>


          <div
            className="relative mb-6 rounded-2xl overflow-hidden"
            style={{
              background: 'var(--background)',
              aspectRatio: '16/9'
            }}
          >

            {cameraStarted ? (

              <Webcam
                ref={setWebcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{
                  width: 640,
                  height: 480,
                  facingMode: "user"
                }}
              />

            ) : (

              <div className="w-full h-full flex items-center justify-center">

                <div className="text-center">

                  <div
                    className="w-20 h-20 mx-auto mb-4 rounded-2xl border-2 border-dashed flex items-center justify-center"
                    style={{
                      borderColor: 'var(--primary)',
                      background: 'rgba(198, 93, 123, 0.05)'
                    }}
                  >
                    📷
                  </div>

                  <h4
                    className="font-semibold mb-2"
                    style={{ color: 'var(--text)' }}
                  >
                    Click 'Start Camera' to begin
                  </h4>

                  <p
                    className="text-sm"
                    style={{ color: 'var(--muted)' }}
                  >
                    Make sure your camera is connected
                  </p>

                </div>

              </div>
            )}

          </div>


          <button
            onClick={handleCameraStart}
            className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:transform hover:scale-105"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {cameraStarted ? '⏸ Stop Camera' : '▶ Start Camera'}
          </button>

        </div>


        {/* ================= RECOGNITION ================= */}
        <div className="glass-card p-6">

          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center space-x-3">

              <div
                className="p-2 rounded-lg"
                style={{ background: 'rgba(72, 187, 120, 0.1)' }}
              >
                🔍
              </div>

              <div>

                <h3
                  className="font-semibold text-lg"
                  style={{ color: 'var(--text)' }}
                >
                  Face Recognition
                </h3>

                <p
                  className="text-sm"
                  style={{ color: 'var(--muted)' }}
                >
                  Use camera or upload an image
                </p>

              </div>

            </div>

            {recognitionResult && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                <span className="text-xs font-medium text-green-700">
                  ✓ Recognized
                </span>
              </div>
            )}

          </div>


          {/* Camera / Upload Options */}
          <div className="flex gap-2 mb-4">

            <button
              onClick={() => {
                if (!cameraStarted) {
                  setCameraStarted(true)
                }
              }}
              className="flex-1 py-3 rounded-lg font-medium transition-all"
              style={{
                background: cameraStarted
                  ? 'var(--gradient-secondary)'
                  : 'rgba(198, 93, 123, 0.1)',
                color: cameraStarted
                  ? 'white'
                  : 'var(--text)'
              }}
            >
              📷 Live Camera
            </button>


            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3 rounded-lg font-medium transition-all"
              style={{
                background: 'rgba(159, 122, 234, 0.1)',
                color: 'var(--text)'
              }}
            >
              📁 Upload Image
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              className="hidden"
            />

          </div>


          {/* Image Preview */}
          <div
            className="relative mb-6 rounded-2xl overflow-hidden"
            style={{
              background: 'var(--background)',
              aspectRatio: '16/9'
            }}
          >

            {capturedImage ? (

              <img
                src={capturedImage}
                alt="Selected face"
                className="w-full h-full object-cover"
              />

            ) : (

              <div className="w-full h-full flex items-center justify-center">

                <div className="text-center">

                  <div
                    className="w-20 h-20 mx-auto mb-4 rounded-2xl border-2 border-dashed flex items-center justify-center"
                    style={{
                      borderColor: 'var(--muted)',
                      background: 'rgba(107, 114, 128, 0.05)'
                    }}
                  >
                    🖼️
                  </div>

                  <h4
                    className="font-semibold mb-2"
                    style={{ color: 'var(--text)' }}
                  >
                    No image selected
                  </h4>

                  <p
                    className="text-sm"
                    style={{ color: 'var(--muted)' }}
                  >
                    Capture from camera or upload an image
                  </p>

                </div>

              </div>

            )}

          </div>


          {/* Recognition Button */}
          <button
            onClick={handleCapture}
            disabled={!capturedImage && !cameraStarted || isRecognizing}
            className="w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background:
                (!capturedImage && !cameraStarted) || isRecognizing
                  ? 'var(--muted)'
                  : 'var(--gradient-secondary)',
              color: 'white',
              boxShadow: 'var(--shadow-md)'
            }}
          >

            {isRecognizing ? (
              '⏳ Recognizing...'
            ) : capturedImage ? (
              '🔍 Recognize Face'
            ) : (
              '📸 Capture & Recognize'
            )}

          </button>


          {/* Recognition Result */}
          {recognitionResult && (

            <div
              className="mt-4 p-4 rounded-xl border"
              style={{
                background: 'rgba(72, 187, 120, 0.05)',
                borderColor: 'var(--success)'
              }}
            >

              <div className="flex items-center space-x-3">

                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--success)' }}
                >
                  ✓
                </div>

                <div className="flex-1">

                  <h4
                    className="font-semibold"
                    style={{ color: 'var(--success)' }}
                  >
                    Recognition Successful!
                  </h4>

                  <p
                    className="text-sm"
                    style={{ color: 'var(--muted)' }}
                  >
                    <span
                      className="font-medium"
                      style={{ color: 'var(--text)' }}
                    >
                      {recognitionResult.name}
                    </span>

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