import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { VehicleController } from '../controllers/vehicleController';
import { ClientController } from '../controllers/clientController';
import { RentalController } from '../controllers/rentalController';
import { PaymentController } from '../controllers/paymentController';
import { MaintenanceController } from '../controllers/maintenanceController';
import { InspectionController } from '../controllers/inspectionController';
import { PDFService } from '../services/pdfService';

const router = Router();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'));
    }
  },
});

// Instanciar controllers
const vehicleController = new VehicleController();
const clientController = new ClientController();
const rentalController = new RentalController();
const paymentController = new PaymentController();
const maintenanceController = new MaintenanceController();
const inspectionController = new InspectionController();
const pdfService = new PDFService();

// Rotas de Veículos
router.post('/vehicles', vehicleController.create.bind(vehicleController));
router.get('/vehicles', vehicleController.getAll.bind(vehicleController));
router.get('/vehicles/available', vehicleController.getAvailable.bind(vehicleController));
router.get('/vehicles/:id', vehicleController.getById.bind(vehicleController));
router.put('/vehicles/:id', vehicleController.update.bind(vehicleController));
router.delete('/vehicles/:id', vehicleController.delete.bind(vehicleController));

// Rotas de Clientes
router.post('/clients', clientController.create.bind(clientController));
router.get('/clients', clientController.getAll.bind(clientController));
router.get('/clients/:id', clientController.getById.bind(clientController));
router.put('/clients/:id', clientController.update.bind(clientController));
router.delete('/clients/:id', clientController.delete.bind(clientController));

// Rotas de Aluguéis
router.post('/rentals', rentalController.create.bind(rentalController));
router.get('/rentals', rentalController.getAll.bind(rentalController));
router.get('/rentals/active', rentalController.getActive.bind(rentalController));
router.get('/rentals/:id', rentalController.getById.bind(rentalController));
router.put('/rentals/:id', rentalController.update.bind(rentalController));
router.delete('/rentals/:id', rentalController.delete.bind(rentalController));

// Rotas de Pagamentos
router.post('/payments', paymentController.create.bind(paymentController));
router.get('/payments', paymentController.getAll.bind(paymentController));
router.get('/payments/proximos-vencimento', paymentController.getProximosVencimento.bind(paymentController));
router.get('/payments/:id', paymentController.getById.bind(paymentController));
router.put('/payments/:id', paymentController.update.bind(paymentController));
router.post('/payments/:id/processar', paymentController.processar.bind(paymentController));
router.post('/payments/atualizar-atrasados', paymentController.atualizarAtrasados.bind(paymentController));
router.delete('/payments/:id', paymentController.delete.bind(paymentController));

// Rotas de Manutenção
router.post('/maintenances', maintenanceController.create.bind(maintenanceController));
router.get('/maintenances', maintenanceController.getAll.bind(maintenanceController));
router.get('/maintenances/vehicle/:vehicleId', maintenanceController.getByVehicle.bind(maintenanceController));
router.get('/maintenances/vehicle/:vehicleId/resumo', maintenanceController.getResumoGastos.bind(maintenanceController));
router.get('/maintenances/:id', maintenanceController.getById.bind(maintenanceController));
router.put('/maintenances/:id', maintenanceController.update.bind(maintenanceController));
router.delete('/maintenances/:id', maintenanceController.delete.bind(maintenanceController));

// Rotas de Vistoria
router.post('/inspections', inspectionController.create.bind(inspectionController));
router.get('/inspections', inspectionController.getAll.bind(inspectionController));
router.get('/inspections/vehicle/:vehicleId', inspectionController.getByVehicle.bind(inspectionController));
router.get('/inspections/:id', inspectionController.getById.bind(inspectionController));
router.put('/inspections/:id', inspectionController.update.bind(inspectionController));
router.delete('/inspections/:id', inspectionController.delete.bind(inspectionController));
router.post('/inspections/upload', upload.single('foto'), inspectionController.uploadFoto.bind(inspectionController));

// Rota de Geração de Contrato
router.post('/contracts/generate', async (req, res) => {
  try {
    const pdf = pdfService.gerarContrato(req.body);
    const pdfBuffer = pdf.output('arraybuffer');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=contrato.pdf');
    res.send(Buffer.from(pdfBuffer));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
