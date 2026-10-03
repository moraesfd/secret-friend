import type { Participante, ResultadoSorteio } from "../../@types";

export interface RegraSorteio {
  participante1Email: string;
  participante2Email: string;
}

export const adicionarRegraSorteio = (
  regras: RegraSorteio[],
  participante1Email: string,
  participante2Email: string
): RegraSorteio[] | null => {
  const primeiroEmail = participante1Email.trim().toLowerCase();
  const segundoEmail = participante2Email.trim().toLowerCase();
  if (!primeiroEmail || !segundoEmail || primeiroEmail === segundoEmail) {
    return null;
  }

  const duplicada = regras.some((regra) => {
    const email1 = regra.participante1Email.trim().toLowerCase();
    const email2 = regra.participante2Email.trim().toLowerCase();
    return email1 === primeiroEmail && email2 === segundoEmail;
  });

  if (duplicada) return null;
  return [...regras, { participante1Email, participante2Email }];
};

export const removerRegrasDoParticipante = (
  regras: RegraSorteio[],
  participanteEmail: string
): RegraSorteio[] => {
  const emailRemovido = participanteEmail.trim().toLowerCase();
  return regras.filter(
    (regra) =>
      regra.participante1Email.trim().toLowerCase() !== emailRemovido &&
      regra.participante2Email.trim().toLowerCase() !== emailRemovido
  );
};

export const realizarSorteio = (
  participantes: Participante[],
  regras: RegraSorteio[] = []
): ResultadoSorteio[] | null => {
  if (participantes.length < 3) return null;

  const normalizarEmail = (email: string) => email.trim().toLowerCase();
  const participantesPorEmail = new Map(
    participantes.map((participante) => [
      normalizarEmail(participante.email),
      participante,
    ])
  );

  if (participantesPorEmail.size !== participantes.length) return null;

  const chaveDirecional = (remetenteEmail: string, destinatarioEmail: string) =>
    `${normalizarEmail(remetenteEmail)}\u0000${normalizarEmail(destinatarioEmail)}`;
  const paresProibidos = new Set(
    regras.map((regra) =>
      chaveDirecional(regra.participante1Email, regra.participante2Email)
    )
  );
  const embaralhar = <T,>(itens: T[]): T[] => {
    const resultado = [...itens];
    for (let indice = resultado.length - 1; indice > 0; indice -= 1) {
      const outroIndice = Math.floor(Math.random() * (indice + 1));
      [resultado[indice], resultado[outroIndice]] = [
        resultado[outroIndice],
        resultado[indice],
      ];
    }
    return resultado;
  };

  const emails = participantes.map((participante) =>
    normalizarEmail(participante.email)
  );
  const candidatosPorRemetente = new Map(
    emails.map((remetente) => [
      remetente,
      embaralhar(
        emails.filter(
          (destinatario) =>
            destinatario !== remetente &&
            !paresProibidos.has(chaveDirecional(remetente, destinatario))
        )
      ),
    ])
  );
  const remetentePorDestinatario = new Map<string, string>();

  const atribuir = (remetente: string, visitados: Set<string>): boolean => {
    for (const destinatario of candidatosPorRemetente.get(remetente) ?? []) {
      if (visitados.has(destinatario)) continue;
      visitados.add(destinatario);

      const remetenteAtual = remetentePorDestinatario.get(destinatario);
      if (!remetenteAtual || atribuir(remetenteAtual, visitados)) {
        remetentePorDestinatario.set(destinatario, remetente);
        return true;
      }
    }
    return false;
  };

  for (const remetente of embaralhar(emails)) {
    if (!atribuir(remetente, new Set())) return null;
  }

  const destinatarioPorRemetente = new Map(
    [...remetentePorDestinatario].map(([destinatario, remetente]) => [
      remetente,
      destinatario,
    ])
  );

  return participantes.map((participante) => {
    const amigoSecretoEmail = destinatarioPorRemetente.get(
      normalizarEmail(participante.email)
    );
    const amigoSecreto = amigoSecretoEmail
      ? participantesPorEmail.get(amigoSecretoEmail)
      : undefined;

    if (!amigoSecreto) {
      throw new Error("O sorteio encontrou uma atribuição incompleta.");
    }

    return {
      participante: participante.nome,
      participanteEmail: participante.email,
      amigoSecreto: amigoSecreto.nome,
      amigoSecretoEmail: amigoSecreto.email,
    };
  });
};