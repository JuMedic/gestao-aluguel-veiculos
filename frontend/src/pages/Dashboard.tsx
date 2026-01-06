import { useEffect, useState } from 'react';
import { Car, Users, FileText, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import { vehicleService, clientService, rentalService, paymentService } from '../services/api';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../utils/formatters';
import type { Vehicle, Client, Rental, Payment } from '../types';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [vehiclesRes, clientsRes, rentalsRes, paymentsRes] = await Promise.all([
        vehicleService.getAll(),
        clientService.getAll(),
        rentalService.getActive(),
        paymentService.getProximosVencimento(7),
      ]);

      setVehicles(vehiclesRes.data);
      setClients(clientsRes.data);
      setRentals(rentalsRes.data);
      setPayments(paymentsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalVehicles: vehicles.length,
    vehiclesRented: vehicles.filter((v) => v.status === 'alugado').length,
    vehiclesAvailable: vehicles.filter((v) => v.status === 'disponivel').length,
    totalClients: clients.length,
    activeRentals: rentals.length,
    pendingPayments: payments.length,
  };

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <Card>
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Visão geral do sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Car}
          title="Total de Veículos"
          value={stats.totalVehicles}
          color="bg-blue-500"
        />
        <StatCard
          icon={Car}
          title="Veículos Alugados"
          value={stats.vehiclesRented}
          color="bg-green-500"
        />
        <StatCard
          icon={Car}
          title="Veículos Disponíveis"
          value={stats.vehiclesAvailable}
          color="bg-yellow-500"
        />
        <StatCard
          icon={Users}
          title="Total de Clientes"
          value={stats.totalClients}
          color="bg-purple-500"
        />
        <StatCard
          icon={FileText}
          title="Aluguéis Ativos"
          value={stats.activeRentals}
          color="bg-indigo-500"
        />
        <StatCard
          icon={AlertCircle}
          title="Pagamentos Próximos"
          value={stats.pendingPayments}
          color="bg-red-500"
        />
      </div>

      {/* Notificações de Vencimento */}
      {payments.length > 0 && (
        <Card title="Pagamentos Próximos do Vencimento" subtitle="Próximos 7 dias">
          <Table headers={['Cliente', 'Veículo', 'Valor', 'Vencimento', 'Status']}>
            {payments.slice(0, 5).map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {payment.rental?.client?.nome}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {payment.rental?.vehicle?.modelo} - {payment.rental?.vehicle?.placa}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(payment.valorAtualizado || payment.valor)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(payment.dataVencimento)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      payment.status
                    )}`}
                  >
                    {getStatusLabel(payment.status)}
                  </span>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Aluguéis Ativos */}
      {rentals.length > 0 && (
        <Card title="Aluguéis Ativos" subtitle="Contratos em andamento">
          <Table headers={['Cliente', 'Veículo', 'Data Início', 'Data Fim', 'Valor Total']}>
            {rentals.slice(0, 5).map((rental) => (
              <tr key={rental.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {rental.client?.nome}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {rental.vehicle?.modelo} - {rental.vehicle?.placa}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(rental.dataInicio)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(rental.dataFim)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(rental.valorTotal)}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
    </div>
  );
}
