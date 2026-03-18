
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
  const [ministries, setMinistries] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Using the custom hook for external API data
  const { data: userData, loading: userLoading } = useFetch('/api/user');
  const { data: usersData, loading: usersLoading } = useFetch('/api/users');
  const { data: eventsData, loading: eventsLoading } = useFetch('https://anunciaig.com/api/events');
  const { data: ministriesData, loading: ministriesLoading } = useFetch('/api/ministries');
  const { data: tcdData, loading: tcdLoading } = useFetch('/api/tcd');
  const { data: assignmentsData, loading: assignmentsLoading } = useFetch('/api/assignments');

  useEffect(() => {
    if (userData) setUser(userData);
  }, [userData]);

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
    if (ministriesData) setMinistries(ministriesData);
  }, [ministriesData]);

  useEffect(() => {
    if (tcdData) setTcdEntries(tcdData);
  }, [tcdData]);

  useEffect(() => {
    if (assignmentsData) setAssignments(assignmentsData);
  }, [assignmentsData]);

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

  const isLoading = userLoading || usersLoading || eventsLoading || ministriesLoading || tcdLoading || assignmentsLoading;

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
