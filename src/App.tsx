import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import MapComponent from './MapComponent'; // Adjust the path as needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapComponent />} />
        <Route path="/map" element={<MapComponent />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
