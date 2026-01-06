export interface Vehicle {
  id: number;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  cor: string;
  foto?: string;
  status: 'disponivel' | 'alugado' | 'manutencao';
  createdAt: string;
  updatedAt: string;
  rentals?: Rental[];
  maintenances?: Maintenance[];
  inspections?: Inspection[];
}

export interface Client {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
  endereco: string;
  createdAt: string;
  updatedAt: string;
  rentals?: Rental[];
}

export interface Rental {
  id: number;
  vehicleId: number;
  clientId: number;
  dataInicio: string;
  dataFim: string;
  valorDiaria: number;
  valorTotal: number;
  status: 'ativo' | 'finalizado' | 'cancelado';
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
  client?: Client;
  payments?: Payment[];
  inspections?: Inspection[];
}

export interface Payment {
  id: number;
  rentalId: number;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'pendente' | 'pago' | 'parcial' | 'atrasado';
  multa: number;
  juros: number;
  valorPago: number;
  createdAt: string;
  updatedAt: string;
  rental?: Rental;
  valorAtualizado?: number;
  multaAtualizada?: number;
  jurosAtualizados?: number;
  diasAtraso?: number;
}

export interface Maintenance {
  id: number;
  vehicleId: number;
  tipo: 'preventiva' | 'corretiva';
  categoria: string;
  custo: number;
  data: string;
  descricao: string;
  km?: number;
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
}

export interface Inspection {
  id: number;
  vehicleId: number;
  rentalId?: number;
  data: string;
  tipo: 'entrada' | 'saida' | 'mensal';
  fotos: string[];
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
  rental?: Rental;
}

export interface DashboardStats {
  totalVehicles: number;
  vehiclesRented: number;
  vehiclesAvailable: number;
  totalClients: number;
  activeRentals: number;
  pendingPayments: number;
  overduePayments: number;
  monthlyRevenue: number;
}
