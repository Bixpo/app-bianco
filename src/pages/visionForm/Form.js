import React, { useEffect, useState } from "react";
import { Table, Spinner, Button, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getTodosEnvio } from "./services/feedbackServices";
import { useAuth } from "../../hooks/authContext";
import moment from "moment";

const VisionForm = () => {
  const { id } = useParams(); // Obter o ID do paciente a partir da URL
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");

  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Obtém o usuário autenticado
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await getTodosEnvio(currentUser, id);
        const responseJson = response.data.map((r) => [
          r.id,
          JSON.parse(r.answers),
        ]);
        setResponses(responseJson);
      } catch (error) {
        toast.error("Erro ao carregar respostas do formulário.");
        console.error("Erro ao carregar respostas do formulário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [id]); // Executar o efeito quando o ID do paciente mudar

  useEffect(() => {

  }, [searchDate])


  const date = (data) => {
    return data === moment(searchDate, "YYYY-MM-DD").format("DD/MM/YY");
  };

  return (
    <div className="vision-form-container">
      <Form className="mb-3">
        <Form.Group controlId="searchDate">
          <Form.Label>Pesquisar por Data</Form.Label>
          <Form.Control
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </Form.Group>
      </Form>
      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          className="form-responses-table"
        >
          <thead className="table-dark text-center">
            <tr>
              <th>Data de Envio</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {responses && responses.length > 0 ? (
              responses.map((response, index) =>
                searchDate ? (
                  date(response[1].data) && (
                    <>
                      {" "}
                      <tr key={index}>
                        <td>{response[1].data}</td>
                        <td>
                          <Button
                            onClick={() => navigate(`/pacientes/visonForm/${response[0]}/form`)}
                          >
                            Visualizar Formulário
                          </Button>
                        </td>
                      </tr>{" "}
                    </>
                  )
                ) : (
                  <>
                    <tr key={index}>
                      <td>{response[1].data}</td>
                      <td>
                        <Button
                          onClick={() => navigate(`/pacientes/visonForm/${response[0]}/form`)}
                        >
                          Visualizar Formulário
                        </Button>
                      </td>
                    </tr>
                  </>
                )
              )
            ) : (
              <tr>
                <td colSpan="2" className="text-center">
                  <h4>Nenhuma resposta encontrada</h4>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default VisionForm;
