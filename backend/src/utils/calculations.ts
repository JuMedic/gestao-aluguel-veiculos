export interface ValorAtualizado {
  multa: number;
  juros: number;
  total: number;
  diasAtraso: number;
}

export function calcularValorAtualizado(
  valorOriginal: number,
  dataVencimento: Date
): ValorAtualizado {
  const hoje = new Date();
  const diasAtraso = Math.floor(
    (hoje.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24)
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
  dataInicio: Date,
  dataFim: Date
): number {
  const dias = Math.ceil(
    (dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)
  );
  return valorDiaria * Math.max(1, dias);
}
