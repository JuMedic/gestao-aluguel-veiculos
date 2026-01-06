import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Form, FormGroup, Input, Select, TextArea, Button } from '../components/Form';
import { maintenanceService, vehicleService } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Maintenance, Vehicle } from '../types';

export default function MaintenancePage() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    tipo: 'preventiva',
    categoria: '',
    custo: '',
    data: '',
    descricao: '',
    km: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [maintenancesRes, vehiclesRes] = await Promise.all([
        maintenanceService.getAll(),
        vehicleService.getAll(),
      ]);
      setMaintenances(maintenancesRes.data);
      setVehicles(vehiclesRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await maintenanceService.create({
        ...formData,
        vehicleId: Number(formData.vehicleId),
        tipo: formData.tipo as 'preventiva' | 'corretiva',
        custo: Number(formData.custo),
        km: Number(formData.km),
      });
      setIsModalOpen(false);
      setFormData({
        vehicleId: '',
        tipo: 'preventiva',
        categoria: '',
        custo: '',
        data: '',
        descricao: '',
        km: '',
      });
      loadData();
    } catch (error) {
      console.error('Erro ao criar manutenção:', error);
      alert('Erro ao criar manutenção');
    }
  };

  const totalGasto = maintenances.reduce((sum, m) => sum + m.custo, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Manutenção</h2>
          <p className="text-gray-600">Controle de custos e manutenções</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2 inline" />
          Nova Manutenção
        </Button>
      </div>

      <Card>
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Total Gasto em Manutenção</p>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalGasto)}</p>
          </div>
        </div>
      </Card>

      <Card title="Histórico de Manutenções">
        <Table headers={['Veículo', 'Tipo', 'Categoria', 'Custo', 'Data', 'KM', 'Descrição']}>
          {maintenances.map((maintenance) => (
            <tr key={maintenance.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {maintenance.vehicle?.modelo} - {maintenance.vehicle?.placa}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 capitalize">{maintenance.tipo}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 capitalize">{maintenance.categoria}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(maintenance.custo)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDate(maintenance.data)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{maintenance.km || '-'}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{maintenance.descricao}</div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Manutenção">
        <Form onSubmit={handleSubmit}>
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
          <FormGroup label="Tipo" required>
            <Select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              options={[
                { value: 'preventiva', label: 'Preventiva' },
                { value: 'corretiva', label: 'Corretiva' },
              ]}
            />
          </FormGroup>
          <FormGroup label="Categoria" required>
            <Input
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              placeholder="Ex: Troca de óleo, Pneus, Freios..."
              required
            />
          </FormGroup>
          <FormGroup label="Custo" required>
            <Input
              type="number"
              step="0.01"
              value={formData.custo}
              onChange={(e) => setFormData({ ...formData, custo: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup label="Data" required>
            <Input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup label="Quilometragem">
            <Input
              type="number"
              value={formData.km}
              onChange={(e) => setFormData({ ...formData, km: e.target.value })}
            />
          </FormGroup>
          <FormGroup label="Descrição" required>
            <TextArea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
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
