import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/public/signup'; 
import Home from './pages/public/home'; 
import NoPage from './component/public/nopage' 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </Router>
  );
}

export default App;