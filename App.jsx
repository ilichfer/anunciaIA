
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

const App = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tcdEntries, setTcdEntries] = useState([]);
  const [events, setEvents] = useState([]);
  const [ministries, setMinistries] = useState([
    { id: 'm1', name: 'Alabanza', positions: ['Guitarra', 'Bajo', 'Batería', 'Piano', 'Voz'] },
    { id: 'm2', name: 'Audiovisuales', positions: ['Cámara', 'Computador Letras', 'Consola Sonido'] }
  ]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch users from the external API
        const usersRes = await fetch('https://anunciaig.com/api/users');
        const usersData = await usersRes.json();
        setUsers(usersData);

        // Fetch other data from local data.json
        const res = await fetch('./data.json');
        const jsonData = await res.json();
        
        setEvents(jsonData.events || []);
        setUser(jsonData.user);
        
        const mockTcds = [
          { id: 't1', userId: 'u1', userName: 'Juan Pérez', date: '2024-05-18', image: 'https://picsum.photos/seed/bible1/400/300' },
          { id: 't2', userId: 'u1', userName: 'Juan Pérez', date: '2024-05-19', image: 'https://picsum.photos/seed/bible2/400/300' },
          { id: 't3', userId: 'u2', userName: 'Andrés Soto', date: '2024-05-19', image: 'https://picsum.photos/seed/bible3/400/300' }
        ];
        setTcdEntries(mockTcds);
        setLoading(false);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleAddUser = (newUser) => {
    setUsers([...users, { ...newUser, id: Date.now().toString(), active: true }]);
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const addTcdEntry = (entry) => {
    setTcdEntries([...tcdEntries, { ...entry, id: Date.now().toString() }]);
  };

  const handleAddMinistry = (name, positions) => {
    setMinistries([...ministries, { id: Date.now().toString(), name, positions }]);
  };

  const handleAssignPerson = (assignment) => {
    setAssignments([...assignments, { ...assignment, id: Date.now().toString() }]);
  };

  const handleAddEvent = (newEvent) => {
    setEvents([newEvent, ...events]);
    setActiveTab('schedule');
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-slate-500 font-medium">Cargando aplicación...</p>
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
