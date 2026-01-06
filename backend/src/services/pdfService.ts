import jsPDF from 'jspdf';

export interface ContratoData {
  cliente: {
    nome: string;
    cpf: string;
    telefone: string;
    endereco: string;
  };
  veiculo: {
    placa: string;
    modelo: string;
    marca: string;
    ano: number;
    cor: string;
  };
  aluguel: {
    dataInicio: Date;
    dataFim: Date;
    valorDiaria: number;
    valorTotal: number;
  };
}

export class PDFService {
  gerarContrato(data: ContratoData): jsPDF {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text('CONTRATO DE ALUGUEL DE VEÍCULO', 105, 20, { align: 'center' });

    // Dados do Cliente
    doc.setFontSize(14);
    doc.text('LOCATÁRIO', 20, 40);
    doc.setFontSize(11);
    doc.text(`Nome: ${data.cliente.nome}`, 20, 50);
    doc.text(`CPF: ${data.cliente.cpf}`, 20, 57);
    doc.text(`Telefone: ${data.cliente.telefone}`, 20, 64);
    doc.text(`Endereço: ${data.cliente.endereco}`, 20, 71);

    // Dados do Veículo
    doc.setFontSize(14);
    doc.text('VEÍCULO', 20, 90);
    doc.setFontSize(11);
    doc.text(`Marca: ${data.veiculo.marca}`, 20, 100);
    doc.text(`Modelo: ${data.veiculo.modelo}`, 20, 107);
    doc.text(`Placa: ${data.veiculo.placa}`, 20, 114);
    doc.text(`Ano: ${data.veiculo.ano}`, 20, 121);
    doc.text(`Cor: ${data.veiculo.cor}`, 20, 128);

    // Dados do Aluguel
    doc.setFontSize(14);
    doc.text('CONDIÇÕES DO ALUGUEL', 20, 147);
    doc.setFontSize(11);
    doc.text(
      `Data de Início: ${this.formatarData(data.aluguel.dataInicio)}`,
      20,
      157
    );
    doc.text(`Data de Término: ${this.formatarData(data.aluguel.dataFim)}`, 20, 164);
    doc.text(
      `Valor da Diária: ${this.formatarMoeda(data.aluguel.valorDiaria)}`,
      20,
      171
    );
    doc.text(
      `Valor Total: ${this.formatarMoeda(data.aluguel.valorTotal)}`,
      20,
      178
    );

    // Cláusulas
    doc.setFontSize(14);
    doc.text('CLÁUSULAS', 20, 197);
    doc.setFontSize(10);
    const clausulas = [
      '1. O locatário se compromete a devolver o veículo nas mesmas condições em que o recebeu.',
      '2. Qualquer dano causado ao veículo será de responsabilidade do locatário.',
      '3. O pagamento deve ser realizado nas datas acordadas.',
      '4. Em caso de atraso no pagamento, será cobrada multa de 2% e juros de 0,033% ao dia.',
      '5. O veículo não pode ser utilizado para fins ilícitos ou fora do território nacional.',
    ];

    let yPos = 207;
    clausulas.forEach((clausula) => {
      const lines = doc.splitTextToSize(clausula, 170);
      doc.text(lines, 20, yPos);
      yPos += lines.length * 5 + 2;
    });

    // Assinaturas
    yPos += 10;
    doc.setFontSize(11);
    doc.text('_________________________________', 20, yPos);
    doc.text('Locador', 20, yPos + 7);

    doc.text('_________________________________', 120, yPos);
    doc.text('Locatário', 120, yPos + 7);

    return doc;
  }

  private formatarData(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(data));
  }

  private formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }
}
