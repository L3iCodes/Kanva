import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Header from './components/Header'
import BoardListPage from './web-pages/BoardListPage'
import KanbanPage from './web-pages/KanbanPage'
import LoginPage from './web-pages/LoginPage'
import SignUpPage from './web-pages/SignUpPage'

function App() {
  return(
    <Router>
      <div className='wrapper'>
      <Navbar />
      <div className='flex flex-col w-full h-full overflow-hidden'>
        <Header />
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/sign-up' element={<SignUpPage />} />
          <Route path='/board-list' element={<BoardListPage />} />
          <Route path='/kanban/:id' element={<KanbanPage />}/>
        </Routes>
      </div>
      
      </div>
    </Router>
  )
}

export default App
