import React, { useState, useEffect } from 'react';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import axios from 'axios';
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import typography from "assets/theme/base/typography";
import BuildByDevelopers from "layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "layouts/dashboard/components/WorkWithTheRockets";
import { Line } from 'react-chartjs-2';

function Dashboard() {
  const { size } = typography;
  const [monthlyData, setMonthlyData] = useState({});
  const [problems, setProblems] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [progressCount, setProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    fetchProblemCounts();
    fetchData();
  }, []);

  const fetchProblemCounts = async () => {
    try {
      const response = await axios.get('https://api-convergedinfrav2.vercel.app/views');
      setProblems(response.data.payload.datas);

      // Hitung jumlah data dalam setiap kategori
      setPendingCount(response.data.payload.datas.filter(problem => problem.status === 'pending').length);
      setProgressCount(response.data.payload.datas.filter(problem => problem.status === 'progress').length);
      setCompletedCount(response.data.payload.datas.filter(problem => problem.status === 'completed').length);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api-convergedinfrav2.vercel.app/views');
      const processedData = processData(response.data.payload.datas);
      setMonthlyData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processData = (data) => {
    // Inisialisasi objek untuk menyimpan data per bulan dan tahun
    const monthlyData = {};

    // Proses data dan hitung jumlah masalah per bulan dan tahun
    data.forEach(problem => {
      const date = new Date(problem.date);
      const monthYear = date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear();

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }

      monthlyData[monthYear] += 1;
    });

    return monthlyData;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Pending" }}
                count={pendingCount}
                icon={{ color: "info", component: "watch_later" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <MiniStatisticsCard
                title={{ text: "In Progress" }}
                count={progressCount}
                icon={{ color: "info", component: "sync" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Completed" }}
                count={completedCount}
                icon={{ color: "info", component: "check_circle" }}
              />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <BuildByDevelopers />
            </Grid>
            <Grid item xs={12} lg={5}>
              <WorkWithTheRockets />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Line
                  data={{
                    labels: Object.keys(monthlyData),
                    datasets: [{
                      label: 'Monthly Problems',
                      data: Object.values(monthlyData),
                      fill: false,
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1
                    }]
                  }}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: 'Monthly Problem Data Graph',
                        font: {
                          size: 16
                        }
                      },
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
