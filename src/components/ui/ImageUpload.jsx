import { useState } from 'react';

export default function ImageUpload({ onUploadSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      onUploadSuccess(data.secure_url); // Retorna a URL da foto para o componente pai
    } catch (err) {
      console.error("Erro no upload:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <label className="block w-full text-center p-4 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
        <span className="text-slate-400">{loading ? "Subindo para a nuvem..." : "📷 Adicionar Foto"}</span>
        <input type="file" className="hidden" onChange={handleUpload} disabled={loading} />
      </label>
    </div>
  );
}