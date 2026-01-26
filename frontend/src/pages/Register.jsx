import { useState } from "react";
import axios from "axios"; 

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {   
    e.preventDefault();

    try {                               
      const res = await axios.post("http://localhost:4000/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registro exitoso");

      console.log(res.data);            

    } catch (error) {
      console.error(error);
      alert("Error en el registro");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Name:</label> <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <br />

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

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Register;
