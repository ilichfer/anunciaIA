
import { useState, useMemo } from 'react';

const Schedule = ({ events }) => {
  // Filtrar eventos que estén entre hoy y los próximos 5 días
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const limitDate = new Date(today);
    limitDate.setDate(today.getDate() + 5);

    return events.filter(event => {
      const eventDate = new Date(event.date + 'T00:00:00');
      return eventDate >= today && eventDate <= limitDate;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  const uniqueDates = useMemo(() => {
    return Array.from(new Set(upcomingEvents.map(e => e.date))).sort();
  }, [upcomingEvents]);

  const [selectedDate, setSelectedDate] = useState(uniqueDates[0] || null);

  // Si la fecha seleccionada ya no está en los eventos filtrados (por cambios externos), resetearla
  if (selectedDate && !uniqueDates.includes(selectedDate)) {
    setSelectedDate(uniqueDates[0] || null);
  }

  const filteredEvents = selectedDate 
    ? upcomingEvents.filter(e => e.date === selectedDate)
    : upcomingEvents;

  const groupedData = useMemo(() => {
    const groups = {};
    
    filteredEvents.forEach(event => {
      if (!groups[event.date]) {
        groups[event.date] = {
          date: event.date,
          ministries: {}
        };
      }
      
      Object.keys(event.ministries).forEach(minName => {
        if (!groups[event.date].ministries[minName]) {
          groups[event.date].ministries[minName] = [];
        }
        // Combinar asignaciones de este ministerio para este día
        const assignmentsWithContext = event.ministries[minName].map(asgn => ({
          ...asgn,
          eventTime: event.time
        }));
        groups[event.date].ministries[minName].push(...assignmentsWithContext);
      });
    });
    
    return Object.values(groups).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredEvents]);

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Programación por Ministerio</h2>
          <p className="text-sm text-slate-500">
            Vista consolidada de actividades próximas
          </p>
        </div>
        
        {uniqueDates.length > 0 && (
          <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl self-start overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedDate(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedDate === null ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-400'
              }`}
            >
              Ver Todos
            </button>
            {uniqueDates.map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedDate === date ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-400'
                }`}
              >
                {new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
              </button>
            ))}
          </div>
        )}
      </div>

      {upcomingEvents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-calendar-times text-slate-300 text-4xl"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No existe programación</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            No hay actividades programadas para los próximos días.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedData.map(dayGroup => (
            <div key={dayGroup.date} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-slate-200 flex-grow"></div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
                  {formatDate(dayGroup.date)}
                </h3>
                <div className="h-px bg-slate-200 flex-grow"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.keys(dayGroup.ministries).map(minName => (
                  <div key={minName} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-indigo-300 transition-all hover:shadow-md">
                    <div className="bg-indigo-600 px-5 py-3 flex justify-between items-center">
                      <h4 className="text-white font-black text-xs uppercase tracking-widest">{minName}</h4>
                      <i className="fas fa-users text-white/40 text-xs"></i>
                    </div>
                    
                    <div className="p-5 space-y-5 flex-grow">
                      {dayGroup.ministries[minName].map((asgn, idx) => (
                        <div key={idx} className="relative pl-4 border-l-2 border-slate-100 hover:border-indigo-400 transition-colors group">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {asgn.position}
                            </span>
                            <span className="text-[9px] font-bold text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded">
                              {asgn.eventTime}
                            </span>
                          </div>
                          <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {asgn.personName}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
