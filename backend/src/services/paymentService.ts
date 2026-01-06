import { PrismaClient } from '@prisma/client';
import { calcularValorAtualizado } from '../utils/calculations';

const prisma = new PrismaClient();

export class PaymentService {
  async atualizarPagamentosAtrasados() {
    const pagamentosPendentes = await prisma.payment.findMany({
      where: {
        status: {
          in: ['pendente', 'parcial'],
        },
      },
    });

    const hoje = new Date();

    for (const pagamento of pagamentosPendentes) {
      if (pagamento.dataVencimento < hoje) {
        const { multa, juros, total } = calcularValorAtualizado(
          pagamento.valor,
          pagamento.dataVencimento
        );

        await prisma.payment.update({
          where: { id: pagamento.id },
          data: {
            status: 'atrasado',
            multa,
            juros,
          },
        });
      }
    }
  }

  async processarPagamento(
    paymentId: number,
    valorPago: number,
    dataPagamento: Date
  ) {
    const pagamento = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!pagamento) {
      throw new Error('Pagamento não encontrado');
    }

    const { total } = calcularValorAtualizado(
      pagamento.valor,
      pagamento.dataVencimento
    );

    const novoValorPago = pagamento.valorPago + valorPago;
    let status = 'parcial';

    if (novoValorPago >= total) {
      status = 'pago';
    }

    return await prisma.payment.update({
      where: { id: paymentId },
      data: {
        valorPago: novoValorPago,
        dataPagamento: status === 'pago' ? dataPagamento : pagamento.dataPagamento,
        status,
      },
    });
  }

  async getPagamentosProximosVencimento(dias: number = 7) {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + dias);

    return await prisma.payment.findMany({
      where: {
        dataVencimento: {
          lte: dataLimite,
        },
        status: {
          in: ['pendente', 'parcial'],
        },
      },
      include: {
        rental: {
          include: {
            client: true,
            vehicle: true,
          },
        },
      },
      orderBy: {
        dataVencimento: 'asc',
      },
    });
  }
}
