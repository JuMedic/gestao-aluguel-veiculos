export interface ValorAtualizado {
  multa: number;
  juros: number;
  total: number;
  diasAtraso: number;
}

export function calcularValorAtualizado(
  valorOriginal: number,
  dataVencimento: string | Date
): ValorAtualizado {
  const hoje = new Date();
  const vencimento = new Date(dataVencimento);
  const diasAtraso = Math.floor(
    (hoje.getTime() - vencimento.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diasAtraso <= 0) {
    return { multa: 0, juros: 0, total: valorOriginal, diasAtraso: 0 };
  }

  const multa = valorOriginal * 0.02; // 2%
  const juros = valorOriginal * 0.00033 * diasAtraso; // 0,033% ao dia
  const total = valorOriginal + multa + juros;

  return { multa, juros, total, diasAtraso };
}

export function calcularValorTotalAluguel(
  valorDiaria: number,
  dataInicio: string | Date,
  dataFim: string | Date
): number {
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  const dias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
  return valorDiaria * Math.max(1, dias);
}

export function isVencido(dataVencimento: string | Date): boolean {
  return new Date(dataVencimento) < new Date();
}

export function diasParaVencimento(dataVencimento: string | Date): number {
  const hoje = new Date();
  const vencimento = new Date(dataVencimento);
  return Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}
