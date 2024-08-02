import "./styles.css";
import { useAuth } from './hooks/authContext';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  // Função para lidar com o login do usuário
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      navigate("/pacientes");
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Falha no login. Verifique suas credenciais e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Efeito para capturar a tecla Enter para envio do formulário
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Enter') {
        document.getElementById('login-btn').click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="container-login">
      <div className="wrap-login">
        <form className="login-form" onSubmit={handleLogin}>
          <span className="login-form-title">Bem vindo!</span>
          {error && <p className="error-message">{error}</p>}
          <div className="wrap-input">
            <input
              className={email !== "" ? 'has-val input' : 'input'}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              disabled={loading}
            />
            <span className="focus-input" data-placeholder="Email"></span>
          </div>
          <div className="wrap-input">
            <input
              className={password !== "" ? 'has-val input' : 'input'}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              disabled={loading}
            />
            <span className="focus-input" data-placeholder="Password"></span>
          </div>
          <div className="container-login-form-btn">
            <button className="login-form-btn" type="submit" id="login-btn" disabled={loading}>
              {loading ? 'Carregando...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
