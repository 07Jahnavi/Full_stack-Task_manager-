import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function AuthPage() {

const navigate = useNavigate();
const [isLogin, setIsLogin] = useState(true);

const [form, setForm] = useState({
name: "",
email: "",
password: ""
});

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value
});
};

const handleSubmit = async (e) => {
e.preventDefault();


try {

  if (isLogin) {

    const res = await API.post("/auth/login", {
      email: form.email,
      password: form.password
    });

    console.log("Login success:", res.data);

  } else {

    const res = await API.post("/auth/register", form);

    console.log("Register success:", res.data);

  }

  // redirect after success
  navigate("/dashboard");

} catch (error) {

  console.error(error);
  alert(error.response?.data?.message || "Authentication failed");

}


};

return (


<div className="auth-container">

  <div className="auth-card">

    <h1 className="auth-title">Task Manager</h1>

    <div className="auth-tabs">

      <button
        type="button"
        className={isLogin ? "active" : ""}
        onClick={() => setIsLogin(true)}
      >
        Login
      </button>

      <button
        type="button"
        className={!isLogin ? "active" : ""}
        onClick={() => setIsLogin(false)}
      >
        Register
      </button>

    </div>

    <form onSubmit={handleSubmit}>

      {!isLogin && (
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <button type="submit">
        {isLogin ? "Login" : "Create Account"}
      </button>

    </form>

  </div>

</div>


);
}

export default AuthPage;
