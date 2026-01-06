import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ClientController {
  async create(req: Request, res: Response) {
    try {
      const { nome, cpf, telefone, email, endereco } = req.body;

      const client = await prisma.client.create({
        data: {
          nome,
          cpf,
          telefone,
          email,
          endereco,
        },
      });

      return res.status(201).json(client);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const clients = await prisma.client.findMany({
        orderBy: { nome: 'asc' },
      });
      return res.json(clients);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const client = await prisma.client.findUnique({
        where: { id: parseInt(id) },
        include: {
          rentals: {
            include: {
              vehicle: true,
              payments: true,
            },
          },
        },
      });

      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      return res.json(client);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, cpf, telefone, email, endereco } = req.body;

      const client = await prisma.client.update({
        where: { id: parseInt(id) },
        data: {
          nome,
          cpf,
          telefone,
          email,
          endereco,
        },
      });

      return res.json(client);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.client.delete({
        where: { id: parseInt(id) },
      });
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
