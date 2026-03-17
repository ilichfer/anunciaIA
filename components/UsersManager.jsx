
import { useState } from 'react';

const UsersManager = ({ users, onAddUser, onToggleStatus }) => {
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', role: 'Miembro', ministry: '', email: '' });

  const roles = [
    { id: 'admin', label: 'Administrador' },
    { id: 'leader', label: 'Líder de Ministerio' },
    { id: 'servant', label: 'Servidor' },
    { id: 'member', label: 'Miembro' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddUser({ ...newUser, avatar: `https://picsum.photos/seed/${newUser.name}/200/200` });
    setNewUser({ name: '', role: 'Miembro', ministry: '', email: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gestión de Usuarios</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
          {showForm ? 'Cancelar' : 'Agregar Usuario'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nombre Completo</label>
              <input 
                type="text" placeholder="Ej: Andrés Soto" required
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Ministerio</label>
              <input 
                type="text" placeholder="Ej: Alabanza" required
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={newUser.ministry} onChange={e => setNewUser({...newUser, ministry: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Asignar Rol</label>
              <select 
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}
              >
                {roles.map(role => (
                  <option key={role.id} value={role.label}>{role.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Correo Electrónico</label>
              <input 
                type="email" placeholder="correo@ejemplo.com" required
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
            Registrar Usuario
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ministerio / Rol</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Estado</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(user => (
                <tr key={user.id} className={`${user.active ? 'hover:bg-slate-50/50' : 'bg-slate-50 opacity-60'} transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-200 object-cover" alt={user.name} />
                      <div>
                        <div className="font-bold text-slate-800">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-700">{user.ministry}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onToggleStatus(user.id)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${
                        user.active 
                          ? 'text-rose-600 hover:bg-rose-50' 
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {user.active ? 'Desactivar' : 'Reactivar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManager;
