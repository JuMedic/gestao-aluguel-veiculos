import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MaintenanceController {
  async create(req: Request, res: Response) {
    try {
      const { vehicleId, tipo, categoria, custo, data, descricao, km } = req.body;

      const maintenance = await prisma.maintenance.create({
        data: {
          vehicleId: parseInt(vehicleId),
          tipo,
          categoria,
          custo: parseFloat(custo),
          data: new Date(data),
          descricao,
          km: km ? parseInt(km) : null,
        },
      });

      return res.status(201).json(maintenance);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const maintenances = await prisma.maintenance.findMany({
        include: {
          vehicle: true,
        },
        orderBy: { data: 'desc' },
      });
      return res.json(maintenances);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const maintenance = await prisma.maintenance.findUnique({
        where: { id: parseInt(id) },
        include: {
          vehicle: true,
        },
      });

      if (!maintenance) {
        return res.status(404).json({ error: 'Manutenção não encontrada' });
      }

      return res.json(maintenance);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getByVehicle(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      const maintenances = await prisma.maintenance.findMany({
        where: { vehicleId: parseInt(vehicleId) },
        orderBy: { data: 'desc' },
      });
      return res.json(maintenances);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tipo, categoria, custo, data, descricao, km } = req.body;

      const maintenance = await prisma.maintenance.update({
        where: { id: parseInt(id) },
        data: {
          tipo,
          categoria,
          custo: custo ? parseFloat(custo) : undefined,
          data: data ? new Date(data) : undefined,
          descricao,
          km: km ? parseInt(km) : undefined,
        },
      });

      return res.json(maintenance);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.maintenance.delete({
        where: { id: parseInt(id) },
      });
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getResumoGastos(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      const maintenances = await prisma.maintenance.findMany({
        where: { vehicleId: parseInt(vehicleId) },
      });

      const totalGasto = maintenances.reduce((sum, m) => sum + m.custo, 0);
      const porCategoria = maintenances.reduce((acc: any, m) => {
        if (!acc[m.categoria]) {
          acc[m.categoria] = 0;
        }
        acc[m.categoria] += m.custo;
        return acc;
      }, {});

      return res.json({
        totalGasto,
        porCategoria,
        quantidade: maintenances.length,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
