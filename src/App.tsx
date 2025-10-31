import { Routes, Route } from 'react-router-dom'
import './App.css'
import UsersList from '@/page/UserList/UsersList'
import NotFound from '@/page/NotFound/NotFound'
import ErrorBoundary from '@/components/ui/ErrorBoundary/ErrorBoundary'

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ErrorBoundary fallback={<p role="alert">Something went wrong loading users.</p>}>
              <UsersList />
            </ErrorBoundary>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
