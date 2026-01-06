import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PaymentService } from '../services/paymentService';
import { calcularValorAtualizado } from '../utils/calculations';

const prisma = new PrismaClient();
const paymentService = new PaymentService();

export class PaymentController {
  async create(req: Request, res: Response) {
    try {
      const { rentalId, valor, dataVencimento } = req.body;

      const payment = await prisma.payment.create({
        data: {
          rentalId: parseInt(rentalId),
          valor: parseFloat(valor),
          dataVencimento: new Date(dataVencimento),
        },
      });

      return res.status(201).json(payment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const payments = await prisma.payment.findMany({
        include: {
          rental: {
            include: {
              client: true,
              vehicle: true,
            },
          },
        },
        orderBy: { dataVencimento: 'asc' },
      });

      // Calcular valores atualizados para pagamentos em atraso
      const paymentsComValorAtualizado = payments.map((payment) => {
        if (payment.status !== 'pago') {
          const valorAtualizado = calcularValorAtualizado(
            payment.valor,
            payment.dataVencimento
          );
          return {
            ...payment,
            valorAtualizado: valorAtualizado.total,
            multaAtualizada: valorAtualizado.multa,
            jurosAtualizados: valorAtualizado.juros,
            diasAtraso: valorAtualizado.diasAtraso,
          };
        }
        return payment;
      });

      return res.json(paymentsComValorAtualizado);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await prisma.payment.findUnique({
        where: { id: parseInt(id) },
        include: {
          rental: {
            include: {
              client: true,
              vehicle: true,
            },
          },
        },
      });

      if (!payment) {
        return res.status(404).json({ error: 'Pagamento não encontrado' });
      }

      // Calcular valor atualizado se não estiver pago
      if (payment.status !== 'pago') {
        const valorAtualizado = calcularValorAtualizado(
          payment.valor,
          payment.dataVencimento
        );
        return res.json({
          ...payment,
          valorAtualizado: valorAtualizado.total,
          multaAtualizada: valorAtualizado.multa,
          jurosAtualizados: valorAtualizado.juros,
          diasAtraso: valorAtualizado.diasAtraso,
        });
      }

      return res.json(payment);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async processar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { valorPago, dataPagamento } = req.body;

      const payment = await paymentService.processarPagamento(
        parseInt(id),
        parseFloat(valorPago),
        new Date(dataPagamento || new Date())
      );

      return res.json(payment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { valor, dataVencimento, status } = req.body;

      const payment = await prisma.payment.update({
        where: { id: parseInt(id) },
        data: {
          valor: valor ? parseFloat(valor) : undefined,
          dataVencimento: dataVencimento ? new Date(dataVencimento) : undefined,
          status,
        },
      });

      return res.json(payment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.payment.delete({
        where: { id: parseInt(id) },
      });
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getProximosVencimento(req: Request, res: Response) {
    try {
      const dias = parseInt(req.query.dias as string) || 7;
      const payments = await paymentService.getPagamentosProximosVencimento(dias);
      return res.json(payments);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async atualizarAtrasados(req: Request, res: Response) {
    try {
      await paymentService.atualizarPagamentosAtrasados();
      return res.json({ message: 'Pagamentos atualizados com sucesso' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
