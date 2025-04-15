import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import RecentPage from './pages/RecentPage';
import LessonPlan from './pages/LessonPlan';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/recent" element={<RecentPage />} />
          <Route path="/lesson-plan" element={<LessonPlan />} /> {/* New lesson plan page */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;