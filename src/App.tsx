import { Routes, Route, } from 'react-router-dom'
import './App.css'
import UsersList from '@/page/UsersList'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UsersList />} />
      </Routes>
    </>
  )
}

export default App

