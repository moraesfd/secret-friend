export interface Participante {
  nome: string;
  email: string;
}

export interface ResultadoSorteio {
  participante: string;
  participanteEmail: string;
  amigoSecreto: string;
  amigoSecretoEmail: string;
}

export interface Sorteio {
  data: string;
  resultados: ResultadoSorteio[];
}