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
  async function authRequest(currentUser, method, url, data = null) {
    try {
      const config = await getAuthConfig(currentUser);
      switch (method) {
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

  export async function getTodosEnvio(currentUser, id) {
    return authRequest(currentUser, "get", `/feedbacks/patient/${id}`);
  }

  export async function getEnvioId(currentUser, id) {
    return authRequest(currentUser, "get", `/feedbacks/${id}`);
  }