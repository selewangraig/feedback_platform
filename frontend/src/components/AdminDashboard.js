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

const TableHeaderCell = styled.th`
  padding: 10px;
  text-align: left;
  background-color: #f2f2f2;
`;

const TableCell = styled.td`
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const InputField = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #5a009d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #7a3b9b;
  }
`;

const LogoutButton = styled(Button)`
  margin-top: auto;
`;

const Modal = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
  max-height: 80vh;
  overflow-y: auto;
`;

const StudentListItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

function AdminDashboard() {
  const { state } = useLocation();
  const username = state?.username;

  const [users, setUsers] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedTab, setSelectedTab] = useState("home");
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [newSubject, setNewSubject] = useState({
    name: "",
    description: "",
    teacher: "",
    students: [],
  });
  const [dropdownOpen, setDropdownOpen] = useState({
    users: false,
    subjects: false,
  });
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editUser, setEditUser] = useState({
    _id: "",
    username: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data);
    };

    const fetchSubjects = async () => {
      const res = await axios.get("http://localhost:5000/api/subjects");
      setSubjects(res.data);
    };

    fetchUsers();
    fetchSubjects();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://localhost:5000/api/admin/registerUser",
      newUser
    );
    setUsers([...users, res.data]);
    setNewUser({ username: "", password: "", role: "" });
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://localhost:5000/api/subjects/create-subject",
      newSubject
    );
    setSubjects([...subjects, res.data]);
    setNewSubject({ name: "", description: "", teacher: "", students: [] });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/updateUsers/${editUser._id}`,
        editUser
      );
      setUsers(
        users.map((user) => (user._id === editUser._id ? response.data : user))
      );
      setIsEditingUser(false);
      setEditUser({ _id: "", username: "", password: "", role: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setIsEditingUser(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/deleteUsers/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setShowModal(true);
  };

  const handleUpdateSubject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/subjects/update-subject/${editingSubject._id}`,
        editingSubject
      );
      setSubjects(
        subjects.map((subject) =>
          subject._id === editingSubject._id ? response.data : subject
        )
      );
      setEditingSubject(null);
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubjectStudentChange = (student) => {
    const isStudentAdded = editingSubject.students.includes(student._id);
    setEditingSubject({
      ...editingSubject,
      students: isStudentAdded
        ? editingSubject.students.filter((id) => id !== student._id)
        : [...editingSubject.students, student._id],
    });
  };

  const handleDeleteSubject = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/subjects/delete-subject/${id}`
      );
      setSubjects(subjects.filter((subject) => subject._id !== id));
    } catch (error) {
      console.error(error);
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
        <SidebarButton onClick={() => toggleDropdown("users")}>
          Users
        </SidebarButton>
        <DropdownMenu open={dropdownOpen.users}>
          <SidebarButton onClick={() => setSelectedTab("userManagement")}>
            Manage Users
          </SidebarButton>
          <SidebarButton onClick={() => setSelectedTab("addUser")}>
            Add User
          </SidebarButton>
        </DropdownMenu>
        <SidebarButton onClick={() => toggleDropdown("subjects")}>
          Subjects
        </SidebarButton>
        <DropdownMenu open={dropdownOpen.subjects}>
          <SidebarButton onClick={() => setSelectedTab("subjectManagement")}>
            Manage Subjects
          </SidebarButton>
          <SidebarButton onClick={() => setSelectedTab("addSubject")}>
            Add Subject
          </SidebarButton>
        </DropdownMenu>
        <SidebarButton onClick={() => setSelectedTab("analysis")}>
          Analysis
        </SidebarButton>
        <LogoutButton onClick={() => (window.location.href = "/login")}>
          Logout
        </LogoutButton>
      </Sidebar>

      <Content>
        <Header>
          <LogoContainer>
            <Logo src="RU-Logo.jpeg" alt="RU Logo" />
          </LogoContainer>
          <div>Welcome, {username || "root"}!</div>
        </Header>
        {selectedTab === "home" && (
          <div style={{ textAlign: "center" }}>
            <h2>Welcome to RU Student Feedback Platform</h2>
            <p>
              Here you can manage users, subjects, and analyze feedback data.
            </p>
          </div>
        )}
        {selectedTab === "userManagement" && (
          <>
            <TableContainer>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>User ID</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user._id}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEditUser(user)}>Edit</Button>
                      <Button onClick={() => handleDeleteUser(user._id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </TableContainer>
            {isEditingUser && (
              <FormContainer>
                <InputField
                  type="text"
                  placeholder="Username"
                  value={editUser.username}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                />
                <InputField
                  type="password"
                  placeholder="Password"
                  value={editUser.password}
                  onChange={(e) =>
                    setEditUser({ ...editUser, password: e.target.value })
                  }
                />
                <InputField
                  type="text"
                  placeholder="Role"
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                />
                <Button onClick={handleUpdateUser}>Update User</Button>
              </FormContainer>
            )}
          </>
        )}
        {selectedTab === "addUser" && (
          <FormContainer>
            <InputField
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <InputField
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <InputField
              type="text"
              placeholder="Role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            />
            <Button onClick={handleCreateUser}>Add User</Button>
          </FormContainer>
        )}
        {selectedTab === "subjectManagement" && (
          <>
            <TableContainer>
              <thead>
                <tr>
                  <TableHeaderCell>Subject Name</TableHeaderCell>
                  <TableHeaderCell>Description</TableHeaderCell>
                  <TableHeaderCell>Teacher</TableHeaderCell>
                  <TableHeaderCell>Students</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <TableRow key={subject._id}>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>{subject.description}</TableCell>
                    <TableCell>{subject.teacher}</TableCell>
                    <TableCell>
                      {subject.students.map((studentId) => {
                        const student = users.find(
                          (user) =>
                            user._id === studentId && user.role === "student"
                        );
                        return student ? `${student.username} ` : null;
                      })}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleEditSubject(subject)}>
                        Edit
                      </Button>
                      <Button onClick={() => handleDeleteSubject(subject._id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </TableContainer>
            {showModal && (
              <Modal>
                <ModalContent>
                  <h2>Edit Subject</h2>
                  <InputField
                    type="text"
                    placeholder="Subject Name"
                    value={editingSubject.name}
                    onChange={(e) =>
                      setEditingSubject({
                        ...editingSubject,
                        name: e.target.value,
                      })
                    }
                  />
                  <InputField
                    type="text"
                    placeholder="Description"
                    value={editingSubject.description}
                    onChange={(e) =>
                      setEditingSubject({
                        ...editingSubject,
                        description: e.target.value,
                      })
                    }
                  />
                  <InputField
                    type="text"
                    placeholder="Teacher"
                    value={editingSubject.teacher}
                    onChange={(e) =>
                      setEditingSubject({
                        ...editingSubject,
                        teacher: e.target.value,
                      })
                    }
                  />
                  <div>
                    <h3>Students</h3>
                    {users
                      .filter((user) => user.role === "student")
                      .map((user) => (
                        <StudentListItem key={user._id}>
                          <input
                            type="checkbox"
                            checked={editingSubject.students.includes(user._id)}
                            onChange={() => handleSubjectStudentChange(user)}
                            disabled={
                              editingSubject.students.includes(user._id) &&
                              editingSubject.students.filter(
                                (id) => id === user._id
                              ).length > 1
                            }
                          />
                          {user.username}
                        </StudentListItem>
                      ))}
                  </div>
                  <Button onClick={handleUpdateSubject}>Update Subject</Button>
                  <Button onClick={() => setShowModal(false)}>Cancel</Button>
                </ModalContent>
              </Modal>
            )}
          </>
        )}
        {selectedTab === "addSubject" && (
          <FormContainer>
            <InputField
              type="text"
              placeholder="Subject Name"
              value={newSubject.name}
              onChange={(e) =>
                setNewSubject({ ...newSubject, name: e.target.value })
              }
            />
            <InputField
              type="text"
              placeholder="Description"
              value={newSubject.description}
              onChange={(e) =>
                setNewSubject({ ...newSubject, description: e.target.value })
              }
            />
            <InputField
              type="text"
              placeholder="Teacher"
              value={newSubject.teacher}
              onChange={(e) =>
                setNewSubject({ ...newSubject, teacher: e.target.value })
              }
            />
            <div>
              <h3>Teacher</h3>
              {users
                .filter((user) => user.role === "teacher")
                .map((user) => (
                  <StudentListItem key={user._id}>
                    <input
                      type="radio"
                      name="teacher"
                      checked={newSubject.teacher === user.username}
                      onChange={() =>
                        setNewSubject({ ...newSubject, teacher: user.username })
                      }
                    />
                    {user.username}
                  </StudentListItem>
                ))}
            </div>
            <div>
              <h3>Students</h3>
              {users
                .filter((user) => user.role === "student")
                .map((user) => (
                  <StudentListItem key={user._id}>
                    <input
                      type="checkbox"
                      checked={newSubject.students.includes(user._id)}
                      onChange={() =>
                        setNewSubject({
                          ...newSubject,
                          students: newSubject.students.includes(user._id)
                            ? newSubject.students.filter(
                                (id) => id !== user._id
                              )
                            : [...newSubject.students, user._id],
                        })
                      }
                      disabled={
                        newSubject.students.includes(user._id) &&
                        newSubject.students.filter((id) => id === user._id)
                          .length > 1
                      }
                    />
                    {user.username}
                  </StudentListItem>
                ))}
            </div>
            <Button onClick={handleCreateSubject}>Add Subject</Button>
          </FormContainer>
        )}
      </Content>
    </DashboardContainer>
  );
}

export default AdminDashboard;
