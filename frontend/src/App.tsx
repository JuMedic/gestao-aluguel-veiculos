import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Clients from './pages/Clients';
import Rentals from './pages/Rentals';
import Payments from './pages/Payments';
import Maintenance from './pages/Maintenance';
import Inspections from './pages/Inspections';
import Contracts from './pages/Contracts';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/inspections" element={<Inspections />} />
          <Route path="/contracts" element={<Contracts />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
