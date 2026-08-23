import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import RegisterFace from './components/RegisterFace'
import RegisteredFaces from './components/RegisteredFaces'
import History from './components/History'

function App() {
  const [webcamRef, setWebcamRef] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [registerName, setRegisterName] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [registeredFaces, setRegisteredFaces] = useState([])
  const [recognitionResult, setRecognitionResult] = useState(null)
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({ registered_faces: 0, recognitions: 0 })
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [cameraStarted, setCameraStarted] = useState(false)

  const API_BASE = 'http://127.0.0.1:5000'

  useEffect(() => {
    loadRegisteredFaces()
    loadHistory()
    loadStats()
  }, [])

  const loadRegisteredFaces = async () => {
    try {
      const response = await axios.get(`${API_BASE}/get_registered_faces`)
      setRegisteredFaces(response.data)
    } catch (error) {
      console.error('Error loading registered faces:', error)
    }
  }

  const loadHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE}/history`)
      setHistory(response.data)
    } catch (error) {
      console.error('Error loading history:', error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/stats`)
      setStats(response.data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const captureImage = (imageData = null) => {
    if (imageData) {
      // Handle uploaded image
      setCapturedImage(imageData)
    } else if (webcamRef) {
      // Handle webcam capture
      const imageSrc = webcamRef.getScreenshot()
      setCapturedImage(imageSrc)
    }
    setMessage('')
    setRecognitionResult(null)
  }

  const captureWebcamImage = () => {
    if (webcamRef) {
      const imageSrc = webcamRef.getScreenshot()
      setCapturedImage(imageSrc)
      setMessage('')
      setRecognitionResult(null)
    }
  }

  const clearImage = () => {
    setCapturedImage(null)
    setMessage('')
    setRecognitionResult(null)
    setRegisterName('')
  }

  const registerFace = async () => {
    if (!capturedImage || !registerName.trim()) {
      setMessage('Please capture an image and enter a name')
      setMessageType('error')
      return
    }

    setIsRegistering(true)
    setMessage('')

    try {
      const blob = await fetch(capturedImage).then(res => res.blob())
      const formData = new FormData()
      formData.append('image', blob, 'capture.jpg')
      formData.append('name', registerName.trim())

      const response = await axios.post(
        `${API_BASE}/register_face`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      if (response.data.success) {
        setMessage(response.data.message)
        setMessageType('success')
        setRegisterName('')
        setCapturedImage(null)
        loadRegisteredFaces()
        loadStats()
      } else {
        setMessage(response.data.message)
        setMessageType('error')
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error registering face')
      setMessageType('error')
    } finally {
      setIsRegistering(false)
    }
  }

  const recognizeFace = async () => {
    console.log('Recognition started...')
    console.log('Captured image exists:', !!capturedImage)
    
    if (!capturedImage) {
      setMessage('Please capture an image first')
      setMessageType('error')
      return
    }

    setIsRecognizing(true)
    setMessage('')

    try {
      console.log('Creating FormData for recognition...')
      const blob = await fetch(capturedImage).then(res => res.blob())
      const formData = new FormData()
      formData.append('image', blob, 'capture.jpg')

      console.log('Sending recognition request to:', `${API_BASE}/recognize_face`)
      const response = await axios.post(
        `${API_BASE}/recognize_face`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      console.log('Recognition response:', response.data)

      if (response.data.success && response.data.recognized) {
        console.log('Face recognized successfully:', response.data.name)
        setRecognitionResult({
          name: response.data.name,
          similarity: response.data.similarity,
          message: response.data.message
        })
        setMessage(`Recognized: ${response.data.name} (${response.data.similarity}% confidence)`)
        setMessageType('success')
        loadHistory()
        loadStats()
      } else {
        console.log('Face not recognized:', response.data.message)
        setRecognitionResult(null)
        setMessage(response.data.message || 'No matching face found')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Recognition error:', error)
      setMessage(error.response?.data?.message || 'Error recognizing face')
      setMessageType('error')
    } finally {
      setIsRecognizing(false)
    }
  }

  const deleteFace = async (name) => {
    try {
      await axios.delete(`${API_BASE}/delete_face/${name}`)
      loadRegisteredFaces()
      loadStats()
    } catch (error) {
      console.error(error)
    }
  }

  const clearHistory = async () => {
    await axios.delete(`${API_BASE}/clear_history`)
    loadHistory()
    loadStats()
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : ''} flex`} style={{ background: 'var(--background)' }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header activeTab={activeTab} />

        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            cameraStarted={cameraStarted}
            setCameraStarted={setCameraStarted}
            webcamRef={webcamRef}
            setWebcamRef={setWebcamRef}
            capturedImage={capturedImage}
            captureImage={captureImage}
            recognizeFace={recognizeFace}
            isRecognizing={isRecognizing}
            recognitionResult={recognitionResult}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'register' && (
          <RegisterFace
            webcamRef={webcamRef}
            setWebcamRef={setWebcamRef}
            capturedImage={capturedImage}
            captureImage={captureImage}
            captureWebcamImage={captureWebcamImage}
            clearImage={clearImage}
            registerName={registerName}
            setRegisterName={setRegisterName}
            registerFace={registerFace}
            isRegistering={isRegistering}
            cameraStarted={cameraStarted}
            setCameraStarted={setCameraStarted}
          />
        )}

        {activeTab === 'faces' && (
          <RegisteredFaces
            registeredFaces={registeredFaces}
            deleteFace={deleteFace}
            loadRegisteredFaces={loadRegisteredFaces}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'history' && (
          <History
            history={history}
            clearHistory={clearHistory}
          />
        )}

        {/* Message Display for debugging */}
        {message && (
          <div className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-lg backdrop-blur-lg transition-all duration-300 transform scale-in ${
            messageType === 'success' 
              ? 'bg-green-500/90 text-white border border-green-400/20' 
              : 'bg-red-500/90 text-white border border-red-400/20'
          }`} 
          style={{ 
            boxShadow: 'var(--shadow-lg)',
            backdropFilter: 'blur(12px)',
            zIndex: 1000
          }}>
            <div className="flex items-center space-x-3">
              {messageType === 'success' ? (
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
              ) : (
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs">✕</span>
                </div>
              )}
              <span className="font-medium text-sm">{message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App