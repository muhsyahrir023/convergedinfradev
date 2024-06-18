import React, { useState, useEffect } from 'react';
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import axios from 'axios';
// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

import { Modal, Button, Form } from 'react-bootstrap';

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import PlaceholderCard from "examples/Cards/PlaceholderCard";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/kantor-bi.jpeg";
import homeDecor2 from "assets/images/kantor-bi.jpeg";
import homeDecor3 from "assets/images/kantor-bi.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import styled from "@emotion/styled";
import Swal from 'sweetalert2';

function Overview() {

  const [databaseCount, setDatabaseCount] = useState(0);
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('https://api-convergedinfrav2.vercel.app/views');
      if (response.data.payload && response.data.payload.status_code === 200) {
        setProblems(response.data.payload.datas);
      } else {
        alert('Failed to fetch data.');
      }
    } catch (error) {
      alert('Failed to fetch data.');
    }
  };

  const openEditModal = (index) => {
    setCurrentProblem(problems[index]);
    setEditItem({ ...problems[index] });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value });
  };

  const saveChanges = async () => {
    const editedData = {
      id: editItem.id,
      request: editItem.request,
      temporary: editItem.temporary,
      permanent: editItem.permanent,
      status: editItem.status,
      date: editItem.date
    };

    try {
      await axios.post('https://api-convergedinfrav2.vercel.app/api/update', editedData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setShowModal(false);
      fetchProblems();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data Updated successfully",
        showConfirmButton: false,
        timer: 2000
      });
    } catch (error) {
      console.error('Error Updated data:', error);

      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to updated data",
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  const fetchDatabaseCounts = async () => {
    try {
      const response = await axios.get('https://api-convergedinfrav2.vercel.app/tableSizes');
      setDatabaseCount(response.data[0]['Size (KB)']); // Assumsi pertama kali selalu "problems"
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchDatabaseCounts();
  }, []);

  return (
    <DashboardLayout>
      <Header />
      <SoftBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} xl={4}>
            <ProfileInfoCard
              title="profile information"
              description="we are bank indonesia master system engineers whose job is to carry out project maintenance converged infra development and preventive maintenance, this is filled in by the engineer himself as a recap report."
              info={{
                fullName: "Administrator",
                mobile: "085242732640",
                email: "@mastersystem.co.id",
                location: "ID",
              }}
              social={[
                {
                  link: "#",
                  icon: <FacebookIcon />,
                  color: "facebook",
                },
                {
                  link: "#",
                  icon: <TwitterIcon />,
                  color: "twitter",
                },
                {
                  link: "#",
                  icon: <InstagramIcon />,
                  color: "instagram",
                },
              ]}
              action={{ route: "", tooltip: "Edit Profile" }}
            />
          </Grid>
          <Grid item xs={12} sm={6} xl={4}>
            <MiniStatisticsCard
              title={{ text: "Firestore Firebase" }}
              icon={{
                color: "info",
                component: (
                  <a 
                    href="https://console.firebase.google.com/project/convergedinfra-3ded5/firestore/databases/-default-/data/~2F?hl=id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2a10 10 0 1 1-7.07 2.93A10 10 0 0 1 12 2m0-2a12 12 0 1 0 8.49 3.51A12 12 0 0 0 12 0z"/>
                      <path fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16.24 7.76L12 12 7.76 16.24M12 6v6h6"/>
                    </svg>
                  </a>
                ),
              }}
            />
          </Grid>
        </Grid>
      </SoftBox>
      <SoftBox mb={3}>
        <Card>
          <SoftBox pt={2} px={2}>
            <SoftBox mb={0.5}>
              <SoftTypography variant="h6" fontWeight="medium">
                Projects
              </SoftTypography>
            </SoftBox>
            <SoftBox mb={1}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                PT. Mastersystem Infotama Tbk at Bank Indonesia
              </SoftTypography>
            </SoftBox>
          </SoftBox>
          <SoftBox p={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} xl={3}>
                <DefaultProjectCard
                  image={homeDecor1}
                  label="project #1"
                  title="Converged Infra 2020"
                  description=""
                  action={{
                    type: "internal",
                    route: "/pages/profile/profile-overview",
                    color: "info",
                    label: "view project",
                  }}
                  authors={[
                    { image: team1, name: "Elena Morison" },
                    { image: team2, name: "Ryan Milly" },
                    { image: team3, name: "Nick Daniel" },
                    { image: team4, name: "Peterson" },
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <DefaultProjectCard
                  image={homeDecor2}
                  label="project #2"
                  title="Converged Infra 2021"
                  description=""
                  action={{
                    type: "internal",
                    route: "/pages/profile/profile-overview",
                    color: "info",
                    label: "view project",
                  }}
                  authors={[
                    { image: team3, name: "Nick Daniel" },
                    { image: team4, name: "Peterson" },
                    { image: team1, name: "Elena Morison" },
                    { image: team2, name: "Ryan Milly" },
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <DefaultProjectCard
                  image={homeDecor3}
                  label="project #3"
                  title="Converged Infra 2022"
                  description=""
                  action={{
                    type: "internal",
                    route: "/pages/profile/profile-overview",
                    color: "info",
                    label: "view project",
                  }}
                  authors={[
                    { image: team4, name: "Peterson" },
                    { image: team3, name: "Nick Daniel" },
                    { image: team2, name: "Ryan Milly" },
                    { image: team1, name: "Elena Morison" },
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <PlaceholderCard title={{ variant: "h5", text: "New project" }} outlined />
              </Grid>
            </Grid>
          </SoftBox>
        </Card>
      </SoftBox>
      
      <SoftBox mb={3}>
      <Card>
      <div className="container table-container">
        <p></p>
        <h5>Data Problems All</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>No</th>
              <th>Request</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr key={problem.id}>
                <td>{index + 1}</td>
                <td>{problem.request}</td>   
                <td>{problem.status}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => openEditModal(index)}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editItem && (
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Request:</Form.Label>
                  <Form.Control
                    type="text"
                    name="request"
                    value={editItem.request}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>No Ticket:</Form.Label>
                  <Form.Control
                    type="text"
                    name="temporary"
                    value={editItem.temporary}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Solution:</Form.Label>
                  <Form.Control
                    type="text"
                    name="permanent"
                    value={editItem.permanent}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Status:</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={editItem.status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="progress">Progress</option>
                    <option value="completed">Completed</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Date:</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={editItem.date}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={saveChanges}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
      </Card>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
