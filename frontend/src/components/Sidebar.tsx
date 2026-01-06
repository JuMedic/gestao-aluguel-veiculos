import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Users,
  FileText,
  CreditCard,
  Wrench,
  Camera,
  FileCheck,
  X,
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/vehicles', icon: Car, label: 'Veículos' },
  { path: '/clients', icon: Users, label: 'Clientes' },
  { path: '/rentals', icon: FileText, label: 'Aluguéis' },
  { path: '/payments', icon: CreditCard, label: 'Pagamentos' },
  { path: '/maintenance', icon: Wrench, label: 'Manutenção' },
  { path: '/inspections', icon: Camera, label: 'Vistorias' },
  { path: '/contracts', icon: FileCheck, label: 'Contratos' },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="w-8 h-8 text-primary-400" />
            <div>
              <h2 className="text-xl font-bold">AutoGest</h2>
              <p className="text-xs text-gray-400">Gestão de Veículos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white border-l-4 border-primary-400'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
