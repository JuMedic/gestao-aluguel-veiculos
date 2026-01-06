import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { calcularValorTotalAluguel } from '../utils/calculations';

const prisma = new PrismaClient();

export class RentalController {
  async create(req: Request, res: Response) {
    try {
      const { vehicleId, clientId, dataInicio, dataFim, valorDiaria } = req.body;

      const valorTotal = calcularValorTotalAluguel(
        parseFloat(valorDiaria),
        new Date(dataInicio),
        new Date(dataFim)
      );

      const rental = await prisma.rental.create({
        data: {
          vehicleId: parseInt(vehicleId),
          clientId: parseInt(clientId),
          dataInicio: new Date(dataInicio),
          dataFim: new Date(dataFim),
          valorDiaria: parseFloat(valorDiaria),
          valorTotal,
        },
      });

      // Atualizar status do veículo
      await prisma.vehicle.update({
        where: { id: parseInt(vehicleId) },
        data: { status: 'alugado' },
      });

      return res.status(201).json(rental);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const rentals = await prisma.rental.findMany({
        include: {
          vehicle: true,
          client: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return res.json(rentals);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rental = await prisma.rental.findUnique({
        where: { id: parseInt(id) },
        include: {
          vehicle: true,
          client: true,
          payments: true,
          inspections: true,
        },
      });

      if (!rental) {
        return res.status(404).json({ error: 'Aluguel não encontrado' });
      }

      return res.json(rental);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { dataInicio, dataFim, valorDiaria, status } = req.body;

      let updateData: any = { status };

      if (dataInicio && dataFim && valorDiaria) {
        const valorTotal = calcularValorTotalAluguel(
          parseFloat(valorDiaria),
          new Date(dataInicio),
          new Date(dataFim)
        );

        updateData = {
          ...updateData,
          dataInicio: new Date(dataInicio),
          dataFim: new Date(dataFim),
          valorDiaria: parseFloat(valorDiaria),
          valorTotal,
        };
      }

      const rental = await prisma.rental.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      // Se o aluguel foi finalizado, liberar o veículo
      if (status === 'finalizado') {
        await prisma.vehicle.update({
          where: { id: rental.vehicleId },
          data: { status: 'disponivel' },
        });
      }

      return res.json(rental);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rental = await prisma.rental.findUnique({
        where: { id: parseInt(id) },
      });

      if (rental) {
        // Liberar o veículo
        await prisma.vehicle.update({
          where: { id: rental.vehicleId },
          data: { status: 'disponivel' },
        });
      }

      await prisma.rental.delete({
        where: { id: parseInt(id) },
      });

      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getActive(req: Request, res: Response) {
    try {
      const rentals = await prisma.rental.findMany({
        where: { status: 'ativo' },
        include: {
          vehicle: true,
          client: true,
          payments: true,
        },
        orderBy: { dataFim: 'asc' },
      });
      return res.json(rentals);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
