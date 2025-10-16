import axios from "axios";
import { useState } from "react";

function LoginForm({ toggleForm }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

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

      localStorage.setItem("token", res.data.token);
      alert(`Welcome back, ${res.data.firstName}!`);

      // redirect depending on your app structure
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid email or password");
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
