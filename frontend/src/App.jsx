import React, { useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import axios from 'axios'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import './App.css'

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

  const captureImage = () => {
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
    if (!capturedImage) {
      setMessage('Please capture an image first')
      setMessageType('error')
      return
    }

    setIsRecognizing(true)
    setMessage('')

    try {
      const blob = await fetch(capturedImage).then(res => res.blob())
      const formData = new FormData()
      formData.append('image', blob, 'capture.jpg')

      const response = await axios.post(
        `${API_BASE}/recognize_face`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      if (response.data.success && response.data.recognized) {
        setRecognitionResult({
          name: response.data.name,
          similarity: response.data.similarity,
          message: response.data.message
        })
        setMessage(`Recognized: ${response.data.name}`)
        setMessageType('success')
        loadHistory()
        loadStats()
      } else {
        setRecognitionResult(null)
        setMessage(response.data.message)
        setMessageType('error')
      }
    } catch (error) {
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

  const getMessageColor = () => {
    switch (messageType) {
      case 'success': return 'green'
      case 'error': return 'red'
      case 'info': return 'blue'
      default: return 'black'
    }
  }

  // Prepare chart data: last 20 history entries in chronological order
  const chartData = history
    .slice()
    .reverse()
    .slice(-20)
    .map((item, index) => ({
      index: index + 1,
      similarity: parseFloat(item.similarity),
      name: item.name,
      time: item.time
    }))

  return (
    <div
      style={{
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: darkMode ? '#121212' : '#ffffff',
        color: darkMode ? 'white' : 'black'
      }}
    >
      {/* Header row with dark mode toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Face Recognition System</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Stats Panel */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          padding: '15px',
          border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
          borderRadius: '8px',
          backgroundColor: darkMode ? '#1e1e1e' : '#f9f9f9'
        }}
      >
        <div>
          <strong>Registered Faces:</strong> {stats.registered_faces}
        </div>
        <div>
          <strong>Total Recognitions:</strong> {stats.recognitions}
        </div>
      </div>

      <h2>Camera</h2>

      <Webcam
        ref={setWebcamRef}
        screenshotFormat="image/jpeg"
        width={400}
      />
      <br />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0]
          if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
              setCapturedImage(reader.result)
            }
            reader.readAsDataURL(file)
          }
        }}
      />

      {capturedImage && (
        <div>
          <h3>Captured Image</h3>
          <img src={capturedImage} alt="Captured" width={300} />
        </div>
      )}

      <br />

      <button onClick={captureImage}>Capture Image</button>
      <button onClick={clearImage}>Clear</button>

      <hr />

      <h2>Face Recognition</h2>

      <button
        onClick={recognizeFace}
        disabled={!capturedImage || isRecognizing}
      >
        {isRecognizing ? 'Recognizing...' : 'Recognize Face'}
      </button>

      <hr />

      <h2>Register New Face</h2>

      <input
        type="text"
        placeholder="Enter person's name"
        value={registerName}
        onChange={(e) => setRegisterName(e.target.value)}
      />

      <button
        onClick={registerFace}
        disabled={!capturedImage || !registerName.trim() || isRegistering}
      >
        {isRegistering ? 'Registering...' : 'Register Face'}
      </button>

      <br />
      <br />

      {message && (
        <div style={{ color: getMessageColor(), fontWeight: 'bold' }}>
          {message}
        </div>
      )}

      {recognitionResult && (
        <div
          style={{
            marginTop: '15px',
            padding: '15px',
            border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
            borderRadius: '8px',
            backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5'
          }}
        >
          <h3>Recognition Result</h3>
          <p><strong>Name:</strong> {recognitionResult.name}</p>
          <p><strong>Similarity:</strong> {recognitionResult.similarity}%</p>
        </div>
      )}

      <hr />

      <h2>Registered Faces</h2>

      {registeredFaces.length === 0 ? (
        <p>No faces registered yet</p>
      ) : (
        <ul>
          {registeredFaces.map((name, index) => (
            <li key={index}>
              {name}{' '}
              <button onClick={() => deleteFace(name)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h2>Recognition History</h2>

      <button onClick={clearHistory}>Clear History</button>
      {' '}
      <button onClick={() => window.open(`${API_BASE}/export_history`)}>
        Export CSV
      </button>

      {history.length === 0 ? (
        <p>No recognition history yet</p>
      ) : (
        <>
          {/* Analytics Chart */}
          <h3>Similarity Over Time (last 20 recognitions)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#333' : '#eee'} />
              <XAxis
                dataKey="index"
                label={{ value: 'Recognition #', position: 'insideBottom', offset: -2 }}
                tick={{ fill: darkMode ? '#ccc' : '#333' }}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: darkMode ? '#ccc' : '#333' }}
              />
              <Tooltip
                formatter={(value, name) => [`${value}%`, 'Similarity']}
                labelFormatter={(label) => {
                  const item = chartData[label - 1]
                  return item ? `${item.name} — ${item.time}` : `#${label}`
                }}
                contentStyle={{
                  backgroundColor: darkMode ? '#222' : '#fff',
                  color: darkMode ? '#fff' : '#000',
                  border: `1px solid ${darkMode ? '#555' : '#ccc'}`
                }}
              />
              <Line
                type="monotone"
                dataKey="similarity"
                stroke="#4f8ef7"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* History Table */}
          <table
            border="1"
            cellPadding="10"
            style={{
              borderCollapse: 'collapse',
              marginTop: '10px',
              color: darkMode ? 'white' : 'black'
            }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Similarity</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {history
                .slice()
                .reverse()
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.similarity}%</td>
                    <td>{item.time}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default App