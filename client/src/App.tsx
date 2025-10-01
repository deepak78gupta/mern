import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import { Navigate, Route, Routes } from 'react-router-dom'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { useState } from 'react'

function App() {
  const [isLoggedin, setIsLoggedin] = useState<boolean>(!!sessionStorage.getItem("token"));
  const handleLogin = () => {
    setIsLoggedin(!!sessionStorage.getItem("token"))
  }

  return (
    <div className='w-[100vw]'>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            isLoggedin ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App;
