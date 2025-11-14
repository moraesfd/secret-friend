import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { ResultadoSorteio, Sorteio } from "../../@types";
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from "../../constants/email";
import { HistoryContainer, HistoryList } from "./styles";

export const History = () => {
  const [sorteios, setSorteios] = useState<Sorteio[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    const savedSorteios = localStorage.getItem("sorteios");
    if (savedSorteios) {
      const sorteiosData = JSON.parse(savedSorteios);
      // Ordena do mais recente para o mais antigo
      const sorteiosOrdenados = sorteiosData.sort(
        (a: Sorteio, b: Sorteio) =>
          new Date(b.data).getTime() - new Date(a.data).getTime()
      );
      setSorteios(sorteiosOrdenados);
    }
  }, []);

  const reenviarEmails = async (resultados: ResultadoSorteio[]) => {
    setLoading(true);
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
      setSuccess("Emails reenviados com sucesso!");
    } catch (error) {
      console.error("Erro ao reenviar emails:", error);
      setError("Erro ao reenviar emails. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HistoryContainer>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">
          <span className="mr-3">📋</span>
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Histórico de Sorteios
          </span>
        </h1>
        {sorteios.length > 0 && (
          <span className="text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
            {sorteios.length} sorteio{sorteios.length > 1 ? "s" : ""} realizado
            {sorteios.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {sorteios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">🎁</div>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-lg font-semibold">
            Ainda não há sorteios realizados.
          </div>
          <div className="text-gray-500 text-sm mt-2">
            Vá para a página inicial e realize seu primeiro sorteio!
          </div>
        </div>
      ) : (
        <HistoryList>
          {/* Mobile Cards */}
          <div className="block sm:hidden space-y-4">
            {sorteios.map((sorteio, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-6 border border-purple-200 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      🎯 Sorteio #{sorteios.length - index}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium mt-1">
                      {new Date(sorteio.data).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full font-semibold shadow-sm">
                    {sorteio.resultados.length} participantes
                  </span>
                </div>
                <button
                  onClick={() => reenviarEmails(sorteio.resultados)}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="mr-2">📧</span>
                  {loading ? "Reenviando..." : "Reenviar Emails"}
                </button>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block">
            <table>
              <thead>
                <tr>
                  <th>Data do Sorteio</th>
                  <th>Participantes</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sorteios.map((sorteio, index) => {
                  return (
                    <tr key={index}>
                      <td>{new Date(sorteio.data).toLocaleString("pt-BR")}</td>
                      <td>
                        {sorteio.resultados.length} pessoa
                        {sorteio.resultados.length > 1 ? "s" : ""}
                      </td>
                      <td>
                        <button
                          onClick={() => reenviarEmails(sorteio.resultados)}
                          disabled={loading}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                          <span className="mr-2">📧</span>
                          {loading ? "Reenviando..." : "Reenviar Emails"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </HistoryList>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-6">
          {success}
        </div>
      )}
    </HistoryContainer>
  );
};
