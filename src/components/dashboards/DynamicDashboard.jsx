import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserRole, selectUser } from '../../store/slices/authSlice';
import { dashboardConfig } from '../../config/dashboardConfig';
import { useTranslation } from 'react-i18next';

const DynamicDashboard = () => {
  const { t } = useTranslation();
  const userRole = useSelector(selectUserRole);
  const user = useSelector(selectUser);

  // Determine which dashboard component to render based on user role
  const DashboardComponent = dashboardConfig[userRole]?.component || dashboardConfig.default.component;
  const dashboardTitle = dashboardConfig[userRole]?.title || dashboardConfig.default.title;
  const dashboardDescription = dashboardConfig[userRole]?.description || dashboardConfig.default.description;

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? t('good_morning') : hour < 18 ? t('good_afternoon') : t('good_evening');
    return `${greeting}, ${user?.name || t('user')}!`;
  };

  return (
    <div className="dynamic-dashboard">
      <h1 className="text-3xl font-bold mb-6">{getWelcomeMessage()}</h1>
      <p className="text-lg text-gray-600 mb-8">{t('dashboard_overview', { userRole: t(userRole) })}</p>
      <DashboardComponent />
    </div>
  );
};

export default DynamicDashboard;

