import { useState } from "react";

interface Participante {
  nome: string;
  email: string;
}

interface ResultadoSorteio {
  participante: string;
  amigoSecreto: string;
}

const initialState: Participante[] = [
  { nome: "Fulano", email: "fulano@mail.com" },
  { nome: "Ciclano", email: "ciclano@mail.com" },
  { nome: "Beltrano", email: "beltrano@mail.com" },
];

const emailValido = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const FirstVersion = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [participantes, setParticipantes] =
    useState<Participante[]>(initialState);
  const [resultado, setResultado] = useState<ResultadoSorteio[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const adicionarParticipante = () => {
    if (!nome || !email) {
      setError("Por favor, preencha ambos os campos.");
      return;
    }
    if (!emailValido(email)) {
      setError("Por favor, insira um email válido.");
      return;
    }
    if (participantes.some((p) => p.email === email)) {
      setError("Esse participante já foi adicionado.");
      return;
    }

    setParticipantes([...participantes, { nome, email }]);
    setNome("");
    setEmail("");
    setError(null);
  };

  const sortear = () => {
    if (participantes.length < 2) {
      setError("É necessário pelo menos 2 participantes para sortear.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const resultadoSorteio = realizarSorteio(participantes);
      if (resultadoSorteio) {
        setResultado(resultadoSorteio);
        setError(null);
      } else {
        setError("Não foi possível realizar o sorteio. Tente novamente.");
      }
      setLoading(false);
    }, 2000);
  };

  const realizarSorteio = (
    participantes: Participante[]
  ): ResultadoSorteio[] | null => {
    let sorteio: Participante[];
    let valido = false;

    while (!valido) {
      sorteio = shuffleArray([...participantes]);
      valido = participantes.every(
        (participante, index) => participante.email !== sorteio[index].email
      );
    }

    const resultadoSorteio: ResultadoSorteio[] = participantes.map(
      (participante, index) => {
        const amigoSecreto = sorteio[index];
        return {
          participante: participante.nome,
          amigoSecreto: amigoSecreto.nome,
        };
      }
    );

    return resultadoSorteio;
  };

  const shuffleArray = (array: Participante[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
          <li
            key={index}
            className="mb-2"
          >{`${participante.nome} (${participante.email})`}</li>
        ))}
      </ul>
      <button
        onClick={sortear}
        className="bg-green-500 text-white p-2 rounded mb-4"
        disabled={loading}
      >
        {loading ? "Sorteando..." : "Sortear"}
      </button>
      <ul>
        {resultado.map((item, index) => (
          <li
            key={index}
            className="mb-2"
          >{`${item.participante} tirou ${item.amigoSecreto}`}</li>
        ))}
      </ul>
    </div>
  );
};
