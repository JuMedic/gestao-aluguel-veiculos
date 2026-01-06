import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InspectionController {
  async create(req: Request, res: Response) {
    try {
      const { vehicleId, rentalId, data, tipo, fotos, observacoes } = req.body;

      const inspection = await prisma.inspection.create({
        data: {
          vehicleId: parseInt(vehicleId),
          rentalId: rentalId ? parseInt(rentalId) : null,
          data: new Date(data),
          tipo,
          fotos: JSON.stringify(fotos || []),
          observacoes,
        },
      });

      return res.status(201).json({
        ...inspection,
        fotos: JSON.parse(inspection.fotos),
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const inspections = await prisma.inspection.findMany({
        include: {
          vehicle: true,
          rental: {
            include: {
              client: true,
            },
          },
        },
        orderBy: { data: 'desc' },
      });

      const inspectionsFormatted = inspections.map((inspection) => ({
        ...inspection,
        fotos: JSON.parse(inspection.fotos),
      }));

      return res.json(inspectionsFormatted);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const inspection = await prisma.inspection.findUnique({
        where: { id: parseInt(id) },
        include: {
          vehicle: true,
          rental: {
            include: {
              client: true,
            },
          },
        },
      });

      if (!inspection) {
        return res.status(404).json({ error: 'Vistoria não encontrada' });
      }

      return res.json({
        ...inspection,
        fotos: JSON.parse(inspection.fotos),
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getByVehicle(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      const inspections = await prisma.inspection.findMany({
        where: { vehicleId: parseInt(vehicleId) },
        include: {
          rental: {
            include: {
              client: true,
            },
          },
        },
        orderBy: { data: 'desc' },
      });

      const inspectionsFormatted = inspections.map((inspection) => ({
        ...inspection,
        fotos: JSON.parse(inspection.fotos),
      }));

      return res.json(inspectionsFormatted);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data, tipo, fotos, observacoes } = req.body;

      const inspection = await prisma.inspection.update({
        where: { id: parseInt(id) },
        data: {
          data: data ? new Date(data) : undefined,
          tipo,
          fotos: fotos ? JSON.stringify(fotos) : undefined,
          observacoes,
        },
      });

      return res.json({
        ...inspection,
        fotos: JSON.parse(inspection.fotos),
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.inspection.delete({
        where: { id: parseInt(id) },
      });
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async uploadFoto(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma foto enviada' });
      }

      // Retornar caminho do arquivo
      const fotoUrl = `/uploads/${req.file.filename}`;
      return res.json({ url: fotoUrl });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
