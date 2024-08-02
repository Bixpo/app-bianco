import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css"; // Certifique-se de importar o CSS personalizado
import { useParams, useNavigate } from "react-router-dom";
import {
  getPacienteById,
  createPaciente,
  editPaciente,
} from "./services/pacientesServices";
import { useAuth } from "../../hooks/authContext";
import toast from "react-hot-toast";
import InputMask from "react-input-mask";

function FormPaciente() {
  const { id } = useParams(); // Obtém o ID do paciente a partir dos parâmetros da URL
  const navigate = useNavigate(); // Hook para navegação programática
  const [nome, setNome] = useState(""); // Estado para o nome do paciente
  const [codSyscare, setCodSyscare] = useState(""); // Estado para o código do Syscare
  const [telefone, setTelefone] = useState(""); // Estado para o telefone
  const [linkFormulario, setLinkFormulario] = useState(""); // Estado para o link do formulário
  const [ultimoEnvio, setUltimoEnvio] = useState(""); // Estado para o último envio
  const [empresa, setEmpresa] = useState("");

  const { currentUser } = useAuth(); // Obtém o usuário autenticado

  useEffect(() => {
    // Função assíncrona para buscar os dados do paciente e o último envio
    const fetchPacienteData = async () => {
      try {
        const response = await getPacienteById(currentUser, id); // Busca dados do paciente
        const pacienteData = response.data;
        setNome(pacienteData.nome);
        setCodSyscare(pacienteData.codSyscare);
        setTelefone(pacienteData.telefone);
        setLinkFormulario(pacienteData.linkFormulario);
        setEmpresa(pacienteData.empresa);
        setUltimoEnvio(pacienteData.ultimoEnvio);
      } catch (error) {
        toast.error("Erro ao carregar paciente");
        console.error("Erro ao carregar paciente:", error);
      }
    };

    // Se houver um ID, busca os dados do paciente para edição
    if (id) {
      fetchPacienteData();
    }
  }, [id, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      nome,
      codSyscare,
      telefone,
      linkFormulario,
      ultimoEnvio,
      empresa,
    };

    try {
      if (id) {
        // Edita paciente existente
        await editPaciente(currentUser, id, data);
        toast.success("Editado com sucesso");
      } else {
        // Cria novo paciente
        await createPaciente(currentUser, data);
        toast.success("Criado com sucesso");
      }
      navigate("/pacientes");
    } catch (error) {
      if (id) {
        toast.error("Erro ao editar.");
      } else {
        if (error.response && error.response.status === 409) {
          toast.error("Paciente já cadastrado!");
        } else {
          toast.error("Erro ao criar.");
        }
      }
      console.error("Erro ao salvar paciente:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center">
        <div className="card w-100">
          <div className="card-body">
            <h3 className="card-title text-center">
              {id ? "Editar Paciente" : "Adicionar Paciente"}
            </h3>
            <p className="card-text text-center">Preencha os campos</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-center">
                <label htmlFor="nome" className="form-label">
                  Nome Paciente
                </label>
                <input
                  type="text"
                  className="form-control text-center"
                  id="nome"
                  placeholder="Digite o nome do paciente"
                  style={{ lineHeight: "30px" }}
                  onChange={(e) => setNome(e.target.value)}
                  value={nome}
                />
              </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="codSyscare" className="form-label">
                    Cod Syscare
                  </label>
                  <InputMask
                    mask="9999"
                    maskChar=""
                    value={codSyscare}
                    placeholder="Digite o código do Syscare"
                    onChange={(e) => setCodSyscare(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="telefone" className="form-label">
                    Telefone
                  </label>
                  <InputMask
                    id="telefone"
                    mask="99999999999"
                    maskChar=""
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="16982234222"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 mt-3">
                  <label htmlFor="linkFormulario" className="form-label">
                    Link do Formulário
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="linkFormulario"
                    placeholder="Adicione o link do formulário"
                    onChange={(e) => setLinkFormulario(e.target.value)}
                    value={linkFormulario}
                    disabled
                  />
                </div>
                <div className="col-md-3 mt-3">
                  <label htmlFor="diaEnvio" className="form-label">
                    Último Envio
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="diaEnvio"
                    onChange={(e) => setUltimoEnvio(e.target.value)}
                    value={ultimoEnvio}
                    disabled
                  />
                </div>
                <div className="col-md-3 mt-3">
                  <label htmlFor="diaEnvio" className="form-label">
                    Empresa
                  </label>
                  <select
                    class="form-control"
                    aria-label="Default select"
                    onChange={(e) => {
                      setEmpresa(e.target.value);
                    }}
                    required
                    value={empresa}
                  >
                    <option value="" disabled selected>
                      Selecione
                    </option>
                    <option value="BA">Bianco Azure Home Care</option>
                    <option value="JE">JE Home Care</option>
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary mx-3">
                  {id ? "Editar" : "Adicionar"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mx-3"
                  onClick={() => navigate(-1)}
                >
                  Voltar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormPaciente;
