import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { ResultadoSorteio, Sorteio } from "../../@types";
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from "../../constants/email";

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Histórico de Sorteios</h1>

      {sorteios.length === 0 ? (
        <div className="text-gray-500">Ainda não há sorteios realizados.</div>
      ) : (
        <table className="table-auto w-full mb-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Data do Sorteio</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sorteios.map((sorteio, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">
                  {new Date(sorteio.data).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => reenviarEmails(sorteio.resultados)}
                    className="bg-yellow-500 text-white p-2 rounded"
                  >
                    {loading ? "Reenviando..." : "Reenviar Emails"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
    </div>
  );
};
