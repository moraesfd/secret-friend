import { describe, expect, it } from "vitest";
import type { Participante } from "../../@types";
import {
  adicionarRegraSorteio,
  realizarSorteio,
  removerRegrasDoParticipante,
  type RegraSorteio,
} from "./sorteio";

const participantes: Participante[] = [
  { nome: "Ana", email: "ana@example.com" },
  { nome: "Bia", email: "bia@example.com" },
  { nome: "Caio", email: "caio@example.com" },
];
const expectAtribuicaoValida = (
  resultados: ReturnType<typeof realizarSorteio>,
  pessoas: Participante[],
  regras: RegraSorteio[] = []
) => {
  expect(resultados).not.toBeNull();
  if (!resultados) return;

  const emailsRecebedores = resultados.map((resultado) =>
    resultado.amigoSecretoEmail.toLowerCase()
  );
  expect(emailsRecebedores).toHaveLength(pessoas.length);
  expect(new Set(emailsRecebedores).size).toBe(pessoas.length);

  for (const resultado of resultados) {
    const remetente = resultado.participanteEmail.toLowerCase();
    const destinatario = resultado.amigoSecretoEmail.toLowerCase();
    expect(destinatario).not.toBe(remetente);

    for (const regra of regras) {
      const primeiro = regra.participante1Email.toLowerCase();
      const segundo = regra.participante2Email.toLowerCase();
      if (remetente === primeiro) {
        expect(destinatario).not.toBe(segundo);
      }
    }
  }
};

describe("realizarSorteio", () => {
  it("produz uma atribuição completa sem autoatribuições", () => {
    const resultado = realizarSorteio(participantes);

    expectAtribuicaoValida(resultado, participantes);
  });

  it("respeita regras direcionais e permite o sentido inverso", () => {
    const regras: RegraSorteio[] = [
      {
        participante1Email: "ANA@example.com",
        participante2Email: "bia@example.com",
      },
    ];

    const resultado = realizarSorteio(participantes, regras);

    expectAtribuicaoValida(resultado, participantes, regras);
    expect(
      resultado?.some(
        (item) =>
          item.participanteEmail === "bia@example.com" &&
          item.amigoSecretoEmail === "ana@example.com"
      )
    ).toBe(true);
  });

  it("exige pelo menos três participantes para realizar o sorteio", () => {
    expect(realizarSorteio(participantes.slice(0, 2))).toBeNull();
  });

  it("retorna null quando as regras tornam o sorteio impossível", () => {
    const regras: RegraSorteio[] = [
      {
        participante1Email: participantes[0].email,
        participante2Email: participantes[1].email,
      },
      {
        participante1Email: participantes[0].email,
        participante2Email: participantes[2].email,
      },
    ];

    expect(realizarSorteio(participantes, regras)).toBeNull();
  });
});

describe("regras do sorteio", () => {
  it("adiciona uma regra entre dois participantes", () => {
    expect(adicionarRegraSorteio([], "ana@example.com", "bia@example.com")).toEqual([
      {
        participante1Email: "ana@example.com",
        participante2Email: "bia@example.com",
      },
    ]);
  });

  it("rejeita autorregras e duplicatas na mesma direção", () => {
    const regras = [
      {
        participante1Email: "ana@example.com",
        participante2Email: "bia@example.com",
      },
    ];

    expect(
      adicionarRegraSorteio(regras, "ana@example.com", "ANA@example.com")
    ).toBeNull();
    expect(
      adicionarRegraSorteio(regras, "bia@example.com", "ana@example.com")
    ).toEqual([
      ...regras,
      {
        participante1Email: "bia@example.com",
        participante2Email: "ana@example.com",
      },
    ]);
  });

  it("remove regras que referenciam um participante removido", () => {
    const regras = [
      {
        participante1Email: "ana@example.com",
        participante2Email: "bia@example.com",
      },
      {
        participante1Email: "caio@example.com",
        participante2Email: "duda@example.com",
      },
    ];

    expect(removerRegrasDoParticipante(regras, "BIA@example.com")).toEqual([
      regras[1],
    ]);
  });
});