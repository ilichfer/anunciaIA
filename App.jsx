
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Header from './components/Header.jsx';
import Profile from './components/Profile.jsx';
import Schedule from './components/Schedule.jsx';
import UsersManager from './components/UsersManager.jsx';
import TCDManager from './components/TCDManager.jsx';
import Reports from './components/Reports.jsx';
import MinistryManager from './components/MinistryManager.jsx';
import Contact from './components/Contact.jsx';
import { apiService } from './src/services/api.ts';

const App = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tcdEntries, setTcdEntries] = useState([]);
  const [events, setEvents] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Cargar todos los datos en paralelo
        const [usersData, eventsData, ministriesData, tcdData, assignmentsData] = await Promise.all([
          apiService.getUsers(),
          apiService.getEvents(),
          apiService.getMinistries(),
          apiService.getTcdEntries(),
          apiService.getAssignments()
        ]);

        setUsers(usersData);
        setEvents(eventsData);
        setMinistries(ministriesData);
        setTcdEntries(tcdData);
        setAssignments(assignmentsData);
        
        // Simular usuario logueado (esto vendría de un auth service real)
        if (usersData.length > 0) {
          setUser(usersData[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error cargando datos de la API Java:", err);
        setError("No se pudo conectar con el servidor. Asegúrate de que el backend Java esté corriendo.");
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleAddUser = async (newUser) => {
    try {
      // Nota: Aquí deberías tener un endpoint POST /users en Java
      // Por ahora lo simulamos localmente si el endpoint no existe aún
      setUsers([...users, { ...newUser, id: Date.now().toString(), active: true }]);
    } catch (err) {
      alert("Error al guardar usuario");
    }
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const addTcdEntry = async (entry) => {
    try {
      const savedEntry = await apiService.createTcdEntry(entry);
      setTcdEntries([savedEntry, ...tcdEntries]);
    } catch (err) {
      alert("Error al guardar TCD: " + err.message);
    }
  };

  const handleAddMinistry = async (name, positions) => {
    try {
      const savedMin = await apiService.createMinistry({ name, positions });
      setMinistries([...ministries, savedMin]);
    } catch (err) {
      alert("Error al crear ministerio: " + err.message);
    }
  };

  const handleAssignPerson = async (assignment) => {
    try {
      const savedAssign = await apiService.createAssignment(assignment);
      setAssignments([...assignments, savedAssign]);
    } catch (err) {
      alert("Error al asignar persona: " + err.message);
    }
  };

  const handleAddEvent = async (newEvent) => {
    try {
      const savedEvent = await apiService.createEvent(newEvent);
      setEvents([savedEvent, ...events]);
      setActiveTab('schedule');
    } catch (err) {
      alert("Error al publicar programación: " + err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-slate-500 font-medium">Conectando con el servidor Java...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center max-w-md">
        <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Error de Conexión</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {user && activeTab === 'profile' && <Profile user={user} events={events} />}
        {activeTab === 'schedule' && <Schedule events={events} />}
        {activeTab === 'users' && (
          <UsersManager users={users} onAddUser={handleAddUser} onToggleStatus={toggleUserStatus} />
        )}
        {activeTab === 'tcd' && (
          <TCDManager tcdEntries={tcdEntries} onAddEntry={addTcdEntry} currentUser={user} />
        )}
        {activeTab === 'reports' && (
          <Reports users={users} tcdEntries={tcdEntries} />
        )}
        {activeTab === 'ministries' && (
          <MinistryManager 
            ministries={ministries} 
            users={users} 
            assignments={assignments}
            onAddMinistry={handleAddMinistry} 
            onAssignPerson={handleAssignPerson}
            onAddEvent={handleAddEvent}
          />
        )}
        {activeTab === 'contact' && <Contact />}
      </main>
      <footer className="mt-20 border-t border-slate-200 py-10 text-center text-slate-400 text-sm">
        <p>© 2026 ADC - Gestión Eclesiástica Digital</p>
      </footer>
    </div>
  );
};

export default App;
