import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage'
import SettingsPage from './pages/SettingsPage'
import SignUpPage from './pages/SignUpPage'
import ProfilePage from './pages/ProfilePage'
import LogInPage from './pages/LogInPage'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

// we have also used daizy UI in this project

// we also have zustand which is a local 
// state management library

// we have also ussed lucide react for icons such as loading
const App = () => {
  
  const {authUser, checkAuth , isCheckingAuth} = useAuthStore()

  useEffect(()=>{
    checkAuth()
  },[checkAuth]);

  console.log({authUser});

  if(isCheckingAuth && !authUser)return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
    </div>
  )

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser?<HomePage/>: <Navigate to="/login"/>}/>
        <Route path='/signup' element={!authUser?<SignUpPage/>: <Navigate to="/" />}/>
        <Route path='/login' element={!authUser?<LogInPage/>: <Navigate to="/" />}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={authUser?<ProfilePage/>:<Navigate to="/login"/>}/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App