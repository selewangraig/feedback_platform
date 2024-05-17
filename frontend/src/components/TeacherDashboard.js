// TeacherDashboard.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f0f0; // Light background for overall container
`;

const Sidebar = styled.nav`
  width: 200px;
  background-color: #5a009d; // Purple background for sidebar
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); // Add shadow for depth
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
    background-color: #7a3b9b; // Lighter purple on hover
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
  background-color: white; // White background for content area
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #ddd; // Add a subtle border to separate header
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
  background-color: #5a009d; // Purple background for buttons
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: auto;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #7a3b9b; // Lighter purple on hover
  }
`;

function TeacherDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedTab, setSelectedTab] = useState("home");
  const [dropdownOpen, setDropdownOpen] = useState({
    subjects: false,
    feedback: false,
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await axios.get("http://localhost:5000/api/subjects");
      setSubjects(res.data);
    };

    const fetchFeedbacks = async () => {
      const res = await axios.get("http://localhost:5000//api/feedback");
      setFeedbacks(res.data);
    };

    fetchSubjects();
    fetchFeedbacks();
  }, []);

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
          <div>Welcome, Teacher!</div>
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
              {subjects.map((subject) => (
                <TableRow key={subject._id}>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.description}</TableCell>
                  <TableCell>{subject.students.join(", ")}</TableCell>
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
                  <TableCell>{feedback.subject}</TableCell>
                  <TableCell>{feedback.feedback}</TableCell>
                  <TableCell>{feedback.student}</TableCell>
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
