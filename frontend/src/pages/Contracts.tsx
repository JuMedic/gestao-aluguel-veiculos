import React, { useEffect, useState } from 'react';
import { FileText, Download } from 'lucide-react';
import Card from '../components/Card';
import { Form, FormGroup, Input, Select, Button } from '../components/Form';
import { vehicleService, clientService, contractService } from '../services/api';
import { formatDateInput } from '../utils/formatters';
import type { Vehicle, Client } from '../types';

export default function Contracts() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
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
      const [vehiclesRes, clientsRes] = await Promise.all([
        vehicleService.getAll(),
        clientService.getAll(),
      ]);
      setVehicles(vehiclesRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const calcularValorTotal = () => {
    if (!formData.dataInicio || !formData.dataFim || !formData.valorDiaria) return 0;
    
    const inicio = new Date(formData.dataInicio);
    const fim = new Date(formData.dataFim);
    const dias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    
    return parseFloat(formData.valorDiaria) * Math.max(1, dias);
  };

  const handleGenerateContract = async () => {
    if (!selectedVehicle || !selectedClient) {
      alert('Selecione um veículo e um cliente');
      return;
    }

    if (!formData.dataInicio || !formData.dataFim || !formData.valorDiaria) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      const contractData = {
        cliente: {
          nome: selectedClient.nome,
          cpf: selectedClient.cpf,
          telefone: selectedClient.telefone,
          endereco: selectedClient.endereco,
        },
        veiculo: {
          placa: selectedVehicle.placa,
          modelo: selectedVehicle.modelo,
          marca: selectedVehicle.marca,
          ano: selectedVehicle.ano,
          cor: selectedVehicle.cor,
        },
        aluguel: {
          dataInicio: new Date(formData.dataInicio),
          dataFim: new Date(formData.dataFim),
          valorDiaria: parseFloat(formData.valorDiaria),
          valorTotal: calcularValorTotal(),
        },
      };

      const response = await contractService.generate(contractData);
      
      // Sanitize filename to prevent path traversal attacks
      const sanitizedName = selectedClient.nome
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase();
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contrato-${sanitizedName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
      alert('Erro ao gerar contrato');
    }
  };

  const handleVehicleChange = (vehicleId: string) => {
    setFormData({ ...formData, vehicleId });
    const vehicle = vehicles.find((v) => v.id === parseInt(vehicleId));
    setSelectedVehicle(vehicle || null);
  };

  const handleClientChange = (clientId: string) => {
    setFormData({ ...formData, clientId });
    const client = clients.find((c) => c.id === parseInt(clientId));
    setSelectedClient(client || null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Contratos</h2>
        <p className="text-gray-600">Geração de contratos de aluguel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Dados do Contrato">
          <Form onSubmit={(e) => { e.preventDefault(); handleGenerateContract(); }}>
            <FormGroup label="Cliente" required>
              <Select
                value={formData.clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                options={[
                  { value: '', label: 'Selecione um cliente...' },
                  ...clients.map((c) => ({ value: c.id, label: c.nome })),
                ]}
                required
              />
            </FormGroup>

            <FormGroup label="Veículo" required>
              <Select
                value={formData.vehicleId}
                onChange={(e) => handleVehicleChange(e.target.value)}
                options={[
                  { value: '', label: 'Selecione um veículo...' },
                  ...vehicles.map((v) => ({ 
                    value: v.id, 
                    label: `${v.marca} ${v.modelo} - ${v.placa}` 
                  })),
                ]}
                required
              />
            </FormGroup>

            <FormGroup label="Data de Início" required>
              <Input
                type="date"
                value={formData.dataInicio}
                onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup label="Data de Término" required>
              <Input
                type="date"
                value={formData.dataFim}
                onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup label="Valor da Diária (R$)" required>
              <Input
                type="number"
                step="0.01"
                value={formData.valorDiaria}
                onChange={(e) => setFormData({ ...formData, valorDiaria: e.target.value })}
                placeholder="0.00"
                required
              />
            </FormGroup>

            {formData.valorDiaria && formData.dataInicio && formData.dataFim && (
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {calcularValorTotal().toFixed(2)}
                </p>
              </div>
            )}

            <Button type="submit" className="w-full mt-4">
              <Download className="w-5 h-5 mr-2 inline" />
              Gerar Contrato PDF
            </Button>
          </Form>
        </Card>

        <div className="space-y-6">
          {selectedClient && (
            <Card title="Dados do Cliente">
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium">{selectedClient.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CPF</p>
                  <p className="font-medium">{selectedClient.cpf}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">{selectedClient.telefone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="font-medium">{selectedClient.endereco}</p>
                </div>
              </div>
            </Card>
          )}

          {selectedVehicle && (
            <Card title="Dados do Veículo">
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Marca/Modelo</p>
                  <p className="font-medium">{selectedVehicle.marca} {selectedVehicle.modelo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Placa</p>
                  <p className="font-medium">{selectedVehicle.placa}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ano</p>
                  <p className="font-medium">{selectedVehicle.ano}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cor</p>
                  <p className="font-medium">{selectedVehicle.cor}</p>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <div className="flex items-center text-blue-600">
              <FileText className="w-12 h-12 mr-4" />
              <div>
                <p className="font-medium">Informações do Contrato</p>
                <p className="text-sm text-gray-600">
                  Preencha os dados acima para gerar um contrato em PDF
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
