import Home from './pages/Home';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Details from './pages/GameDetails';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App min-h-screen" style={{ backgroundColor: '#2d0036',
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<Details />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </div>
  )
}

export default App
