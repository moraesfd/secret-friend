import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { Participante, ResultadoSorteio, Sorteio } from "../../@types";
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from "../../constants/email";
import { HomeContainer } from "./styles";

export const Home = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [temSorteios, setTemSorteios] = useState(false);
  const [nomeError, setNomeError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    const savedSorteios = localStorage.getItem("sorteios");
    if (savedSorteios && JSON.parse(savedSorteios).length > 0) {
      setTemSorteios(true);
    }
  }, []);

  const emailValido = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length <= 100;
  };

  const nomeValido = (nome: string): boolean => {
    return (
      nome.trim().length >= 2 &&
      nome.trim().length <= 50 &&
      /^[a-zA-ZÀ-ÿ\s]+$/.test(nome.trim())
    );
  };

  const validarFormulario = (nomeAtual: string, emailAtual: string) => {
    const nomeOk = nomeValido(nomeAtual);
    const emailOk = emailValido(emailAtual);
    setIsFormValid(nomeOk && emailOk);
    return { nomeOk, emailOk };
  };

  const adicionarParticipante = () => {
    const nomeProcessado = nome.trim();
    const emailProcessado = email.trim().toLowerCase();

    // Reset errors
    setError(null);
    setNomeError(null);
    setEmailError(null);

    // Validação individual dos campos
    let hasError = false;

    if (!nomeProcessado) {
      setNomeError("Nome é obrigatório");
      hasError = true;
    } else if (!nomeValido(nomeProcessado)) {
      setNomeError(
        "Nome deve ter entre 2-50 caracteres e conter apenas letras"
      );
      hasError = true;
    }

    if (!emailProcessado) {
      setEmailError("Email é obrigatório");
      hasError = true;
    } else if (!emailValido(emailProcessado)) {
      setEmailError("Email inválido ou muito longo");
      hasError = true;
    } else if (
      participantes.some((p) => p.email.toLowerCase() === emailProcessado)
    ) {
      setEmailError("Este email já foi adicionado");
      hasError = true;
    }

    if (hasError) return;

    // Verifica limite de participantes
    if (participantes.length >= 50) {
      setError("Limite máximo de 50 participantes atingido");
      return;
    }

    setParticipantes((prev) => [
      ...prev,
      { nome: nomeProcessado, email: emailProcessado },
    ]);
    setNome("");
    setEmail("");
    setNomeError(null);
    setEmailError(null);
    setIsFormValid(false);
    setSuccess(`${nomeProcessado} foi adicionado com sucesso!`);

    // Remove a mensagem de sucesso após 3 segundos
    setTimeout(() => setSuccess(null), 3000);
  };

  const removerParticipante = (index: number) => {
    const participanteRemovido = participantes[index];
    setParticipantes((prev) => prev.filter((_, i) => i !== index));
    setSuccess(`${participanteRemovido.nome} foi removido`);
    setTimeout(() => setSuccess(null), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isFormValid) {
      adicionarParticipante();
    }
  };

  const handleNomeChange = (value: string) => {
    setNome(value);
    if (nomeError) setNomeError(null);
    validarFormulario(value, email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) setEmailError(null);
    validarFormulario(nome, value);
  };

  const sortear = () => {
    if (participantes.length < 2) {
      return setError("É necessário pelo menos 2 participantes para sortear.");
    }

    setLoading(true);

    const resultado = realizarSorteio(participantes);
    if (resultado) {
      const data = new Date().toISOString();
      const novoSorteio = { data, resultados: resultado };
      setError(null);
      salvarSorteio(novoSorteio);
      enviarEmails(resultado);
    } else {
      setError("Não foi possível realizar o sorteio. Tente novamente.");
      setLoading(false);
    }
  };

  const salvarSorteio = (novoSorteio: Sorteio) => {
    const sorteios = JSON.parse(localStorage.getItem("sorteios") || "[]");
    sorteios.push(novoSorteio);
    localStorage.setItem("sorteios", JSON.stringify(sorteios));
    setSuccess("Sorteio realizado e salvo com sucesso!");
    setLoading(false);
    setTemSorteios(true);
  };

  const shuffleArray = (array: Participante[]): Participante[] => {
    const arrayCopiado = [...array];
    for (let i = arrayCopiado.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayCopiado[i], arrayCopiado[j]] = [arrayCopiado[j], arrayCopiado[i]];
    }
    return arrayCopiado;
  };

  const realizarSorteio = (
    participantes: Participante[]
  ): ResultadoSorteio[] | null => {
    let sorteio: Participante[];
    let valido = false;

    while (!valido) {
      sorteio = shuffleArray(participantes);
      valido = participantes.every(
        (participante, index) => participante.email !== sorteio[index].email
      );
    }

    return participantes.map((participante, index) => ({
      participante: participante.nome,
      participanteEmail: participante.email,
      amigoSecreto: sorteio[index].nome,
      amigoSecretoEmail: sorteio[index].email,
    }));
  };

  const enviarEmails = async (resultados: ResultadoSorteio[]) => {
    try {
      for (const resultado of resultados) {
        const templateParams = {
          to_name: resultado.participante,
          to_email: resultado.participanteEmail,
          from_year: new Date().getFullYear(),
          secret_friend: resultado.amigoSecreto,
        };

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );
      }
      setSuccess("Emails enviados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar emails:", error);
      setError("Erro ao enviar emails. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HomeContainer>
      <div className="mb-6 w-full max-w-4xl">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Sorteio de Amigo Secreto
            </h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            Organize seu amigo secreto de forma simples e divertida!
          </p>
        </div>
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border border-gray-100 backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            {/* Campo Nome */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                👤 Nome do Participante
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => handleNomeChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite o nome completo"
                className={`w-full border-2 p-4 rounded-xl text-gray-700 focus:outline-none focus:ring-4 transition-all duration-300 font-medium ${
                  nomeError
                    ? "border-red-300 focus:ring-red-100 bg-red-50 focus:border-red-400"
                    : nome && nomeValido(nome.trim())
                    ? "border-green-300 focus:ring-green-100 bg-green-50 focus:border-green-400"
                    : "border-gray-200 focus:ring-blue-100 bg-white focus:border-blue-400 hover:border-gray-300"
                }`}
                maxLength={50}
              />
              {nomeError && (
                <p className="text-red-500 text-sm mt-2 flex items-center bg-red-50 p-2 rounded-lg">
                  <span className="mr-2 text-red-400">⚠️</span> {nomeError}
                </p>
              )}
              {nome && nomeValido(nome.trim()) && !nomeError && (
                <p className="text-green-600 text-sm mt-2 flex items-center bg-green-50 p-2 rounded-lg">
                  <span className="mr-2 text-green-400">✅</span> Nome válido
                </p>
              )}
            </div>

            {/* Campo Email */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                📧 Email para Receber o Resultado
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite o email para envio"
                className={`w-full border-2 p-4 rounded-xl text-gray-700 focus:outline-none focus:ring-4 transition-all duration-300 font-medium ${
                  emailError
                    ? "border-red-300 focus:ring-red-100 bg-red-50 focus:border-red-400"
                    : email && emailValido(email.trim())
                    ? "border-green-300 focus:ring-green-100 bg-green-50 focus:border-green-400"
                    : "border-gray-200 focus:ring-blue-100 bg-white focus:border-blue-400 hover:border-gray-300"
                }`}
                maxLength={100}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-2 flex items-center bg-red-50 p-2 rounded-lg">
                  <span className="mr-2 text-red-400">⚠️</span> {emailError}
                </p>
              )}
              {email &&
                emailValido(email.trim()) &&
                !emailError &&
                !participantes.some(
                  (p) => p.email.toLowerCase() === email.trim().toLowerCase()
                ) && (
                  <p className="text-green-600 text-sm mt-2 flex items-center bg-green-50 p-2 rounded-lg">
                    <span className="mr-2 text-green-400">✅</span> Email válido
                  </p>
                )}
            </div>

            {/* Botão Adicionar */}
            <button
              onClick={adicionarParticipante}
              disabled={!isFormValid || loading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 shadow-lg ${
                isFormValid && !loading
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-1 active:transform active:translate-y-0"
                  : "bg-gray-300 cursor-not-allowed shadow-none"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adicionando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  ➕ <span className="ml-2">Adicionar Participante</span>
                </span>
              )}
            </button>

            {participantes.length > 0 && (
              <div className="text-center text-sm text-purple-600 bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-xl border border-purple-100">
                💡 Pressione{" "}
                <kbd className="bg-white px-3 py-1 rounded-lg text-xs font-semibold shadow-sm border border-gray-200">
                  Enter
                </kbd>{" "}
                para adicionar rapidamente
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 w-full max-w-4xl">
          {error}
        </div>
      )}

      {participantes.length > 0 && (
        <div className="w-full max-w-4xl mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Participantes ({participantes.length}/50)
              </h3>
            </div>
            {participantes.length >= 2 && (
              <span className="text-sm bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                ✅ Pronto para sortear!
              </span>
            )}
          </div>
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-white rounded-2xl p-6 max-h-80 overflow-y-auto border-2 border-purple-100 shadow-inner">
            <div className="space-y-3">
              {participantes.map((participante, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-white to-gray-50 p-5 rounded-xl shadow-md border-2 border-purple-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full font-bold shadow-sm">
                          #{index + 1}
                        </span>
                        <span className="font-bold text-gray-800 truncate text-lg">
                          {participante.nome}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                        <span className="text-gray-600 text-sm font-medium">
                          📧 {participante.email}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removerParticipante(index)}
                      className="flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold border-2 border-red-200 hover:border-red-500 hover:shadow-lg self-start sm:self-center"
                      title={`Remover ${participante.nome}`}
                    >
                      🗑️ <span>Remover</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {participantes.length < 2 && (
              <div className="text-center mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-yellow-700 font-semibold">
                  ⚠️ Adicione pelo menos 2 participantes para realizar o sorteio
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <div className="w-full bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-2xl shadow-2xl p-8 border-2 border-purple-100">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4 mb-3">
              <span className="text-3xl animate-pulse">🎲</span>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
                Realizar Sorteio
              </h3>
            </div>
            <p className="text-gray-600 font-medium">
              {participantes.length < 2
                ? `Adicione ${2 - participantes.length} participante${
                    2 - participantes.length > 1 ? "s" : ""
                  } para continuar`
                : `🎉 ${participantes.length} participantes prontos para a magia do sorteio!`}
            </p>
          </div>

          <button
            onClick={sortear}
            disabled={loading || participantes.length < 2}
            className={`w-full py-6 px-8 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl ${
              loading || participantes.length < 2
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white hover:shadow-green-200 transform hover:-translate-y-2 hover:scale-105"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                ✨ Sorteando e enviando emails...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                🎁 <span className="ml-2">Sortear e Enviar Emails</span>
              </span>
            )}
          </button>

          {participantes.length >= 2 && (
            <div className="text-center mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <p className="text-blue-700 text-sm font-medium">
                📧 Os resultados serão enviados por email para cada participante
              </p>
            </div>
          )}
        </div>

        {success && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-2xl w-full text-center shadow-lg">
            <span className="font-semibold">✅ {success}</span>
          </div>
        )}

        {temSorteios && (
          <Link
            to="/history"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 no-underline"
          >
            📋 Ver Histórico de Sorteios
          </Link>
        )}
      </div>
    </HomeContainer>
  );
};
