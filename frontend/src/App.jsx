import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Header from './components/Header'
import HomePage from './web-pages/HomePage'
import BoardListPage from './web-pages/BoardListPage'
import KanbanPage from './web-pages/KanbanPage'
import LoginPage from './web-pages/LoginPage'
import SignUpPage from './web-pages/SignUpPage'
import ProtectedRoute from '../auth/ProtectedRoute'
import { AuthProvider } from '../auth/AuthProvider'

function App() {
  return(
    <AuthProvider>
      <Router>
        <div className='wrapper'>
          <Navbar />
          <div className='flex flex-col w-full h-full overflow-hidden'>
            <Header />
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/sign-up' element={<SignUpPage />} />
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
