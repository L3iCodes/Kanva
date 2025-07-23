import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Header from './components/Header'
import BoardListPage from './web-pages/BoardListPage'

function App() {
  return(
    <Router>
      <div className='wrapper'>
      <Navbar />
      <div className='flex flex-col w-full h-full'>
        <Header />
        <Routes>
          <Route path='/' element={<BoardListPage />} />
        </Routes>
      </div>
      
      </div>
    </Router>
  )
}

export default App
