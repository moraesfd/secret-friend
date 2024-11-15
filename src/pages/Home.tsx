import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { Participante, ResultadoSorteio, Sorteio } from "../@types";
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from "../constants/email";

export const Home = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [temSorteios, setTemSorteios] = useState(false);

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    const savedSorteios = localStorage.getItem("sorteios");
    if (savedSorteios && JSON.parse(savedSorteios).length > 0) {
      setTemSorteios(true);
    }
  }, []);

  const emailValido = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const adicionarParticipante = () => {
    if (!nome || !email) {
      return setError("Por favor, preencha ambos os campos.");
    }
    if (!emailValido(email)) {
      return setError("Por favor, insira um email válido.");
    }
    if (participantes.some((p) => p.email === email)) {
      return setError("Esse participante já foi adicionado.");
    }

    setParticipantes((prev) => [...prev, { nome, email }]);
    setNome("");
    setEmail("");
    setError(null);
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sorteador de Amigo Secreto</h1>

      <div className="mb-4">
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
          className="border p-2 mr-2"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 mr-2"
        />
        <button
          onClick={adicionarParticipante}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Adicionar Participante
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <ul className="mb-4">
        {participantes.map((participante, index) => (
          <li key={index} className="mb-2">
            {`${participante.nome} (${participante.email})`}
          </li>
        ))}
      </ul>

      <button
        onClick={sortear}
        className="bg-green-500 text-white p-2 rounded mb-4"
      >
        {loading ? "Sorteando..." : "Sortear"}
      </button>

      {success && <div className="text-green-500 mb-4">{success}</div>}

      <br />
      {temSorteios && (
        <Link to="/historico" className="text-blue-500 underline">
          Ver Histórico de Sorteios
        </Link>
      )}
    </div>
  );
};
