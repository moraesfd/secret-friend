import { useState } from "react";
import type { Participante, ResultadoSorteio } from "../../@types";
import {
  adicionarRegraSorteio,
  realizarSorteio,
  removerRegrasDoParticipante,
  type RegraSorteio,
} from "../Home/sorteio";

const initialState: Participante[] = [
  { nome: "Ana", email: "ana@example.com" },
  { nome: "Bia", email: "bia@example.com" },
  { nome: "Caio", email: "caio@example.com" },
];

const emailValido = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) && email.length <= 100;
};

export const Demo = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [participantes, setParticipantes] =
    useState<Participante[]>(initialState);
  const [regras, setRegras] = useState<RegraSorteio[]>([]);
  const [regraParticipante1, setRegraParticipante1] = useState("");
  const [regraParticipante2, setRegraParticipante2] = useState("");
  const [resultado, setResultado] = useState<ResultadoSorteio[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const adicionarParticipante = () => {
    const nomeProcessado = nome.trim();
    const emailProcessado = email.trim().toLowerCase();

    if (!nomeProcessado || !emailProcessado) {
      setError("Por favor, preencha ambos os campos.");
      return;
    }
    if (!emailValido(emailProcessado)) {
      setError("Por favor, insira um email válido.");
      return;
    }
    if (
      participantes.some(
        (participante) => participante.email.toLowerCase() === emailProcessado,
      )
    ) {
      setError("Esse participante já foi adicionado.");
      return;
    }
    if (participantes.length >= 50) {
      setError("Limite máximo de 50 participantes atingido.");
      return;
    }

    setParticipantes((prev) => [
      ...prev,
      { nome: nomeProcessado, email: emailProcessado },
    ]);
    setNome("");
    setEmail("");
    setResultado(null);
    setError(null);
  };

  const removerParticipante = (emailRemovido: string) => {
    setParticipantes((prev) =>
      prev.filter((participante) => participante.email !== emailRemovido),
    );
    setRegras((prev) => removerRegrasDoParticipante(prev, emailRemovido));
    if (regraParticipante1 === emailRemovido) setRegraParticipante1("");
    if (regraParticipante2 === emailRemovido) setRegraParticipante2("");
    setResultado(null);
    setError(null);
  };

  const adicionarRegra = () => {
    const regrasAtualizadas = adicionarRegraSorteio(
      regras,
      regraParticipante1,
      regraParticipante2,
    );

    if (!regrasAtualizadas) {
      setError("Selecione duas pessoas diferentes e evite regras duplicadas.");
      return;
    }

    setRegras(regrasAtualizadas);
    setRegraParticipante1("");
    setRegraParticipante2("");
    setResultado(null);
    setError(null);
  };

  const removerRegra = (indiceRemovido: number) => {
    setRegras((prev) => prev.filter((_, indice) => indice !== indiceRemovido));
    setResultado(null);
  };

  const sortear = () => {
    if (participantes.length < 3) {
      setResultado(null);
      setError("É necessário pelo menos 3 participantes para sortear.");
      return;
    }

    const resultadoSorteio = realizarSorteio(participantes, regras);
    if (!resultadoSorteio) {
      setResultado(null);
      setError(
        "Não existe uma combinação possível com essas condições. Remova uma regra e tente novamente.",
      );
      return;
    }

    setResultado(resultadoSorteio);
    setError(null);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teste do sorteio</h1>
        <p className="mt-2 text-gray-600">
          Modo de teste: o resultado aparece aqui e não envia emails nem salva
          histórico.
        </p>
      </header>

      <form
        className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          adicionarParticipante();
        }}
      >
        <div>
          <label
            htmlFor="demo-nome"
            className="mb-1 block text-sm font-semibold text-gray-700"
          >
            Nome
          </label>
          <input
            id="demo-nome"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Nome do participante"
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            maxLength={50}
          />
        </div>
        <div>
          <label
            htmlFor="demo-email"
            className="mb-1 block text-sm font-semibold text-gray-700"
          >
            Email de teste
          </label>
          <input
            id="demo-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="pessoa@example.com"
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            maxLength={100}
          />
        </div>
        <button type="submit" className="btn-primary btn-sm h-12">
          Adicionar participante
        </button>
      </form>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700"
        >
          {error}
        </div>
      )}

      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Participantes ({participantes.length}/50)
        </h2>
        <ul className="divide-y divide-gray-100">
          {participantes.map((participante) => (
            <li
              key={participante.email}
              className="flex items-center justify-between gap-4 py-3"
            >
              <span className="min-w-0">
                <span className="block font-medium text-gray-800">
                  {participante.nome}
                </span>
                <span className="block truncate text-sm text-gray-500">
                  {participante.email}
                </span>
              </span>
              <button
                type="button"
                onClick={() => removerParticipante(participante.email)}
                className="btn-outline-danger btn-sm shrink-0"
                aria-label={`Remover ${participante.nome}`}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </section>

      {participantes.length >= 2 && (
        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Condições do sorteio
          </h2>
          {regras.length === 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Ainda não há condições. Selecione quem não pode tirar qual
              participante; o sentido inverso continua permitido.
            </p>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-end">
            <div>
              <label
                htmlFor="demo-regra-pessoa-1"
                className="mb-1 block text-sm font-semibold text-gray-700"
              >
                Participante
              </label>
              <select
                id="demo-regra-pessoa-1"
                value={regraParticipante1}
                onChange={(event) => {
                  const selecionado = event.target.value;
                  setRegraParticipante1(selecionado);
                  if (selecionado === regraParticipante2) {
                    setRegraParticipante2("");
                  }
                }}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Selecione uma pessoa</option>
                {participantes.map((participante) => (
                  <option key={participante.email} value={participante.email}>
                    {participante.nome}
                  </option>
                ))}
              </select>
            </div>
            <span className="hidden pb-3 text-sm text-gray-500 sm:block">
              não pode tirar
            </span>
            <div>
              <label
                htmlFor="demo-regra-pessoa-2"
                className="mb-1 block text-sm font-semibold text-gray-700"
              >
                Participante
              </label>
              <select
                id="demo-regra-pessoa-2"
                value={regraParticipante2}
                onChange={(event) => {
                  const selecionado = event.target.value;
                  setRegraParticipante2(selecionado);
                  if (selecionado === regraParticipante1) {
                    setRegraParticipante1("");
                  }
                }}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Selecione uma pessoa</option>
                {participantes.map((participante) => (
                  <option key={participante.email} value={participante.email}>
                    {participante.nome}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={adicionarRegra}
              disabled={
                !regraParticipante1 ||
                !regraParticipante2 ||
                regraParticipante1 === regraParticipante2
              }
              className="btn-primary btn-sm h-12"
            >
              Adicionar condição
            </button>
          </div>

          {regras.length > 0 && (
            <ul className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
              {regras.map((regra, index) => {
                const pessoa1 = participantes.find(
                  (participante) =>
                    participante.email === regra.participante1Email,
                );
                const pessoa2 = participantes.find(
                  (participante) =>
                    participante.email === regra.participante2Email,
                );

                return (
                  <li
                    key={`${regra.participante1Email}:${regra.participante2Email}`}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <span className="text-sm text-gray-700">
                      {pessoa1?.nome} não pode sair com {pessoa2?.nome}
                    </span>
                    <button
                      type="button"
                      onClick={() => removerRegra(index)}
                      className="btn-outline-danger btn-sm shrink-0"
                      aria-label={`Remover condição entre ${pessoa1?.nome} e ${pessoa2?.nome}`}
                    >
                      Remover
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Executar sorteio
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {participantes.length < 3
                ? `Adicione ${3 - participantes.length} participante${
                    3 - participantes.length === 1 ? "" : "s"
                  } para continuar.`
                : `${participantes.length} participantes prontos para sortear.`}
            </p>
          </div>
          <button
            type="button"
            onClick={sortear}
            disabled={participantes.length < 3}
            className="btn-success btn-sm h-12"
          >
            Sortear novamente
          </button>
        </div>
      </section>

      {resultado && (
        <section
          aria-live="polite"
          className="rounded-xl border border-green-200 bg-green-50 p-5"
        >
          <h2 className="mb-4 text-xl font-semibold text-green-900">
            Resultado do sorteio
          </h2>
          <ul className="divide-y divide-green-200">
            {resultado.map((item) => (
              <li
                key={item.participanteEmail}
                className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="font-semibold text-gray-900">
                  {item.participante}
                </span>
                <span className="text-sm text-green-800">
                  tirou {item.amigoSecreto} ({item.amigoSecretoEmail})
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
