import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Header from './components/Header'
import BoardListPage from './web-pages/BoardListPage'
import KanbanPage from './web-pages/KanbanPage'

function App() {
  return(
    <Router>
      <div className='wrapper'>
      <Navbar />
      <div className='flex flex-col w-full h-full overflow-hidden'>
        <Header />
        <Routes>
          <Route path='/' element={<BoardListPage />} />
          <Route path='/kanban/:id' element={<KanbanPage />}/>
        </Routes>
      </div>
      
      </div>
    </Router>
  )
}

export default App
