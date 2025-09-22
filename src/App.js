import React, { useState } from 'react';
import './App.css';
import CitizenPortal from './components/CitizenPortal';
import AdminPortal from './components/AdminPortal';
import StaffPortal from './components/StaffPortal';
import NotificationToast from './components/NotificationToast';

function App() {
  const [activePortal, setActivePortal] = useState('citizen');
  const [notification, setNotification] = useState({ show: false, message: '' });

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const switchPortal = (portal) => {
    setActivePortal(portal);
  };

  return (
    <div className="App">
      {/* Header */}
      <header>
        <h1>FixItNow</h1>
        <div className="header-buttons">
          <button 
            className={activePortal === 'citizen' ? 'active-btn' : ''}
            onClick={() => switchPortal('citizen')}
          >
            Citizen
          </button>
          <button 
            className={activePortal === 'admin' ? 'active-btn' : ''}
            onClick={() => switchPortal('admin')}
          >
            Admin
          </button>
          <button 
            className={activePortal === 'staff' ? 'active-btn' : ''}
            onClick={() => switchPortal('staff')}
          >
            Staff
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {activePortal === 'citizen' && <CitizenPortal showNotification={showNotification} />}
        {activePortal === 'admin' && <AdminPortal />}
        {activePortal === 'staff' && <StaffPortal showNotification={showNotification} />}
      </main>

      <NotificationToast notification={notification} />
    </div>
  );
}

export default App;