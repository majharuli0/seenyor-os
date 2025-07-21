import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserRole, selectUserPermissions } from '../../store/slices/authSlice';
import { selectFeatureFlags } from '../../store/slices/tenantSlice';

/**
 * RoleBasedRenderer - Conditionally renders content based on user roles and permissions
 * 
 * @param {Object} props
 * @param {string|string[]} props.roles - Required role(s) to render content
 * @param {string|string[]} props.permissions - Required permission(s) to render content
 * @param {string|string[]} props.features - Required feature flag(s) to render content
 * @param {React.ReactNode} props.children - Content to render if conditions are met
 * @param {React.ReactNode} props.fallback - Content to render if conditions are not met
 * @param {boolean} props.requireAll - If true, all conditions must be met (AND logic), otherwise any condition (OR logic)
 */
const RoleBasedRenderer = ({ 
  roles, 
  permissions, 
  features, 
  children, 
  fallback = null, 
  requireAll = false 
}) => {
  const userRole = useSelector(selectUserRole);
  const userPermissions = useSelector(selectUserPermissions);
  const featureFlags = useSelector(selectFeatureFlags);

  // Helper function to check if user has required roles
  const hasRequiredRoles = () => {
    if (!roles) return true;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    
    if (requireAll) {
      return roleArray.every(role => userRole === role);
    } else {
      return roleArray.some(role => userRole === role);
    }
  };

  // Helper function to check if user has required permissions
  const hasRequiredPermissions = () => {
    if (!permissions) return true;
    
    const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
    
    if (requireAll) {
      return permissionArray.every(permission => userPermissions.includes(permission));
    } else {
      return permissionArray.some(permission => userPermissions.includes(permission));
    }
  };

  // Helper function to check if required features are enabled
  const hasRequiredFeatures = () => {
    if (!features) return true;
    
    const featureArray = Array.isArray(features) ? features : [features];
    
    if (requireAll) {
      return featureArray.every(feature => featureFlags[feature] === true);
    } else {
      return featureArray.some(feature => featureFlags[feature] === true);
    }
  };

  // Determine if content should be rendered
  const shouldRender = () => {
    const conditions = [];
    
    if (roles) conditions.push(hasRequiredRoles());
    if (permissions) conditions.push(hasRequiredPermissions());
    if (features) conditions.push(hasRequiredFeatures());
    
    // If no conditions specified, render by default
    if (conditions.length === 0) return true;
    
    if (requireAll) {
      return conditions.every(condition => condition === true);
    } else {
      return conditions.some(condition => condition === true);
    }
  };

  return shouldRender() ? children : fallback;
};

export default RoleBasedRenderer;

