import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AlertPage from './pages/AlertNotificationPage';
import PainelPage from './pages/PainelPage'; // ⬅️ Importa a PainelPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/alertas" element={<AlertPage />} />
        <Route path="/painel" element={<PainelPage />} /> {/* ⬅️ Nova rota para PainelPage */}
      </Routes>
    </Router>
  );
}

export default App;

