import React, { useState, useEffect } from 'react';
import Grid from "@mui/material/Grid";
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
      const response = await axios.get('https://api-cidev.vercel.app/views');
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
      const response = await axios.get('https://api-cidev.vercel.app/views');
      const monthlyData = processData(response.data.payload.datas);
      setMonthlyData(monthlyData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processData = (data) => {
    // Inisialisasi objek untuk menyimpan data per bulan
    const monthlyData = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    // Proses data dan hitung jumlah masalah per bulan
    data.forEach(problem => {
      const date = new Date(problem.date);
      const month = date.toLocaleString('default', { month: 'long' });
      monthlyData[month] += 1;
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
        text: 'Grafik Data Perbulan', // Judul grafik
        font: {
          size: 16
        }
      },
      legend: {
        display: false // Sembunyikan legenda
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }}
/>
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
