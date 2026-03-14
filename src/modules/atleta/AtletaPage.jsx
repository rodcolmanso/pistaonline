import { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Cloudinary } from "@cloudinary/url-gen";
import ImageUpload from '../../components/ui/ImageUpload';

// Inicializa o Cloudinary fora do componente para não re-instanciar no render
const cld = new Cloudinary({
  cloud: { cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME }
});

function AtletaPage() {
  const { user } = useAuth0();
  const [atleta, setAtleta] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Efeito para buscar dados do MongoDB ao carregar
  useEffect(() => {
    if (user?.email) {
      fetch(`/api/v1/atleta/perfil?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          setAtleta(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao buscar perfil:", err);
          setLoading(false);
        });
    }
  }, [user]);

  // 2. Função para lidar com a nova foto do Cloudinary
  const handleNewPhoto = async (url) => {
    // Atualiza o estado local imediatamente
    setAtleta(prev => ({ ...prev, foto_url: url }));

    // Salva a URL no MongoDB
    try {
      await fetch('/api/v1/atleta/atualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, foto_url: url })
      });
    } catch (err) {
      console.error("Erro ao salvar foto no banco:", err);
    }
  };

  // 3. Renderização condicional de carregamento
  if (loading || !atleta) {
    return <div className="text-white p-10 font-mono">Aquecendo motores...</div>;
  }

  return (
    <div className="p-10 text-white space-y-6">
      <h1 className="text-3xl font-bold italic text-blue-500">DASHBOARD DO ATLETA</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD DE IDENTIDADE (AUTH0 + CLOUDINARY) */}
        <div className="flex flex-col items-center p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
          <div className="relative group">
            {atleta.foto_url ? (
              <img 
                src={atleta.foto_url} 
                className="w-40 h-40 rounded-full border-4 border-blue-600 object-cover shadow-lg" 
                alt="Foto do Atleta"
              />
            ) : (
              <div className="w-40 h-40 bg-slate-700 rounded-full flex items-center justify-center text-5xl border-4 border-slate-600">
                👤
              </div>
            )}
          </div>
          
          <div className="w-full mt-4">
             <ImageUpload onUploadSuccess={handleNewPhoto} />
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-slate-400 text-sm">{user.email}</p>
          </div>
        </div>

        {/* CARD DE DADOS TÉCNICOS (MONGODB) */}
        <div className="md:col-span-2 p-6 bg-slate-800 rounded-xl border border-slate-700">
          <h3 className="text-blue-400 font-bold uppercase tracking-widest mb-4">Informações de Federação</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Nome de Atleta:</span>
              <span className="font-bold">{atleta.name || 'Não preenchido'}</span>
            </div>
            
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Clube Atual:</span>
              <span className="text-blue-300 font-semibold">{atleta.clube || "Sem clube vinculado"}</span>
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-xs text-blue-300 uppercase font-black mb-1">Status da Matrícula</p>
              <p className="text-sm">Atleta verificado e ativo no sistema PistaOnline.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default withAuthenticationRequired(AtletaPage, {
  onRedirecting: () => <div className="text-white p-10">Redirecionando para o Box...</div>,
});