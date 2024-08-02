import logo from "../../assets/logo_branco.png";
import PrivateRoute from "../routes/privateRoutes";
import "./index.css";

function Layout(props) {
  return (
    <>
      <PrivateRoute>
        <div>
          <nav className="navbar navbar-expand-lg navbar-dark">
            <a className="navbar-brand m-1" href={() => {}}>
              <img src={logo} alt="logo" className="navbar-logo" />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Alterna navegação"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <a
                  className="nav-item nav-link nav-custom text-white"
                  href="/pacientes"
                >
                  Pacientes
                </a>
                <a
                  className="nav-item nav-link nav-custom text-white"
                  href="/pacientes/send"
                >
                  Realizar Envio
                </a>
                {/* <a
                  className="nav-item nav-link nav-custom text-white"
                  href="/pacientes/import"
                  
                >
                  Importar Pacientes
                </a>
                <a
                  className="nav-item nav-link nav-custom text-white"
                  href="/pacientes/export"
                >
                  Exportar Pacientes
                </a> */}
              </div>
            </div>
          </nav>
          <div className="hr-navbar"></div>
          <div className="shadow rounded mx-3 mt-4">
            <div className="p-3 text-start">
              <h4 className="ps-4 pt-4">{props.title}</h4>
              <hr />
              {props.children}
            </div>
          </div>
        </div>
      </PrivateRoute>
    </>
  );
}

export default Layout;
