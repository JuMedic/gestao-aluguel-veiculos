import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VehicleController {
  async create(req: Request, res: Response) {
    try {
      const { placa, modelo, marca, ano, cor, foto } = req.body;

      const vehicle = await prisma.vehicle.create({
        data: {
          placa,
          modelo,
          marca,
          ano: parseInt(ano),
          cor,
          foto,
        },
      });

      return res.status(201).json(vehicle);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const vehicles = await prisma.vehicle.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.json(vehicles);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: parseInt(id) },
        include: {
          rentals: {
            include: {
              client: true,
            },
          },
          maintenances: true,
          inspections: true,
        },
      });

      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      return res.json(vehicle);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { placa, modelo, marca, ano, cor, foto, status } = req.body;

      const vehicle = await prisma.vehicle.update({
        where: { id: parseInt(id) },
        data: {
          placa,
          modelo,
          marca,
          ano: ano ? parseInt(ano) : undefined,
          cor,
          foto,
          status,
        },
      });

      return res.json(vehicle);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.vehicle.delete({
        where: { id: parseInt(id) },
      });
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAvailable(req: Request, res: Response) {
    try {
      const vehicles = await prisma.vehicle.findMany({
        where: { status: 'disponivel' },
        orderBy: { modelo: 'asc' },
      });
      return res.json(vehicles);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
