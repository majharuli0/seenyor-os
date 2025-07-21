import NursingHomeDashboard from "../components/dashboards/NursingHomeDashboard";
import DistributorDashboard from "../components/dashboards/DistributorDashboard";
import ResellerDashboard from "../components/dashboards/ResellerDashboard";

export const dashboardConfig = {
  nursing_home: {
    component: NursingHomeDashboard,
    title: "Nursing Home Dashboard",
    description: "Overview for nursing home operations.",
  },
  distributor: {
    component: DistributorDashboard,
    title: "Distributor Dashboard",
    description: "Overview for distributor operations.",
  },
  reseller: {
    component: ResellerDashboard,
    title: "Reseller Dashboard",
    description: "Overview for reseller operations.",
  },
  // Add more roles and their respective dashboard configurations here
  // For roles without a specific dashboard, you can define a default or redirect them
  default: {
    component: NursingHomeDashboard, // Or a generic dashboard component
    title: "General Dashboard",
    description: "General overview.",
  },
};

