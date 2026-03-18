
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Header from './components/Header.jsx';
import Profile from './components/Profile.jsx';
import Schedule from './components/Schedule.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import UsersManager from './components/UsersManager.jsx';
import TCDManager from './components/TCDManager.jsx';
import Reports from './components/Reports.jsx';
import MinistryManager from './components/MinistryManager.jsx';
import Contact from './components/Contact.jsx';
import useFetch from './useFetch.js';

const App = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tcdEntries, setTcdEntries] = useState([]);
  const [events, setEvents] = useState([]);
  const [ministries, setMinistries] = useState([
    { 
      id: 'm1', 
      name: 'Alabanza', 
      positions: [
        { id: 'p1', name: 'Guitarra' },
        { id: 'p2', name: 'Bajo' },
        { id: 'p3', name: 'Batería' },
        { id: 'p4', name: 'Piano' },
        { id: 'p5', name: 'Voz' }
      ] 
    },
    { 
      id: 'm2', 
      name: 'Audiovisuales', 
      positions: [
        { id: 'p6', name: 'Cámara' },
        { id: 'p7', name: 'Computador Letras' },
        { id: 'p8', name: 'Consola Sonido' }
      ] 
    }
  ]);
  const [assignments, setAssignments] = useState([
    { id: 'a1', userId: 'u1', userName: 'Juan Pérez', ministryId: 'm1', ministryName: 'Alabanza', positionId: 'p5', positionName: 'Voz' },
    { id: 'a2', userId: 'u2', userName: 'Andrés Soto', ministryId: 'm1', ministryName: 'Alabanza', positionId: 'p1', positionName: 'Guitarra' },
    { id: 'a3', userId: 'u3', userName: 'Sara Gomez', ministryId: 'm2', ministryName: 'Audiovisuales', positionId: 'p7', positionName: 'Computador Letras' }
  ]);
  const [localLoading, setLocalLoading] = useState(true);

  // Using the custom hook for external API data
  const { data: usersData, loading: usersLoading } = useFetch('/api/users');
  const { data: eventsData, loading: eventsLoading } = useFetch('/api/events');
  const { data: ministriesData, loading: ministriesLoading } = useFetch('/api/ministries');

  useEffect(() => {
    if (usersData) setUsers(usersData);
  }, [usersData]);

  useEffect(() => {
    if (eventsData) {
      if (Array.isArray(eventsData)) {
        setEvents(eventsData);
      } else if (eventsData.events) {
        setEvents(eventsData.events);
      }
    }
  }, [eventsData]);

  useEffect(() => {
    if (ministriesData && ministriesData.length > 0) setMinistries(ministriesData);
  }, [ministriesData]);

  useEffect(() => {
    const loadLocalData = async () => {
      try {
        setLocalLoading(true);
        const res = await fetch('./data.json');
        const jsonData = await res.json();
        
        setUser(jsonData.user);
        
        // If API events fail or are empty, use local ones as fallback
        let finalEvents = [];
        if (eventsData) {
          if (Array.isArray(eventsData)) {
            finalEvents = eventsData;
          } else if (eventsData.events && Array.isArray(eventsData.events)) {
            finalEvents = eventsData.events;
          }
        }
        
        if (finalEvents.length === 0) {
          setEvents(jsonData.events || []);
        } else {
          setEvents(finalEvents);
        }

        const mockTcds = [
          { id: 't1', userId: 'u1', userName: 'Juan Pérez', date: '2024-05-18', image: 'https://picsum.photos/seed/bible1/400/300' },
          { id: 't2', userId: 'u1', userName: 'Juan Pérez', date: '2024-05-19', image: 'https://picsum.photos/seed/bible2/400/300' },
          { id: 't3', userId: 'u2', userName: 'Andrés Soto', date: '2024-05-19', image: 'https://picsum.photos/seed/bible3/400/300' }
        ];
        setTcdEntries(mockTcds);
        setLocalLoading(false);
      } catch (err) {
        console.error("Error cargando datos locales:", err);
        setLocalLoading(false);
      }
    };

    loadLocalData();
  }, [eventsData]);

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

  const isLoading = usersLoading || eventsLoading || ministriesLoading || localLoading;

  if (isLoading) return (
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
        {activeTab === 'schedule' && (
          <ErrorBoundary>
            <Schedule events={events} />
          </ErrorBoundary>
        )}
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
