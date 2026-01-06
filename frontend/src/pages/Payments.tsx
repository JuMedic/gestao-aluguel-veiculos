import { useEffect, useState } from 'react';
import { DollarSign, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Form, FormGroup, Input, Button } from '../components/Form';
import { paymentService } from '../services/api';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../utils/formatters';
import type { Payment } from '../types';

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valorPago, setValorPago] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await paymentService.getAll();
      setPayments(response.data);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
    }
  };

  const handleProcessarPagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;

    try {
      await paymentService.processar(selectedPayment.id, parseFloat(valorPago));
      setIsModalOpen(false);
      setValorPago('');
      setSelectedPayment(null);
      loadPayments();
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento');
    }
  };

  const openPaymentModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const pendentes = payments.filter((p) => p.status === 'pendente' || p.status === 'parcial');
  const atrasados = payments.filter((p) => p.status === 'atrasado');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Pagamentos</h2>
        <p className="text-gray-600">Controle de pagamentos e cobranças</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pagamentos Pendentes</p>
              <p className="text-2xl font-semibold text-gray-900">{pendentes.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pagamentos Atrasados</p>
              <p className="text-2xl font-semibold text-gray-900">{atrasados.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Todos os Pagamentos">
        <Table headers={['Cliente', 'Valor Original', 'Multa', 'Juros', 'Total', 'Vencimento', 'Status', 'Ação']}>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {payment.rental?.client?.nome}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatCurrency(payment.valor)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-red-600">
                  {payment.multaAtualizada !== undefined
                    ? formatCurrency(payment.multaAtualizada)
                    : formatCurrency(payment.multa)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-red-600">
                  {payment.jurosAtualizados !== undefined
                    ? formatCurrency(payment.jurosAtualizados)
                    : formatCurrency(payment.juros)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {payment.valorAtualizado !== undefined
                    ? formatCurrency(payment.valorAtualizado)
                    : formatCurrency(payment.valor)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDate(payment.dataVencimento)}</div>
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
              <td className="px-6 py-4 whitespace-nowrap">
                {payment.status !== 'pago' && (
                  <Button size="sm" onClick={() => openPaymentModal(payment)}>
                    Processar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setValorPago('');
          setSelectedPayment(null);
        }}
        title="Processar Pagamento"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">Cliente</p>
              <p className="font-medium">{selectedPayment.rental?.client?.nome}</p>
              <p className="text-sm text-gray-600 mt-2">Valor Total</p>
              <p className="font-medium text-lg">
                {formatCurrency(selectedPayment.valorAtualizado || selectedPayment.valor)}
              </p>
              {selectedPayment.diasAtraso && selectedPayment.diasAtraso > 0 && (
                <p className="text-sm text-red-600 mt-2">
                  {selectedPayment.diasAtraso} dia(s) de atraso
                </p>
              )}
            </div>

            <Form onSubmit={handleProcessarPagamento}>
              <FormGroup label="Valor Pago" required>
                <Input
                  type="number"
                  step="0.01"
                  value={valorPago}
                  onChange={(e) => setValorPago(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </FormGroup>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                    setValorPago('');
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Confirmar Pagamento</Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
}
