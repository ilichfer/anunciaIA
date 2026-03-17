
const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-4">
      <div className="max-w-6xl mx-auto px-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <i className="fas fa-church text-xl"></i>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">ADC</h1>
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] opacity-80">Gestión Eclesiástica</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
