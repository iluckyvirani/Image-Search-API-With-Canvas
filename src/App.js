import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchPage from './Components/Task';
import AddCaptionPage from './Components/CanvasEditor';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/add-caption" element={<AddCaptionPage />} />
      </Routes>
    </Router>
  );
};

export default App;
