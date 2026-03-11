import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import RidesPage from './pages/RidesPage';
import PartsPage from './pages/PartsPage';
import Navbar from './components/Navbar.jsx';
import './index.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'rides': return <RidesPage />;
      case 'parts': return <PartsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-root">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;