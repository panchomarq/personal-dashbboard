// components/Sidebar.tsx
import { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ display: 'flex' }}>
      <button onClick={toggleSidebar} style={{ margin: '10px' }}>
        {isOpen ? 'Hide' : 'Show'}
      </button>
      {isOpen && (
        <div style={{ width: '200px', background: '#f4f4f4', height: '100vh' }}>
          <nav>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
