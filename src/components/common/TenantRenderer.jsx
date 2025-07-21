import React from 'react';
import { useSelector } from 'react-redux';
import { 
  selectCurrentTenant, 
  selectTenantConfig, 
  selectFeatureFlags,
  selectIsDistributor,
  selectIsReseller,
  selectIsEndUser 
} from '../../store/slices/tenantSlice';

/**
 * TenantRenderer - Conditionally renders content based on tenant type and configuration
 * 
 * @param {Object} props
 * @param {string|string[]} props.tenantTypes - Required tenant type(s) to render content
 * @param {string|string[]} props.tenantIds - Specific tenant ID(s) to render content for
 * @param {Object} props.configRequirements - Required tenant configuration values
 * @param {React.ReactNode} props.children - Content to render if conditions are met
 * @param {React.ReactNode} props.fallback - Content to render if conditions are not met
 * @param {boolean} props.requireAll - If true, all conditions must be met (AND logic), otherwise any condition (OR logic)
 */
const TenantRenderer = ({ 
  tenantTypes, 
  tenantIds, 
  configRequirements, 
  children, 
  fallback = null, 
  requireAll = false 
}) => {
  const currentTenant = useSelector(selectCurrentTenant);
  const tenantConfig = useSelector(selectTenantConfig);
  const isDistributor = useSelector(selectIsDistributor);
  const isReseller = useSelector(selectIsReseller);
  const isEndUser = useSelector(selectIsEndUser);

  // Helper function to check if current tenant matches required types
  const hasRequiredTenantType = () => {
    if (!tenantTypes) return true;
    
    const typeArray = Array.isArray(tenantTypes) ? tenantTypes : [tenantTypes];
    
    if (requireAll) {
      return typeArray.every(type => {
        switch (type) {
          case 'distributor':
            return isDistributor;
          case 'reseller':
            return isReseller;
          case 'end_user':
            return isEndUser;
          default:
            return currentTenant?.type === type;
        }
      });
    } else {
      return typeArray.some(type => {
        switch (type) {
          case 'distributor':
            return isDistributor;
          case 'reseller':
            return isReseller;
          case 'end_user':
            return isEndUser;
          default:
            return currentTenant?.type === type;
        }
      });
    }
  };

  // Helper function to check if current tenant ID matches required IDs
  const hasRequiredTenantId = () => {
    if (!tenantIds) return true;
    
    const idArray = Array.isArray(tenantIds) ? tenantIds : [tenantIds];
    
    if (requireAll) {
      return idArray.every(id => currentTenant?.id === id);
    } else {
      return idArray.some(id => currentTenant?.id === id);
    }
  };

  // Helper function to check if tenant configuration meets requirements
  const hasRequiredConfig = () => {
    if (!configRequirements) return true;
    
    const configKeys = Object.keys(configRequirements);
    
    if (requireAll) {
      return configKeys.every(key => {
        const requiredValue = configRequirements[key];
        const actualValue = tenantConfig?.[key];
        
        if (typeof requiredValue === 'boolean') {
          return actualValue === requiredValue;
        } else if (Array.isArray(requiredValue)) {
          return requiredValue.includes(actualValue);
        } else {
          return actualValue === requiredValue;
        }
      });
    } else {
      return configKeys.some(key => {
        const requiredValue = configRequirements[key];
        const actualValue = tenantConfig?.[key];
        
        if (typeof requiredValue === 'boolean') {
          return actualValue === requiredValue;
        } else if (Array.isArray(requiredValue)) {
          return requiredValue.includes(actualValue);
        } else {
          return actualValue === requiredValue;
        }
      });
    }
  };

  // Determine if content should be rendered
  const shouldRender = () => {
    const conditions = [];
    
    if (tenantTypes) conditions.push(hasRequiredTenantType());
    if (tenantIds) conditions.push(hasRequiredTenantId());
    if (configRequirements) conditions.push(hasRequiredConfig());
    
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

export default TenantRenderer;

