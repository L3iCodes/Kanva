import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Navbar from './components/Navbar'
import Header from './components/Header'
import HomePage from './web-pages/HomePage'
import BoardListPage from './web-pages/BoardListPage'
import KanbanPage from './web-pages/KanbanPage'
import LoginPage from './web-pages/LoginPage'
import SignUpPage from './web-pages/SignUpPage'
import ProtectedRoute from '../auth/ProtectedRoute'
import { AuthProvider, useAuth } from '../auth/AuthProvider'

function RootRoute() {
  const { user } = useAuth()
  
  // If user is authenticated, redirect to board-list
  // If not authenticated, show HomePage
  return user ? <Navigate to="/board-list" replace /> : <HomePage />
}

// Component to handle login page with auth check
function LoginRoute() {
  const { user } = useAuth()
  
  // If user is already authenticated, redirect to board-list
  // Otherwise show login page
  return user ? <Navigate to="/board-list" replace /> : <LoginPage />
}

// Component to handle sign-up page with auth check
function SignUpRoute() {
  const { user } = useAuth()
  
  // If user is already authenticated, redirect to board-list
  // Otherwise show sign-up page
  return user ? <Navigate to="/board-list" replace /> : <SignUpPage />
}


function App() {
  return(
    <AuthProvider>
      <Router>
        <div className='wrapper'>
          <Navbar />
          <div className='flex flex-col w-full h-full overflow-hidden'>
            <Header />
            <Routes>
              <Route path='/' element={<RootRoute />} />
              <Route path='/login' element={<LoginRoute />} />
              <Route path='/sign-up' element={<SignUpRoute />} />
              <Route path='/board-list' element={<ProtectedRoute><BoardListPage /></ProtectedRoute>} />
              <Route path='/kanban/:id' element={<ProtectedRoute><KanbanPage /></ProtectedRoute>}/>
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
    
  )
}

export default App
