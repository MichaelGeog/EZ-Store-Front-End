import axios from "axios";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function SignUpForm({ toggleForm }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    businessName: "",
    password: "",
    confirmPassword: "",
  });

  const { login } = useContext(AuthContext); // ✅ use login function from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        businessName: formData.businessName,
        password: formData.password,
      });

      await login(formData.email, formData.password);

      alert("Account created successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating account");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Account</h1>
      <label>First Name</label>
      <input type="text" name="firstName" onChange={handleChange} required />
      <label>Last Name</label>
      <input type="text" name="lastName" onChange={handleChange} required />
      <label>Email</label>
      <input type="email" name="email" onChange={handleChange} required />
      <label>Business Name</label>
      <input type="text" name="businessName" onChange={handleChange} required />
      <label>Password</label>
      <input type="password" name="password" onChange={handleChange} required />
      <label>Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        onChange={handleChange}
        required
      />
      <button type="submit">Create Account</button>
      <p>
        Already have an account?{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toggleForm();
          }}
        >
          Login
        </a>
      </p>
    </form>
  );
}

export default SignUpForm;
