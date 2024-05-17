// src/components/Login.js
import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column; // Changed to column to stack items vertically
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
`;

const StyledLink = styled(Link)`
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  text-decoration: none;
  margin-top: 20px;
  &:hover {
    background-color: #0056b3; /* Darker shade for hover effect */
  }
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password }
      );
      // Assuming the response contains a role field
      const role = response.data.role;
      // Redirect based on the role
      switch (role) {
        case "student":
          navigate("/student", { state: { username } });
          break;
        case "teacher":
          navigate("/teacher", { state: { username } });
          break;
        case "admin":
          navigate("/admin", { state: { username } });
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
      </Form>
      {/* Link to the registration page */}
      <StyledLink to="/register" style={{ marginTop: "20px" }}>
        No account? Click here to register
      </StyledLink>
    </Container>
  );
};

export default Login;
