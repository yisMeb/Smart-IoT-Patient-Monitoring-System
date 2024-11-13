import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/public/signup'; 
import Login from './pages/public/login'; 
import Home from './pages/public/home'; 
import NoPage from './component/public/nopage' 
import { UserRoleProvider } from './context/UserRoleContext';
import VerifyEmail from './pages/public/VerifyEmail';

function App() {
  return (
    <UserRoleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
    </Router>
    </UserRoleProvider>    
  );
}

export default App;