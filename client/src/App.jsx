import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import Horses from './components/HorseList'
import Cows from './components/CowList'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Admin from './components/Admin'
import Contact from './components/Contact'
import { useContext } from 'react'
import { UserContext } from './context/userContext'

function App() {

  const { token } = useContext(UserContext)

  return (
    <Router>
      <Header />
      <Routes className='main'>
        <Route path='/' element={<Home />} />
        <Route path='/horses' element={<Horses />} />
        <Route path='/cows' element={<Cows />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={ token ? <Navigate to="/"/> : <Login /> }/>
        <Route
          path="/admin"
          element={<ProtectedRoute token={token} redirectTo="/">
            <Admin />
          </ProtectedRoute>}
        />
      </Routes>
    </Router>
  )
}

export default App