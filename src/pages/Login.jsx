import { useState } from "react";
import axios from "axios";   // ← (1) Agregado

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {   // ← (2) Convertido a async
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });

      console.log("Login exitoso:", res.data);
      localStorage.setItem("token", res.data.token);

      alert("Inicio de sesión exitoso");
      console.log("Token guardado:", res.data.token);

    } catch (error) {
      console.error(error);
      alert("Credenciales inválidas");    // ← (4) Cambiado
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Email:</label> <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Password:</label> <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
