import { useState } from "react";
import { importPaciente } from "./services/pacientesServices";
import { useAuth } from "../../hooks/authContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Import() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const { currentUser } = useAuth(); // Obtém o usuário autenticado

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Por favor, selecione um arquivo Excel.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      await importPaciente(currentUser, formData);
      toast.success("Importado com sucesso.");
      navigate("/pacientes");
    } catch (error) {
      toast.error("Erro ao importar.");
      console.error("Erro ao importar:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center">
        <div className="card w-100">
          <div className="card-body">
            <h3 className="card-title text-center">
              Importar Pacientes (excel)
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-center">
                <label htmlFor="nome" className="form-label">
                  Arquivo
                </label>
                <input
                  className="form-control"
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary mx-3">
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Import;
