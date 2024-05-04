// routes.js

import Dashboard from "layouts/dashboard";
import AddProblems from "layouts/tables";
import Billing from "layouts/billing";
import Profile from "layouts/profile";
import Login from "layouts/auth/Login"; // Tambahkan import untuk komponen Login
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import Test from "layouts/auth/Test";

const mainRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Add Problems",
    key: "add-problems",
    route: "/add-problems",
    icon: <Office size="12px" />,
    component: <AddProblems />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Views",
    key: "views",
    route: "/views",
    icon: <CreditCard size="12px" />,
    component: <Billing />,
    noCollapse: true,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
];

const loginRoutes = [
  // Rute untuk halaman login
  {
    type: "collapse",
    name: "Login",
    key: "login",
    route: "/login",
    component: <Login />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Test",
    key: "test",
    route: "/test",
    component: <Test />,
    noCollapse: true,
  },
];

export { mainRoutes, loginRoutes };
