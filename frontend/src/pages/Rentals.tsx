import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Form, FormGroup, Input, Select, Button } from '../components/Form';
import { rentalService, vehicleService, clientService } from '../services/api';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../utils/formatters';
import type { Rental, Vehicle, Client } from '../types';

export default function Rentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    clientId: '',
    dataInicio: '',
    dataFim: '',
    valorDiaria: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rentalsRes, vehiclesRes, clientsRes] = await Promise.all([
        rentalService.getAll(),
        vehicleService.getAvailable(),
        clientService.getAll(),
      ]);
      setRentals(rentalsRes.data);
      setVehicles(vehiclesRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await rentalService.create({
        ...formData,
        vehicleId: Number(formData.vehicleId),
        clientId: Number(formData.clientId),
        valorDiaria: Number(formData.valorDiaria),
      });
      setIsModalOpen(false);
      setFormData({ vehicleId: '', clientId: '', dataInicio: '', dataFim: '', valorDiaria: '' });
      loadData();
    } catch (error) {
      console.error('Erro ao criar aluguel:', error);
      alert('Erro ao criar aluguel');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Aluguéis</h2>
          <p className="text-gray-600">Gerencie os contratos de aluguel</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2 inline" />
          Novo Aluguel
        </Button>
      </div>

      <Card>
        <Table headers={['Cliente', 'Veículo', 'Início', 'Fim', 'Valor Total', 'Status']}>
          {rentals.map((rental) => (
            <tr key={rental.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{rental.client?.nome}</div>
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
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    rental.status
                  )}`}
                >
                  {getStatusLabel(rental.status)}
                </span>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Aluguel">
        <Form onSubmit={handleSubmit}>
          <FormGroup label="Cliente" required>
            <Select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              options={[
                { value: '', label: 'Selecione...' },
                ...clients.map((c) => ({ value: c.id, label: c.nome })),
              ]}
              required
            />
          </FormGroup>
          <FormGroup label="Veículo" required>
            <Select
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              options={[
                { value: '', label: 'Selecione...' },
                ...vehicles.map((v) => ({ value: v.id, label: `${v.modelo} - ${v.placa}` })),
              ]}
              required
            />
          </FormGroup>
          <FormGroup label="Data Início" required>
            <Input
              type="date"
              value={formData.dataInicio}
              onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup label="Data Fim" required>
            <Input
              type="date"
              value={formData.dataFim}
              onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup label="Valor da Diária" required>
            <Input
              type="number"
              step="0.01"
              value={formData.valorDiaria}
              onChange={(e) => setFormData({ ...formData, valorDiaria: e.target.value })}
              required
            />
          </FormGroup>
          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
