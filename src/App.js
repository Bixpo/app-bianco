import React from "react";
import Pacientes from "./pages/pacientes/Index";
import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import FormPaciente from "./pages/pacientes/Form";
import Layout from "./components/layouts";
import VisionForm from "./pages/visionForm/Form";
import Index from "./pages/visionForm/index";
import Import from "./pages/pacientes/import";
import Export from "./pages/pacientes/export";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/pacientes"
        element={
          <Layout title="Lista de pacientes">
            <Pacientes />
          </Layout>
        }
      />
      <Route
        path="/pacientes/send"
        element={
          <Layout title="Enviar SMS aos pacientes">
            <Pacientes tipo="send" />
          </Layout>
        }
      />
      <Route
        path="/pacientes/create"
        element={
          <Layout title="Adicionar paciente">
            <FormPaciente />
          </Layout>
        }
      />
      <Route
        path="/pacientes/import"
        element={
          <Layout title="Adcionar vários pacientes">
            <Import />
          </Layout>
        }
      />
      <Route
        path="/pacientes/export"
        element={
          <Layout title="Exportar todos os pacientes">
            <Export />
          </Layout>
        }
      />

      <Route
        path="/pacientes/edit/:id"
        element={
          <Layout title="Editar paciente">
            <FormPaciente />
          </Layout>
        }
      />
      <Route
        path="/pacientes/visonForm/:id"
        element={
          <Layout title="Data de Envio">
            <VisionForm />
          </Layout>
        }
      />
      <Route
        path="/pacientes/visonForm/:id/form"
        element={
          <Layout title="Respostas Formulário">
            <Index />
          </Layout>
        }
      />
    </Routes>
  );
};

export default App;
