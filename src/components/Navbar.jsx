function Navbar({ activePage, setActivePage }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '◈' },
    { id: 'rides', label: 'Ride Log', icon: '⟁' },
    { id: 'parts', label: 'Parts', icon: '⚙' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🏍</span>
        <span className="brand-name">MOTO<span className="brand-accent">LOG</span></span>
      </div>
      <div className="navbar-links">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-btn ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="navbar-status">
        <span className="status-dot"></span>
        <span className="status-text">LIVE</span>
      </div>
    </nav>
  );
}

export default Navbar;