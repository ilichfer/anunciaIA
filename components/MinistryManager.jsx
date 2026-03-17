
import { useState } from 'react';

const MinistryManager = ({ ministries, users, assignments, onAddMinistry, onAssignPerson, onAddEvent }) => {
  const [view, setView] = useState('list'); // 'list' | 'add-ministry' | 'assign' | 'create-schedule'
  const [newMin, setNewMin] = useState({ name: '', positions: '' });
  const [newAssign, setNewAssign] = useState({ userId: '', ministryId: '', position: '' });
  
  // Estado para la creación de nueva programación
  const [newEvent, setNewEvent] = useState({
    date: '',
    time: '09:00 AM',
    selectedMinistryId: '',
    assignments: {} // Estructura: { "Posicion": "Nombre Persona" }
  });

  const handleCreateMinistry = (e) => {
    e.preventDefault();
    const posArray = newMin.positions.split(',').map(p => p.trim()).filter(p => p !== '');
    onAddMinistry(newMin.name, posArray);
    setNewMin({ name: '', positions: '' });
    setView('list');
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    const user = users.find(u => u.id === newAssign.userId);
    const ministry = ministries.find(m => m.id === newAssign.ministryId);
    onAssignPerson({
      ...newAssign,
      userName: user?.name,
      ministryName: ministry?.name
    });
    setNewAssign({ userId: '', ministryId: '', position: '' });
    setView('list');
  };

  const handleAddPersonToEvent = (position, personName) => {
    setNewEvent(prev => ({
      ...prev,
      assignments: {
        ...prev.assignments,
        [position]: personName
      }
    }));
  };

  const handleSaveEvent = () => {
    if (!newEvent.date || !newEvent.selectedMinistryId) {
      alert("Por favor completa la fecha y selecciona un ministerio.");
      return;
    }

    const ministry = ministries.find(m => m.id === newEvent.selectedMinistryId);
    
    // Convertir el formato local al formato que espera el componente Schedule
    const formattedMinistries = {
      [ministry.name]: Object.entries(newEvent.assignments)
        .filter(([, personName]) => personName !== "")
        .map(([position, personName]) => ({
          position,
          personName
        }))
    };

    if (formattedMinistries[ministry.name].length === 0) {
      alert("Debes asignar al menos a una persona.");
      return;
    }

    onAddEvent({
      id: Date.now().toString(),
      date: newEvent.date,
      time: newEvent.time,
      ministries: formattedMinistries
    });

    setNewEvent({ date: '', time: '09:00 AM', selectedMinistryId: '', assignments: {} });
    setView('list');
    alert("¡Programación creada con éxito!");
  };

  const activeMinistryForSchedule = ministries.find(m => m.id === newEvent.selectedMinistryId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Panel de Ministerios</h2>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setView('create-schedule')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'create-schedule' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <i className="fas fa-calendar-plus mr-2"></i>Nueva Programación
          </button>
          <button 
            onClick={() => setView('add-ministry')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'add-ministry' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <i className="fas fa-plus mr-2"></i>Crear Ministerio
          </button>
          <button 
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <i className="fas fa-th-list mr-2"></i>Ver Estructura
          </button>
        </div>
      </div>

      {view === 'create-schedule' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl animate-in fade-in zoom-in duration-300">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800">Planificador de Actividades</h3>
            <p className="text-slate-500 text-sm">Configura los roles para el próximo servicio.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha</label>
              <input 
                type="date"
                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Seleccionar Ministerio</label>
              <select 
                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newEvent.selectedMinistryId} 
                onChange={e => setNewEvent({...newEvent, selectedMinistryId: e.target.value, assignments: {}})}
              >
                <option value="">-- Elige un ministerio --</option>
                {ministries.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>

          {activeMinistryForSchedule && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-users-cog"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Asignación de Posiciones: {activeMinistryForSchedule.name}</h4>
                  <p className="text-xs text-slate-400">Selecciona quién ocupará cada puesto en esta fecha.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeMinistryForSchedule.positions.map(pos => (
                  <div key={pos} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">{pos}</span>
                      <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
                    </div>
                    <select 
                      className="w-full p-2.5 bg-slate-50 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newEvent.assignments[pos] || ""}
                      onChange={(e) => handleAddPersonToEvent(pos, e.target.value)}
                    >
                      <option value="">-- Sin asignar --</option>
                      {users.filter(u => u.active).map(u => (
                        <option key={u.id} value={u.name}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-end gap-4">
            <button 
              onClick={() => setView('list')}
              className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all"
            >
              Descartar
            </button>
            <button 
              onClick={handleSaveEvent}
              className="px-10 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
            >
              Publicar Programación
            </button>
          </div>
        </div>
      )}

      {view === 'add-ministry' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Nuevo Ministerio</h3>
          <form onSubmit={handleCreateMinistry} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Nombre del Ministerio</label>
              <input 
                type="text" placeholder="Ej: Audiovisuales" required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newMin.name} onChange={e => setNewMin({...newMin, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Posiciones (separadas por coma)</label>
              <textarea 
                placeholder="Ej: Cámara 1, Consola, Pantallas" required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none h-32"
                value={newMin.positions} onChange={e => setNewMin({...newMin, positions: e.target.value})}
              />
              <p className="text-xs text-slate-400 italic">Define qué roles existen dentro de este ministerio.</p>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setView('list')} className="px-6 py-3 font-bold text-slate-500">Cancelar</button>
              <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                Crear Ministerio
              </button>
            </div>
          </form>
        </div>
      )}

      {view === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest px-2">Estructuras Activas</h3>
            {ministries.map(m => (
              <div key={m.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <i className="fas fa-sitemap"></i>
                    </div>
                    <h4 className="font-bold text-lg text-slate-800">{m.name}</h4>
                  </div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-black uppercase">{m.positions.length} Puestos</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {m.positions.map(pos => (
                    <span key={pos} className="text-[10px] bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-100 font-bold uppercase">
                      {pos}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest px-2">Habilidades de Servidores</h3>
            {assignments.length === 0 ? (
              <div className="bg-slate-100/50 p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400">
                <i className="fas fa-user-tag text-3xl mb-3 opacity-20"></i>
                <p className="text-sm font-medium">No hay especialidades registradas.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {assignments.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                        {a.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-800">{a.userName}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{a.ministryName}</div>
                      </div>
                    </div>
                    <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border border-indigo-100">
                      {a.position}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button 
              onClick={() => setView('assign')}
              className="w-full py-4 mt-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm hover:bg-white hover:border-indigo-300 hover:text-indigo-500 transition-all"
            >
              <i className="fas fa-plus-circle mr-2"></i>Registrar Habilidad
            </button>
          </div>
        </div>
      )}

      {view === 'assign' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl animate-in fade-in zoom-in duration-300">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Vincular Servidor a Posición</h3>
          <form onSubmit={handleAssignSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Servidor</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newAssign.userId} onChange={e => setNewAssign({...newAssign, userId: e.target.value})} required
                >
                  <option value="">-- Seleccionar --</option>
                  {users.filter(u => u.active).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ministerio</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newAssign.ministryId} onChange={e => setNewAssign({...newAssign, ministryId: e.target.value, position: ''})} required
                >
                  <option value="">-- Seleccionar --</option>
                  {ministries.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>
            {newAssign.ministryId && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Posición Dominada</label>
                <div className="flex flex-wrap gap-2">
                  {ministries.find(m => m.id === newAssign.ministryId)?.positions.map(pos => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setNewAssign({...newAssign, position: pos})}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${newAssign.position === pos ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-400'}`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setView('list')} className="px-6 py-3 font-bold text-slate-500">Cancelar</button>
              <button type="submit" disabled={!newAssign.position} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50">
                Guardar Especialidad
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MinistryManager;
