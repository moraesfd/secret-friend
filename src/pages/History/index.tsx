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
      setSorteios(JSON.parse(savedSorteios));
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
      <h1>Histórico de Sorteios</h1>

      {sorteios.length === 0 ? (
        <div className="text-gray-500">Ainda não há sorteios realizados.</div>
      ) : (
        <HistoryList>
          <table>
            <thead>
              <tr>
                <th>Data do Sorteio</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sorteios.map((sorteio, index) => {
                return (
                  <tr key={index}>
                    <td>{new Date(sorteio.data).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => reenviarEmails(sorteio.resultados)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        {loading ? "Reenviando..." : "Reenviar Emails"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </HistoryList>
      )}

      <br />
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-blue-500 mb-4">{success}</div>}
    </HistoryContainer>
  );
};
