import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Header from './components/Header'

function App() {
  return(
    <Router>
      <div className='wrapper'>
      <Navbar />
      <div className='flex flex-col w-full h-full'>
        <Header />
      </div>
      <Routes>

      </Routes>
      </div>
    </Router>
  )
}

export default App
