import { LoginPage } from './components/pages/LoginPage.jsx'
import { Routes, Route} from 'react-router-dom';

function App() {
  return (
    <div>
      <LoginPage />
      <Routes>
        <Route path= "/src/components/pages/LoginPage" element= {<LoginPage />} /> 
        <Route path= "/src/components/pages/AdminPage" element= {<AdminPage />} /> 
      </Routes>
    </div>
  );
}

export default App
