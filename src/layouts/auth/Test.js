import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios"; // Import Axios
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./login.css";

import BackgroundImage from "../../assets/images/background-login.jpg";
import Logo from "../../assets/images/logo-bi.png";
import Logo1 from "../../assets/images/msi.jpg";
// Import library yang diperlukan



const Login = () => {
  const [values, setValues] = useState({
      username: '',
      password: ''
  })
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  // Di dalam fungsi Login

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await delay(500);
    
    axios.post('http://localhost:3001/auth', values)
  .then(response => {
    console.log(response.data);
    // Menghandle respon dari server
    if (response.status === 200) {
      // Jika login berhasil
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Redirecting to dashboard...",
        showConfirmButton: false,
        timer: 1500,
        onClose: () => {
            navigate('/dashboard')
        }
      });
    } else {
      // Jika login gagal karena username atau password tidak sesuai
      Swal.fire({
        icon: "error",
        title: "Login Failed!",
        text: "Username or password is incorrect.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK"
      });
      setLoading(false); // Hentikan loading karena login gagal
    }
  })
  .catch(error => {
    console.error("Error logging in:", error);
    Swal.fire({
      icon: "error",
      title: "Login Failed!",
      text: "An error occurred while logging in.",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK"
    });
    setLoading(false);
  });

};  
  

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeToggle = () => {
    setRememberMe(!rememberMe);
    if (!rememberMe) {
      setShowPassword(true);
    }
  };

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div
      className="sign-in__wrapper"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="sign-in__backdrop"></div>
      <Form
        className="shadow p-4 bg-white rounded"
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px" }}
      >
        <div className="text-center">
          <img
            className="img-thumbnail mx-auto mb-2 me-2"
            src={Logo}
            alt="logo"
          />
          <img
            className="img-thumbnail mx-auto mb-2"
            src={Logo1}
            alt="logo1"
            style={{ width: "150px", marginLeft: "10px" }}
          />
        </div>
        <div className="h4 mb-2 text-center mt-2">Corrective Maintenance</div>
        <div className="h6 mb-2 text-center mt-2">Converged Infra Dev </div>

        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            onChange={e => setValues({...values, username: e.target.value})}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2 position-relative" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={e => setValues({...values, username: e.target.value})}
            required
          />
        
        </Form.Group>
        <Form.Group className="mb-2 mt-2" controlId="checkbox">
          <Form.Check 
            type="checkbox" 
            label="Show Password" 
            style={{ fontSize: "1rem" }} 
            checked={showPassword} 
            onChange={handleRememberMeToggle}
            onClick={handlePasswordToggle} 
          />
        </Form.Group>

        {!loading ? (
          <Button className="w-100 mt-2" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}
      </Form>
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        &copy;2024 | Made by MSI Bank Indonesia
      </div>
    </div>
  );
};

export default Login;
