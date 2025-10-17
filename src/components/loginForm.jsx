import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginForm({ toggleForm }) {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        credentials
      );

      // Save token + admin info in context
      login(res.data.token, res.data);

      // redirect directly to dashboard after login
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <label>Email</label>
      <input type="email" name="email" onChange={handleChange} required />
      <label>Password</label>
      <input type="password" name="password" onChange={handleChange} required />
      <button type="submit">Login</button>
      <p>
        Don't have an account?{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toggleForm();
          }}
        >
          Sign Up
        </a>
      </p>
    </form>
  );
}

export default LoginForm;
