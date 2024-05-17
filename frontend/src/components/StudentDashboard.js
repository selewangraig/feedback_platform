// StudentDashboard.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const SubjectsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FeedbackForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

function StudentDashboard() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await axios.get("http://localhost:5000/api/subjects");
      setSubjects(res.data);
    };

    fetchSubjects();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Implement feedback submission logic here
  };

  return (
    <DashboardContainer>
      <h1>Student Dashboard</h1>
      <SubjectsList>
        {subjects.map((subject) => (
          <li key={subject._id}>{subject.name}</li>
        ))}
      </SubjectsList>
      <FeedbackForm onSubmit={handleSubmit}>
        <input type="text" placeholder="Feedback" required />
        <button type="submit">Submit</button>
      </FeedbackForm>
    </DashboardContainer>
  );
}

export default StudentDashboard;
