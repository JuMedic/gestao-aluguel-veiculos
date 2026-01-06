import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Form, FormGroup, Input, Select, Button } from '../components/Form';
import { vehicleService } from '../services/api';
import { getStatusColor, getStatusLabel } from '../utils/formatters';
import type { Vehicle } from '../types';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    marca: '',
    ano: '',
    cor: '',
    status: 'disponivel',
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const response = await vehicleService.getAll();
      setVehicles(response.data);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await vehicleService.update(editingVehicle.id, {
          ...formData,
          ano: Number(formData.ano),
          status: formData.status as 'disponivel' | 'alugado' | 'manutencao',
        });
      } else {
        await vehicleService.create({
          ...formData,
          ano: Number(formData.ano),
          status: formData.status as 'disponivel' | 'alugado' | 'manutencao',
        });
      }
      setIsModalOpen(false);
      resetForm();
      loadVehicles();
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      alert('Erro ao salvar veículo');
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      placa: vehicle.placa,
      modelo: vehicle.modelo,
      marca: vehicle.marca,
      ano: vehicle.ano.toString(),
      cor: vehicle.cor,
      status: vehicle.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        await vehicleService.delete(id);
        loadVehicles();
      } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        alert('Erro ao excluir veículo');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      placa: '',
      modelo: '',
      marca: '',
      ano: '',
      cor: '',
      status: 'disponivel',
    });
    setEditingVehicle(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Veículos</h2>
          <p className="text-gray-600">Gerencie sua frota de veículos</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2 inline" />
          Novo Veículo
        </Button>
      </div>

      <Card>
        <Table headers={['Placa', 'Marca', 'Modelo', 'Ano', 'Cor', 'Status', 'Ações']}>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{vehicle.placa}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{vehicle.marca}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{vehicle.modelo}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{vehicle.ano}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{vehicle.cor}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    vehicle.status
                  )}`}
                >
                  {getStatusLabel(vehicle.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="text-primary-600 hover:text-primary-900 mr-3"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup label="Placa" required>
            <Input
              value={formData.placa}
              onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
              placeholder="ABC-1234"
              required
            />
          </FormGroup>

          <FormGroup label="Marca" required>
            <Input
              value={formData.marca}
              onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              placeholder="Ex: Toyota"
              required
            />
          </FormGroup>

          <FormGroup label="Modelo" required>
            <Input
              value={formData.modelo}
              onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
              placeholder="Ex: Corolla"
              required
            />
          </FormGroup>

          <FormGroup label="Ano" required>
            <Input
              type="number"
              value={formData.ano}
              onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
              placeholder="2024"
              required
            />
          </FormGroup>

          <FormGroup label="Cor" required>
            <Input
              value={formData.cor}
              onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
              placeholder="Ex: Preto"
              required
            />
          </FormGroup>

          <FormGroup label="Status" required>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'disponivel', label: 'Disponível' },
                { value: 'alugado', label: 'Alugado' },
                { value: 'manutencao', label: 'Manutenção' },
              ]}
            />
          </FormGroup>

          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
