import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const FormWrapper = styled.div`
  width: 400px;
  max-width: 90vw;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 40px;
  margin-top: 40px;
`;

const Logo = styled.img`
  max-width: 200px;
  margin-bottom: 30px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #6c63ff;
    outline: none;
  }

  &::placeholder {
    color: #999;
  }
`;

const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  background-color: #6c63ff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5549d6;
  }
`;

const Alert = styled.div`
  padding: 10px;
  background-color: ${(props) =>
    props.type === "error" ? "#f44336" : "#4caf50"};
  color: white;
  margin-bottom: 20px;
  border-radius: 4px;
  text-align: center;
`;

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/admin/register", {
        username,
        password,
        role,
      });
      setAlert({
        type: "success",
        message: "Registration successful. Redirecting to login...",
      });
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
    } catch (error) {
      setAlert({
        type: "error",
        message:
          "Registration failed. Please check your details and try again.",
      });
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Logo src="RU-Logo.jpeg" alt="School Logo" />
        {alert.message && <Alert type={alert.type}>{alert.message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Role (admin, teacher, student)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
          <Button type="submit">Register</Button>
        </Form>
      </FormWrapper>
    </Container>
  );
};

export default Register;
