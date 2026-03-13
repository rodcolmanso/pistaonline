import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
      {/* Container Principal */}
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 text-center">
        
        <h1 className="text-4xl font-black tracking-tighter text-blue-400 mb-2">
          PISTA<span className="text-white">ONLINE</span> 🏎️
        </h1>
        
        <p className="text-slate-400 mb-8">Evolution from TPMOnline</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
            <span className="font-medium text-slate-300">Stack:</span>
            <span className="bg-blue-500 text-[10px] px-2 py-1 rounded-full font-bold">VITE + REACT</span>
          </div>

          <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
            <span className="font-medium text-slate-300">Styling:</span>
            <span className="bg-cyan-500 text-[10px] px-2 py-1 rounded-full font-bold">TAILWIND</span>
          </div>
        </div>

        <button className="mt-8 w-full bg-blue-600 hover:bg-blue-500 transition-colors py-3 rounded-xl font-bold">
          Iniciar Setup
        </button>
      </div>

      <footer className="mt-8 text-slate-500 text-sm">
        Rodando no Mac Mini • Integrado ao Netlify
      </footer>
    </div>
  );
}

export default App;