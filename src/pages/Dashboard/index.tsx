import React, { useState, useEffect, FormEvent } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../../services/api";

import logoImg from "../../assets/logo.svg";

// import './styles.css';
// import { Title, Form, Repositories } from './styles';
import { Title, Form, Repositories, Error } from "./styles";

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState("");
  const [inputError, setInoutError] = useState("");
  // const [repositories, setRepositories] = useState<Repository[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem(
      "@GithubExplorer:repositories"
    );

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      "@GithubExplorer:repositories",
      JSON.stringify(repositories)
    );
  }, [repositories]);

  // truthy, falsy ('string preenchida', numerico, {}, [])
  // True,   False

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    // Adição de um novo repositório.
    // Consumir API do Github.
    // Salvar novo repositório no estado
    console.log(newRepo);

    if (!newRepo) {
      setInoutError("Digite o autor/nome do repositório");
      return;
    }

    try {
      // const response = await api.get(`repos/${newRepo}`);
      const response = await api.get<Repository>(`repos/${newRepo}`);

      console.log(response.data);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo("");
      setInoutError("");
    } catch (err) {
      setInoutError("Erro na busca por esse repositório");
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>
      {/* <Form> */}
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {/* <Error>{inputError}</Error> */}

      {/* Formula de if simplificado */}
      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repository) => (
          <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
