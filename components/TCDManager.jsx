
import { useState } from 'react';

const TCDManager = ({ tcdEntries, onAddEntry, currentUser }) => {
  const [image, setImage] = useState(null);
  const [filterDates, setFilterDates] = useState({ start: '', end: '' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!image) return;
    const today = new Date().toISOString().split('T')[0];
    onAddEntry({
      userId: currentUser.id,
      userName: currentUser.name,
      date: today,
      image: image
    });
    setImage(null);
    alert('TCD subido correctamente');
  };

  const filteredTCD = tcdEntries.filter(entry => {
    if (!filterDates.start || !filterDates.end) return true;
    return entry.date >= filterDates.start && entry.date <= filterDates.end;
  });

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Subir mi TCD de hoy</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2">
            <label className="block w-full border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              {image ? (
                <img src={image} className="max-h-48 mx-auto rounded-lg" alt="Vista previa TCD" />
              ) : (
                <div className="text-slate-400">
                  <i className="fas fa-cloud-upload-alt text-4xl mb-2"></i>
                  <p>Presiona para seleccionar tu imagen del TCD</p>
                </div>
              )}
            </label>
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <p className="text-sm text-slate-500 italic">&quot;Lámpara es a mis pies tu palabra, y lumbrera a mi camino.&quot; - Salmos 119:105</p>
            <button 
              disabled={!image}
              onClick={handleUpload}
              className={`w-full py-3 rounded-xl font-bold transition-all ${image ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              Subir TCD
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-xl font-bold">Consultar TCD Diarios</h2>
          <div className="flex items-center gap-2">
            <input type="date" className="p-2 border rounded-lg text-sm" onChange={e => setFilterDates({...filterDates, start: e.target.value})} />
            <span className="text-slate-400">a</span>
            <input type="date" className="p-2 border rounded-lg text-sm" onChange={e => setFilterDates({...filterDates, end: e.target.value})} />
          </div>
        </div>

        {filteredTCD.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed text-slate-400">No se encontraron registros en este rango</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTCD.map(entry => (
              <div key={entry.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <img src={entry.image} className="w-full h-40 object-cover rounded-lg mb-2" alt={`TCD de ${entry.userName}`} />
                <div className="text-sm font-bold text-slate-800">{entry.userName}</div>
                <div className="text-xs text-slate-500">{entry.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TCDManager;
