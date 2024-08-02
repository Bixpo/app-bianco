import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Spinner, Modal, Form } from "react-bootstrap";
import {
  getPacientes,
  deletePaciente,
  sendSMS,
} from "./services/pacientesServices";
import { useAuth } from "../../hooks/authContext";
import { useNavigate } from "react-router-dom";
import { BsTrash, BsPencil, BsEye } from "react-icons/bs";
import toast from "react-hot-toast";
import "./index.css";
import moment from "moment";

const Pacientes = (props) => {
  const { tipo } = props; // Prop para diferenciar tipos de visualização
  const [pacientes, setPacientes] = useState([]); // Estado para lista de pacientes
  const [filteredPacientes, setFilteredPacientes] = useState([]); // Estado para lista filtrada de pacientes
  const [loading, setLoading] = useState(true); // Estado para controle de loading
  const [sending, setSending] = useState(false); // Estado para controle de envio de SMS
  const [showConfirmation, setShowConfirmation] = useState(false); // Estado para modal de confirmação de exclusão
  const [showSendConfirmation, setShowSendConfirmation] = useState(false); // Estado para modal de confirmação de envio de SMS
  const [pacienteToDelete, setPacienteToDelete] = useState(null); // Estado para paciente a ser excluído
  const [selectedPacientes, setSelectedPacientes] = useState([]); // Estado para pacientes selecionados para envio de SMS
  const [searchTerm, setSearchTerm] = useState(""); // Estado para termo de busca
  const { currentUser } = useAuth(); // Hook de autenticação
  const navigate = useNavigate(); // Hook para navegação programática

  useEffect(() => {
    // Função para buscar lista de pacientes
    const fetchPacientes = async () => {
      try {
        const response = await getPacientes(currentUser);
        setPacientes(response.data);
        setFilteredPacientes(response.data);
      } catch (err) {
        toast.error("Erro ao carregar pacientes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, [currentUser]);

  useEffect(() => {
    // Filtra pacientes com base no termo de busca
    const filterResults = () => {
      if (searchTerm) {
        setFilteredPacientes(
          pacientes.filter(
            (paciente) =>
              paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
              paciente.telefone.includes(searchTerm)
          )
        );
      } else {
        setFilteredPacientes(pacientes);
      }
    };

    filterResults();
  }, [searchTerm, pacientes]);

  // Função para enviar SMS aos pacientes selecionados
  const handleSendSMS = async () => {
    setSending(true);
    try {
      await sendSMS(currentUser, {
        pacientes: selectedPacientes,
        data: moment().format("DD/MM/YY HH:mm:ss"),
      });
      toast.success("SMS enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar SMS:", error);
      toast.error("Erro ao enviar SMS. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  // Função para exibir modal de confirmação de exclusão
  const handleDeletePaciente = async (paciente) => {
    setPacienteToDelete(paciente);
    setShowConfirmation(true);
  };

  // Função para confirmar exclusão de paciente
  const confirmDeletePaciente = async () => {
    try {
      await deletePaciente(currentUser, pacienteToDelete.id);
      setPacientes(pacientes.filter((p) => p.id !== pacienteToDelete.id));
      setFilteredPacientes(
        filteredPacientes.filter((p) => p.id !== pacienteToDelete.id)
      );
      setShowConfirmation(false);
      toast.success("Excluído com sucesso");
    } catch (err) {
      toast.error("Erro ao excluir paciente.");
    }
  };

  // Função para selecionar/deselecionar todos os pacientes
  const handleSelectAll = () => {
    if (selectedPacientes.length === filteredPacientes.length) {
      setSelectedPacientes([]);
    } else {
      setSelectedPacientes(filteredPacientes.map((p) => p));
    }
  };

  // Função para selecionar/deselecionar um paciente
  const handleSelectPaciente = (paciente) => {
    if (selectedPacientes.includes(paciente)) {
      setSelectedPacientes(selectedPacientes.filter((pid) => pid !== paciente));
    } else {
      setSelectedPacientes([...selectedPacientes, paciente]);
    }
  };

  // Função para exibir modal de confirmação de envio de SMS
  const handleSendConfirmation = () => {
    setShowSendConfirmation(true);
  };

  // Função para confirmar envio de SMS aos pacientes selecionados
  const confirmSendPacientes = () => {
    if (!selectedPacientes.length) {
      setShowSendConfirmation(false);
      toast.error("Selecione pelo menos um Paciente");
      return;
    }
    handleSendSMS();
    setShowSendConfirmation(false);
  };

  return (
    <div className="pacientes-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        {!tipo && (
          <>
            <button
              className="btn btn-success mb-3 me-5"
              onClick={() => navigate("/pacientes/create")}
            >
              Adicionar Paciente
            </button>
            <Form.Control
              type="text"
              placeholder="Pesquisar por nome ou telefone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </>
        )}
      </div>
      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="pacientes-table">
          <thead className="table-dark text-center">
            <tr>
              {tipo && (
                <th>
                  <Form.Check
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedPacientes.length === filteredPacientes.length
                    }
                  />
                </th>
              )}
              <th>Cod SysCare</th>
              <th>Paciente</th>
              <th>Telefone</th>
              <th>Link do formulário</th>
              <th>Ultimo Envio</th>
              <th>Empresa</th>
              {!tipo && <th>Ações</th>}
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredPacientes && filteredPacientes.length > 0 ? (
              filteredPacientes.map((paciente) => (
                <tr key={paciente.id}>
                  {tipo && (
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedPacientes.includes(paciente)}
                        onChange={() => handleSelectPaciente(paciente)}
                      />
                    </td>
                  )}
                  <td>{paciente.codSyscare}</td>
                  <td>{paciente.nome || "NA"}</td>
                  <td>{paciente.telefone}</td>
                  <td>{paciente.linkFormulario}</td>
                  <td>
                    {paciente.ultimoEnvio || (
                      <h5>
                        <span class="badge bg-warning text-dark">
                          Não enviado ainda!
                        </span>
                      </h5>
                    )}
                  </td>
                  <td>
                    {paciente.empresa !== undefined
                      ? paciente.empresa === "BA"
                        ? "Bianco Azure Home Care"
                        : "JE Home Care"
                      : ""}
                  </td>
                  {!tipo && (
                    <td>
                      <Button
                        variant="info"
                        className="action-btn"
                        onClick={() =>
                          navigate(`/pacientes/visonForm/${paciente.id}`)
                        }
                      >
                        <BsEye />
                      </Button>
                      <Button
                        variant="danger"
                        className="action-btn"
                        onClick={() => handleDeletePaciente(paciente)}
                      >
                        <BsTrash />
                      </Button>
                      <Button
                        onClick={() =>
                          navigate(`/pacientes/edit/${paciente.id}`)
                        }
                        variant="warning"
                        className="action-btn"
                      >
                        <BsPencil />
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  <h4>Nenhum paciente foi encontrado</h4>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      {tipo && (
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-success mx-3"
            onClick={handleSendConfirmation}
          >
            Enviar
          </button>
          <button
            type="button"
            className="btn btn-secondary mx-3"
            onClick={() => navigate(-1)}
          >
            Voltar
          </button>
        </div>
      )}
      <Modal
        show={showConfirmation}
        onHide={() => setShowConfirmation(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pacienteToDelete && (
            <p>Deseja realmente excluir o paciente {pacienteToDelete.nome}?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmation(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDeletePaciente}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showSendConfirmation}
        onHide={() => setShowSendConfirmation(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Envio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Deseja realmente fazer o envio do SMS para os pacientes
            selecionados?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSendConfirmation(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmSendPacientes}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
      {sending && (
        <div className="sending-spinner-overlay">
          <Spinner animation="border" role="status" />
        </div>
      )}
    </div>
  );
};

export default Pacientes;
