import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import RecentPage from './pages/RecentPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/recent" element={<RecentPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;