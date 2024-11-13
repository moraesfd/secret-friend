import { useState } from "react";

interface Participante {
  nome: string;
  email: string;
}

export const FirstVersion = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [resultado, setResultado] = useState<string[]>([]);

  const adicionarParticipante = () => {
    if (nome && email) {
      setParticipantes([...participantes, { nome, email }]);
      setNome("");
      setEmail("");
    } else {
      alert("Por favor, preencha ambos os campos.");
    }
  };

  const sortear = () => {
    if (participantes.length < 2) {
      alert("É necessário pelo menos 2 participantes para sortear.");
      return;
    }

    let sorteio = [...participantes];
    sorteio = shuffleArray(sorteio);

    const resultadoSorteio: string[] = [];
    for (let i = 0; i < participantes.length; i++) {
      const amigoSecreto = sorteio[(i + 1) % participantes.length];
      resultadoSorteio.push(
        `${participantes[i].nome} tirou ${amigoSecreto.nome}`
      );
    }

    setResultado(resultadoSorteio);
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
        Sortear
      </button>
      <ul>
        {resultado.map((item, index) => (
          <li key={index} className="mb-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
