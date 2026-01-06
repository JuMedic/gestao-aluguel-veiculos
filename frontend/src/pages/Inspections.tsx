import React, { useEffect, useState } from 'react';
import { Plus, Camera } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Form, FormGroup, Input, Select, TextArea, Button } from '../components/Form';
import { inspectionService, vehicleService } from '../services/api';
import { formatDate } from '../utils/formatters';
import type { Inspection, Vehicle } from '../types';

export default function Inspections() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    data: '',
    tipo: 'mensal',
    observacoes: '',
  });
  const [fotos, setFotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [inspectionsRes, vehiclesRes] = await Promise.all([
        inspectionService.getAll(),
        vehicleService.getAll(),
      ]);
      setInspections(inspectionsRes.data);
      setVehicles(vehiclesRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const response = await inspectionService.uploadFoto(files[i]);
        uploadedUrls.push(response.data.url);
      }
      setFotos([...fotos, ...uploadedUrls]);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload das fotos');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await inspectionService.create({
        ...formData,
        vehicleId: Number(formData.vehicleId),
        fotos,
      });
      setIsModalOpen(false);
      setFormData({ vehicleId: '', data: '', tipo: 'mensal', observacoes: '' });
      setFotos([]);
      loadData();
    } catch (error) {
      console.error('Erro ao criar vistoria:', error);
      alert('Erro ao criar vistoria');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Vistorias</h2>
          <p className="text-gray-600">Registro fotográfico dos veículos</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2 inline" />
          Nova Vistoria
        </Button>
      </div>

      <Card title="Histórico de Vistorias">
        <Table headers={['Veículo', 'Data', 'Tipo', 'Fotos', 'Observações']}>
          {inspections.map((inspection) => (
            <tr key={inspection.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {inspection.vehicle?.modelo} - {inspection.vehicle?.placa}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDate(inspection.data)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 capitalize">{inspection.tipo}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 flex items-center">
                  <Camera className="w-4 h-4 mr-1" />
                  {inspection.fotos?.length || 0} fotos
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{inspection.observacoes || '-'}</div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Vistoria" size="lg">
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
          <FormGroup label="Data" required>
            <Input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup label="Tipo" required>
            <Select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              options={[
                { value: 'entrada', label: 'Entrada' },
                { value: 'saida', label: 'Saída' },
                { value: 'mensal', label: 'Mensal' },
              ]}
            />
          </FormGroup>
          <FormGroup label="Fotos">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-gray-500 mt-1">Fazendo upload...</p>}
            {fotos.length > 0 && (
              <p className="text-sm text-green-600 mt-1">{fotos.length} foto(s) enviada(s)</p>
            )}
          </FormGroup>
          <FormGroup label="Observações">
            <TextArea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={3}
            />
          </FormGroup>
          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={uploading}>
              Salvar
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
