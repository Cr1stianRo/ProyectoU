import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "linear-gradient(135deg, #5b4636 0%, #8C6A4A 50%, #b8956a 100%)" }}
    >
      <div className="text-center text-white px-4" style={{ maxWidth: 540 }}>
        <div className="mb-4">
          <i className="bi bi-gear-wide-connected" style={{ fontSize: "3.5rem", opacity: 0.9 }}></i>
        </div>
        <h1 className="fw-bold mb-3" style={{ fontSize: "2.5rem" }}>
          Gestor de Contenidos
        </h1>
        <p className="mb-4 opacity-75" style={{ fontSize: "1.1rem" }}>
          Administra y personaliza el contenido de tu sitio web de forma sencilla.
          Edita textos, imágenes, colores y módulos desde un solo lugar.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link
            to="/login"
            className="btn btn-light fw-bold px-4 py-2"
            style={{ color: "#5b4636", borderRadius: "0.5rem" }}
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="btn btn-outline-light fw-bold px-4 py-2"
            style={{ borderRadius: "0.5rem" }}
          >
            Crear Cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
