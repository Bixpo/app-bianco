import React, { useEffect, useState } from "react";
import { Form, Container, Row, Col, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import "./index.css";
import { instanceCND } from "../../config/axiosConfig";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/authContext";
import { getEnvioId } from "./services/feedbackServices";

const Index = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [envios, setEnvios] = useState({ answers: [], data: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instanceCND.get("questionsBA.json");
        setQuestions(response.data);

        const envio = await getEnvioId(currentUser, id);
        let parsedData = { answers: [], data: "" };

        if (envio.data && typeof envio.data.answers === "string") {
          try {
            parsedData = JSON.parse(envio.data.answers);
          } catch (error) {
            console.error("Erro ao parsear JSON das respostas:", error);
          }
        } else {
          parsedData = envio.data;
        }

        setEnvios(parsedData);
      } catch (error) {
        console.error(`Erro ao carregar dados: ${error}`);
      }
    };

    fetchData();
  }, [id, currentUser]);

  const getColorClass = (answer) => {
    if (["Alta qualidade", "Muito Satisfeito", "4", "5"].includes(answer)) {
      return "text-success bg-success-light";
    } else if (["Razoável", "3"].includes(answer)) {
      return "text-warning bg-warning-light";
    } else {
      return "text-danger bg-danger-light";
    }
  };

  const returnAnswer = (answer, buttons, type) => {
    let listButton;

    if (buttons) {
      listButton = buttons;
    } else {
      if (type === "rating") {
        listButton = [
          "Nada Satisfeito",
          "Baixa qualidade",
          "Razoável",
          "Alta qualidade",
          "Muito Satisfeito",
        ];
      } else if (type === "boolean") {
        listButton = ["Sim", "Não"];
      } else {
        listButton = [];
      }
    }

    const listAnswer = listButton.map((b) => {
      if (b === answer) {
        return (
          <ListGroupItem key={b} className={getColorClass(answer)}>
            <b>{answer}</b>
          </ListGroupItem>
        );
      } else {
        return <ListGroupItem key={b}>{b}</ListGroupItem>;
      }
    });

    return <ListGroup className="list-group-horizontal">{listAnswer}</ListGroup>;
  };

  return (
    <Container className="info-form-container mt-5">
      <Card>
        <Card.Body>
          <h1 className="text-center mb-4">Formulário de Feedback</h1>
          {envios.data && (
            <h3 className="text-center mb-4">Data: {envios.data}</h3>
          )}

          <Form>
            {questions.length > 0 ? (
              questions.map((pergunta, indice) => {
                const resposta = envios.answers.find(
                  (ans) => ans.question === pergunta.question
                );

                const answerText = resposta
                  ? resposta.questions[0].answer
                  : "NA";

                const explanationText = resposta
                  ? resposta.questions[0].explanation
                  : "NA";

                const buttons = resposta ? resposta.questions[0].buttons : [];
                const type = resposta ? resposta.questions[0].type : [];

                return (
                  <div
                    key={pergunta.question || indice}
                    className="form-group mb-4"
                  >
                    <Form.Group
                      as={Row}
                      controlId={`formPergunta${indice + 1}`}
                    >
                      <Form.Label column sm="1" className="text-right">
                        <strong>{indice + 1 + "-"}</strong>
                      </Form.Label>
                      <Col sm="11">
                        <Form.Label>{pergunta.title}</Form.Label>
                        <ListGroup>
                          {answerText !== "NA" &&
                            returnAnswer(answerText, buttons, type)}
                        </ListGroup>
                        {explanationText !== "NA" && explanationText !== "" && (
                          <Form.Text className="text-dark">
                            <b className="text-primary">Comentário:</b>{" "}
                            <Form.Control
                              className="text-primary"
                              value={explanationText}
                            />
                          </Form.Text>
                        )}
                      </Col>
                    </Form.Group>
                    <hr />
                  </div>
                );
              })
            ) : (
              <h4 className="text-center">Nenhuma pergunta encontrada</h4>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Index;
