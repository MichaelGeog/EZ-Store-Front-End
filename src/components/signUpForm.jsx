import axios from "axios";
import { useState } from "react";

function SignUpForm({ toggleForm }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    businessName: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // password confirmation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        businessName: formData.businessName,
        password: formData.password,
      });

      // save token to localStorage
      localStorage.setItem("token", res.data.token);
      alert("Account created successfully!");
      toggleForm(); // switch to login form
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
