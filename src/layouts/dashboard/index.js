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

function Dashboard() {
  const { size } = typography;
  const [problems, setProblems] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [progressCount, setProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [inactiveTime, setInactiveTime] = useState(0); // State untuk melacak waktu inaktif
  const INACTIVE_THRESHOLD = 3 * 60 * 1000; // 3 menit dalam milidetik

  useEffect(() => {
    const interval = setInterval(() => {
      setInactiveTime(prevInactiveTime => prevInactiveTime + 1000); // Update waktu inaktif setiap detik
    }, 1000);

    // Hentikan interval jika komponen tidak lagi dirender atau saat komponen akan unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Reset waktu inaktif jika ada interaksi pengguna
    const resetInactiveTime = () => {
      setInactiveTime(0);
    };

    // Tambahkan event listener untuk interaksi pengguna
    document.addEventListener('mousemove', resetInactiveTime);
    document.addEventListener('keypress', resetInactiveTime);

    // Hapus event listener saat komponen akan unmount
    return () => {
      document.removeEventListener('mousemove', resetInactiveTime);
      document.removeEventListener('keypress', resetInactiveTime);
    };
  }, []);

  useEffect(() => {
    // Redirect ke halaman login jika waktu inaktif mencapai ambang batas
    if (inactiveTime >= INACTIVE_THRESHOLD) {
      redirectToLogin();
    }
  }, [inactiveTime]);

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

  const redirectToLogin = () => {
    // Redirect ke halaman login
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchProblemCounts();
  }, []);

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
            {/* Konten tambahan */}
          </Grid>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
