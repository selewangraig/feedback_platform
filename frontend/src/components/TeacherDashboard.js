// TeacherDashboard.js
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

function TeacherDashboard() {
  const { state } = useLocation();
  const username = state?.username;

  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedTab, setSelectedTab] = useState("home");
  const [dropdownOpen, setDropdownOpen] = useState({
    subjects: false,
    feedback: false,
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/subjects`);
        const subjectsForTeacher = res.data.filter(
          (subject) => subject.teacher === username
        );
        setSubjects(res.data);
        setFilteredSubjects(subjectsForTeacher);
      } catch (error) {
        console.error("Error fetching subjects", error);
      }
    };

    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/feedback/feedback-by-teacher/${username}`
        );
        setFeedbacks(res.data);
      } catch (error) {
        console.error("Error fetching feedbacks", error);
      }
    };

    fetchSubjects();
    fetchFeedbacks();
  }, [username]);

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
                <th>Students</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <TableRow key={subject._id}>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.description}</TableCell>
                  <TableCell>
                    {subject.students
                      .map((student) => student.username)
                      .join(", ")}
                  </TableCell>
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
                <th>Submitted By</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <TableRow key={feedback._id}>
                  <TableCell>{feedback.subject.name}</TableCell>
                  <TableCell>{feedback.content}</TableCell>
                  <TableCell>{feedback.student.username}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </TableContainer>
        )}
      </Content>
    </DashboardContainer>
  );
}

export default TeacherDashboard;
