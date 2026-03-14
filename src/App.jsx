import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AtletaPage from './modules/atleta/AtletaPage';
import { useAuth0 } from "@auth0/auth0-react";


// Componente simples de Home para teste
const Home = () => (
  <div className="text-white p-10">
    <h1 className="text-3xl font-bold">PistaOnline 🏎️</h1>
    <p className="mt-4">Bem-vindo. Vá para <a href="/atleta" className="text-blue-400 underline">Página do Atleta</a></p>
  </div>
);

function App() {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 text-white p-10 font-mono">Verificando telemetria (Auth0)...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-10">Erro no Box: {error.message}</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/atleta" element={<AtletaPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;