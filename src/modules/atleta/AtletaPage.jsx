import { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

function AtletaPage() {
  const [atleta, setAtleta] = useState(null);
  const { user } = useAuth0();

  useEffect(() => {
    fetch('/api/v1/atleta/perfil')
      .then(res => res.json())
      .then(data => setAtleta(data));
  }, []);

  if (!atleta) return <div className="text-white p-10">Aquecendo motores...</div>;

  return (

<div className="p-10 text-white">
      <h1 className="text-3xl font-bold">Perfil do Atleta</h1>
      <div className="mt-6 flex items-center gap-4 p-4 bg-slate-800 rounded-xl border border-slate-700">
        <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-full border-2 border-blue-500" />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-slate-400">{user.email}</p>
        </div>
      </div>


    <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 text-white">
      <h2 className="text-2xl font-bold text-blue-400">{atleta.name}</h2>
      <p className="text-slate-400">Email: {atleta.email}</p>
      <div className="mt-4 p-3 bg-slate-900 rounded border border-slate-600">
        <span className="text-xs uppercase font-bold text-slate-500">Clube Atual</span>
        <p>{atleta.clube || "Sem clube vinculado"}</p>
      </div>
    </div>
    </div>
  );
}

// O HOC 'withAuthenticationRequired' redireciona para o login automaticamente
export default withAuthenticationRequired(AtletaPage, {
  onRedirecting: () => <div className="text-white p-10">Redirecionando para o Box...</div>,
});