import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation } from "react-router-dom";

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f0f0;
`;

const Sidebar = styled.nav`
  width: 200px;
  background-color: #5a009d;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const SidebarButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  padding: 15px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #7a3b9b;
  }
`;

const DropdownMenu = styled.div`
  display: ${({ open }) => (open ? "flex" : "none")};
  flex-direction: column;
  padding-left: 20px;
`;

const Content = styled.main`
  flex-grow: 1;
  padding: 20px;
  background-color: white;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  max-width: 100px;
`;

const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
`;

const FeedbackForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #5a009d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #7a3b9b;
  }
`;

const LogoutButton = styled.button`
  padding: 10px;
  background-color: #5a009d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: auto;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #7a3b9b;
  }
`;

function StudentDashboard() {
  const { state } = useLocation();
  const username = state?.username;

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [selectedTab, setSelectedTab] = useState("home");
  const [dropdownOpen, setDropdownOpen] = useState({
    subjects: false,
    feedback: false,
  });
  const [newFeedback, setNewFeedback] = useState({
    title: "",
    content: "",
    rating: "",
    subject: "",
    teacher: "",
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/subjects");
        const subjectsForStudent = res.data.filter((subject) =>
          subject.students.some((student) => student.username === username)
        );
        setSubjects(res.data);
        setFilteredSubjects(subjectsForStudent);
      } catch (error) {
        console.error("Error fetching subjects", error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users");
        setTeachers(res.data);
      } catch (error) {
        console.error("Error fetching teachers", error);
      }
    };

    const fetchFeedbacks = async () => {
      try {
        // Fetch feedbacks by student username
        const res = await axios.get(
          `http://localhost:5000/api/feedback/feedback-by-student/${username}`
        );
        setFeedbacks(res.data);
        setFilteredFeedbacks(res.data);
      } catch (error) {
        console.error("Error fetching feedbacks", error);
      }
    };

    fetchSubjects();
    fetchTeachers();
    fetchFeedbacks();
  }, [username]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestData = {
      title: newFeedback.title,
      content: newFeedback.content,
      rating: newFeedback.rating,
      student: username,
      teacher: newFeedback.teacher,
      subject: newFeedback.subject,
    };

    // Log the request data
    console.log("Request Data:", requestData);

    try {
      await axios.post(
        "http://localhost:5000/api/feedback/create-feedback",
        requestData
      );

      setNewFeedback({
        title: "",
        content: "",
        rating: "",
        teacher: "",
        subject: "",
      });

      // Fetch updated feedbacks after successful submission
      const res = await axios.get(
        `http://localhost:5000/api/feedback/feedback-by-student/${username}`
      );
      setFeedbacks(res.data);
      setFilteredFeedbacks(res.data);
    } catch (error) {
      console.error("Error submitting feedback", error);
    }
  };

  const toggleDropdown = (menu) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarButton onClick={() => setSelectedTab("home")}>
          Home
        </SidebarButton>
        <SidebarButton onClick={() => toggleDropdown("subjects")}>
          Subjects
        </SidebarButton>
        <DropdownMenu open={dropdownOpen.subjects}>
          <SidebarButton onClick={() => setSelectedTab("manageSubjects")}>
            Manage Subjects
          </SidebarButton>
        </DropdownMenu>
        <SidebarButton onClick={() => toggleDropdown("feedback")}>
          Feedback
        </SidebarButton>
        <DropdownMenu open={dropdownOpen.feedback}>
          <SidebarButton onClick={() => setSelectedTab("manageFeedback")}>
            Manage Feedback
          </SidebarButton>
          <SidebarButton onClick={() => setSelectedTab("addFeedback")}>
            Add Feedback
          </SidebarButton>
        </DropdownMenu>
        <LogoutButton onClick={() => (window.location.href = "/login")}>
          Logout
        </LogoutButton>
      </Sidebar>

      <Content>
        <Header>
          <LogoContainer>
            <Logo src="RU-Logo.jpeg" alt="RU Logo" />
          </LogoContainer>
          <div>Welcome, {username}!</div>
        </Header>
        {selectedTab === "home" && (
          <div style={{ textAlign: "center" }}>
            <h2>Welcome to RU Student Feedback Platform</h2>
            <p>Here you can view and manage your subjects and feedback.</p>
          </div>
        )}
        {selectedTab === "manageSubjects" && (
          <TableContainer>
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Description</th>
                <th>Teacher</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <TableRow key={subject._id}>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.description}</TableCell>
                  <TableCell>{subject.teacher}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </TableContainer>
        )}
        {selectedTab === "manageFeedback" && (
          <TableContainer>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Feedback</th>
                <th>Rating</th>
                <th>Teacher</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((feedback) => (
                <TableRow key={feedback._id}>
                  <TableCell>{feedback.subject.name}</TableCell>
                  <TableCell>{feedback.content}</TableCell>
                  <TableCell>{feedback.rating}</TableCell>
                  <TableCell>{feedback.teacher?.username}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </TableContainer>
        )}
        {selectedTab === "addFeedback" && (
          <FeedbackForm onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Enter feedback title"
              value={newFeedback.title}
              onChange={(e) =>
                setNewFeedback({ ...newFeedback, title: e.target.value })
              }
              required
            />
            <Textarea
              placeholder="Enter your feedback"
              value={newFeedback.content}
              onChange={(e) =>
                setNewFeedback({ ...newFeedback, content: e.target.value })
              }
              required
            />
            <Input
              type="number"
              placeholder="Rating (1-5)"
              value={newFeedback.rating}
              onChange={(e) =>
                setNewFeedback({ ...newFeedback, rating: e.target.value })
              }
              required
            />
            <Input
              type="text"
              placeholder="Enter subject name"
              value={newFeedback.subject}
              onChange={(e) =>
                setNewFeedback({ ...newFeedback, subject: e.target.value })
              }
              required
            />
            <Input
              type="text"
              placeholder="Enter teacher's username"
              value={newFeedback.teacher}
              onChange={(e) =>
                setNewFeedback({ ...newFeedback, teacher: e.target.value })
              }
              required
            />
            {/* Log the request body being sent to the API */}
            <SubmitButton type="submit">Submit Feedback</SubmitButton>
          </FeedbackForm>
        )}
      </Content>
    </DashboardContainer>
  );
}

export default StudentDashboard;
