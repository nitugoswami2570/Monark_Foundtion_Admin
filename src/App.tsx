import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Donations from './components/Donations';
import Projects from './components/Projects';
import Volunteers from './components/Volunteers';
import Contacts from './components/Contacts';
import Settings from './components/Settings';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'donations':
        return <Donations />;
      case 'projects':
        return <Projects />;
      case 'volunteers':
        return <Volunteers />;
      case 'contacts':
        return <Contacts />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{renderSection()}</div>
      </main>
    </div>
  );
}

export default App;
