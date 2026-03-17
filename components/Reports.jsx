
import { useState } from 'react';

  const Reports = ({ users, tcdEntries }) => {
    const [range, setRange] = useState({ start: '', end: '' });

    const getReportData = () => {
      if (!range.start || !range.end) return [];
      
      return users.map(user => {
        const count = tcdEntries.filter(entry => 
          entry.userId === user.id && 
          entry.date >= range.start && 
          entry.date <= range.end
        ).length;
        return { ...user, count };
      }).sort((a, b) => b.count - a.count);
    };

    const reportData = getReportData();

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Reporte de Cumplimiento TCD</h2>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Desde</label>
              <input type="date" className="w-full p-2 border rounded-lg" onChange={e => setRange({...range, start: e.target.value})} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hasta</label>
              <input type="date" className="w-full p-2 border rounded-lg" onChange={e => setRange({...range, end: e.target.value})} />
            </div>
          </div>

          {!range.start || !range.end ? (
            <div className="text-center py-10 text-slate-400">
              <i className="fas fa-filter text-4xl mb-4"></i>
              <p>Selecciona un rango de fechas para generar el reporte</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reportData.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <img src={item.avatar} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-bold text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.ministry}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">{item.count}</div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Imágenes subidas</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  export default Reports;
