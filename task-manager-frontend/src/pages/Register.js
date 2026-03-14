import { useState } from "react";
import API from "../services/api";

function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/auth/register", form);

    alert("Registered successfully");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange}/>
      <input name="email" placeholder="Email" onChange={handleChange}/>
      <input name="password" type="password" placeholder="Password" onChange={handleChange}/>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;