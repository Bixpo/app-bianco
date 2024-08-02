import { instance as axios } from "../../../config/axiosConfig";

// Função auxiliar para obter o token de autenticação
async function getAuthConfig(currentUser) {
  const token = await currentUser.getIdToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

// Função auxiliar para realizar requisições com autenticação
async function authRequest(
  currentUser,
  method,
  url,
  data = null,
  headers = null
) {
  try {
    const config = await getAuthConfig(currentUser);

    // Adicionar headers personalizados, se fornecidos
    if (headers) {
      config.headers = { ...config.headers, ...headers };
    }

    switch (method.toLowerCase()) {
      case "get":
        return axios.get(url, config);
      case "post":
        return axios.post(url, data, config);
      case "put":
        return axios.put(url, data, config);
      case "delete":
        return axios.delete(url, config);
      default:
        throw new Error(`Método HTTP desconhecido: ${method}`);
    }
  } catch (error) {
    console.error(
      `Erro ao realizar requisição ${method.toUpperCase()} em ${url}:`,
      error
    );
    throw error;
  }
}

// Função para obter todos os pacientes
export async function getPacientes(currentUser) {
  return authRequest(currentUser, "get", "/patients");
}

// Função para obter um paciente pelo ID
export async function getPacienteById(currentUser, id) {
  return authRequest(currentUser, "get", `/patients/id/${id}`);
}

// Função para editar um paciente
export async function editPaciente(currentUser, id, updatedData) {
  return authRequest(currentUser, "put", `/patients/${id}`, updatedData);
}

// Função para criar um novo paciente
export async function createPaciente(currentUser, createData) {
  return authRequest(currentUser, "post", "/patients", createData);
}

// Função para deletar um paciente
export async function deletePaciente(currentUser, id) {
  return authRequest(currentUser, "delete", `/patients/${id}`);
}

// Função para enviar o SMS
export async function sendSMS(currentUser, createData) {
  return authRequest(currentUser, "post", "/send", createData);
}

export async function importPaciente(currentUser, formData) {
  try {
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    return authRequest(currentUser, "post", "/patients/import", formData, headers);
  } catch (error) {
    console.error("Erro ao enviar arquivo:", error);
    alert("Erro ao enviar arquivo. Verifique o console para mais detalhes.");
  }
}
