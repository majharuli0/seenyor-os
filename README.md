# Seenyor OS Portal - Frontend Architecture

A modern, scalable React.js frontend application for the Seenyor OS Administrator Portal, featuring dynamic content rendering, comprehensive theming, and robust state management.

## 🏗️ Architecture Overview

This application is built with a modern React.js architecture that emphasizes:

- **Dynamic Content Rendering**: Role-based and tenant-specific content display
- **Comprehensive Theming**: Dark/light mode with custom branding support
- **Robust State Management**: Redux Toolkit with RTK Query for API management
- **Component-Based Design**: Reusable, maintainable components
- **Type Safety**: Structured data flow and validation

## 🚀 Key Features

### 1. Dynamic Content Rendering
- **Role-Based Rendering**: Components that show/hide based on user roles
- **Tenant-Specific Content**: Dynamic content based on tenant type and configuration
- **Feature Flag Support**: Conditional rendering based on enabled features
- **Permission-Based Access**: Fine-grained access control

### 2. Advanced Theming System
- **Dark/Light Mode**: Seamless theme switching
- **Custom Branding**: Per-tenant color schemes and logos
- **Dynamic Color Palette**: Real-time theme customization
- **Responsive Design**: Mobile-first approach with Ant Design

### 3. State Management
- **Redux Toolkit**: Modern Redux with simplified syntax
- **RTK Query**: Powerful data fetching and caching
- **Normalized State**: Efficient data structure
- **Optimistic Updates**: Enhanced user experience

## 📁 Project Structure

```
src/
├── components/
│   ├── common/           # Reusable components
│   │   ├── RoleBasedRenderer.jsx
│   │   └── TenantRenderer.jsx
│   ├── layout/           # Layout components
│   │   └── AppLayout.jsx
│   ├── providers/        # Context providers
│   │   └── ThemeProvider.jsx
│   └── theme/           # Theme-related components
│       └── ThemeCustomizer.jsx
├── pages/               # Page components
│   ├── Dashboard.jsx
│   └── TenantManagement.jsx
├── store/               # Redux store
│   ├── api/            # RTK Query API slices
│   │   ├── apiSlice.js
│   │   ├── authApi.js
│   │   ├── tenantApi.js
│   │   ├── userApi.js
│   │   └── deviceApi.js
│   ├── slices/         # Redux slices
│   │   ├── authSlice.js
│   │   ├── themeSlice.js
│   │   └── tenantSlice.js
│   └── index.js        # Store configuration
└── App.jsx             # Main application component
```

## 🎨 Theming System

### Theme Configuration
The theming system supports:
- **Mode**: Dark/Light theme switching
- **Primary Colors**: Customizable brand colors
- **Brand Colors**: Success, warning, error, secondary colors
- **Typography**: Font sizes and families
- **Border Radius**: Consistent border styling
- **Custom Branding**: Logo and company name per tenant

### Theme Customizer
Administrators can customize themes through the built-in Theme Customizer:
- Real-time color preview
- Brand color configuration
- Typography settings
- Logo upload support

## 🔐 Role-Based Access Control

### User Roles
- **Super Admin**: Full system access
- **Admin**: Tenant and user management
- **Distributor**: Reseller and inventory management
- **Reseller**: Customer and device management
- **End User**: Limited access to assigned resources

### Dynamic Rendering Components

#### RoleBasedRenderer
```jsx
<RoleBasedRenderer roles={['admin', 'super_admin']}>
  <AdminOnlyContent />
</RoleBasedRenderer>
```

#### TenantRenderer
```jsx
<TenantRenderer tenantTypes={['distributor']}>
  <DistributorSpecificContent />
</TenantRenderer>
```

## 🌐 API Integration

### RTK Query Features
- **Automatic Caching**: Intelligent data caching and invalidation
- **Background Refetching**: Keep data fresh automatically
- **Optimistic Updates**: Immediate UI updates
- **Error Handling**: Comprehensive error management
- **Loading States**: Built-in loading indicators

### API Slices
- **authApi**: Authentication and user management
- **tenantApi**: Tenant CRUD operations and configuration
- **userApi**: User management and permissions
- **deviceApi**: Device management and monitoring

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd seenyor-os-portal

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Available Scripts
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

## 📦 Dependencies

### Core Dependencies
- **React 18**: Modern React with hooks
- **Redux Toolkit**: State management
- **React Router**: Client-side routing
- **Ant Design**: UI component library
- **dayjs**: Date manipulation

### Development Dependencies
- **Vite**: Fast build tool
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 🎯 Component Guidelines

### RoleBasedRenderer Usage
```jsx
// Single role
<RoleBasedRenderer roles="admin">
  <AdminContent />
</RoleBasedRenderer>

// Multiple roles (OR logic)
<RoleBasedRenderer roles={['admin', 'super_admin']}>
  <AdminContent />
</RoleBasedRenderer>

// With permissions
<RoleBasedRenderer 
  roles="admin" 
  permissions={['tenant.create', 'tenant.update']}
>
  <TenantManagement />
</RoleBasedRenderer>

// With fallback content
<RoleBasedRenderer 
  roles="admin" 
  fallback={<div>Access Denied</div>}
>
  <AdminContent />
</RoleBasedRenderer>
```

### TenantRenderer Usage
```jsx
// Tenant type filtering
<TenantRenderer tenantTypes="distributor">
  <DistributorFeatures />
</TenantRenderer>

// Configuration requirements
<TenantRenderer 
  configRequirements={{ 
    commissionEnabled: true,
    multiTenant: true 
  }}
>
  <CommissionManagement />
</TenantRenderer>

// Specific tenant IDs
<TenantRenderer tenantIds={['tenant-123', 'tenant-456']}>
  <SpecificTenantContent />
</TenantRenderer>
```

## 🎨 Styling Guidelines

### Ant Design Theming
The application uses Ant Design's theme system with custom token overrides:

```jsx
// Theme configuration in ThemeProvider
const themeConfig = {
  token: {
    colorPrimary: primaryColor,
    colorSuccess: brandColors.success,
    colorWarning: brandColors.warning,
    colorError: brandColors.error,
    borderRadius: borderRadius,
    fontSize: typography.fontSize,
  },
  algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
};
```

### Custom CSS Variables
The application supports CSS custom properties for dynamic theming:

```css
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #ff4d4f;
}
```

## 🔄 State Management Patterns

### Redux Slice Structure
```javascript
const exampleSlice = createSlice({
  name: 'example',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});
```

### RTK Query API Slice
```javascript
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = selectAuthToken(getState());
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Tenant', 'User', 'Device'],
  endpoints: (builder) => ({
    // API endpoints
  }),
});
```

## 🚀 Deployment

### Production Build
```bash
# Build the application
pnpm run build

# Preview the build
pnpm run preview
```

### Environment Variables
Create a `.env` file for environment-specific configuration:
```env
VITE_API_BASE_URL=https://api.seenyoros.com
VITE_APP_NAME=Seenyor OS Portal
VITE_ENABLE_DEVTOOLS=false
```

## 🧪 Testing Strategy

### Component Testing
- Unit tests for individual components
- Integration tests for component interactions
- Visual regression testing for UI consistency

### State Management Testing
- Redux slice testing
- RTK Query endpoint testing
- State transition testing

### E2E Testing
- User workflow testing
- Role-based access testing
- Theme switching testing

## 📈 Performance Optimization

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy components

### Caching Strategy
- RTK Query automatic caching
- Browser caching for static assets
- Service worker for offline support

### Bundle Optimization
- Tree shaking for unused code
- Asset optimization
- Gzip compression

## 🔧 Troubleshooting

### Common Issues

1. **Theme not applying**: Check ThemeProvider wrapper
2. **API calls failing**: Verify base URL and authentication
3. **Role-based rendering not working**: Check user role in Redux state
4. **Build errors**: Clear node_modules and reinstall dependencies

### Debug Tools
- Redux DevTools for state inspection
- React Developer Tools for component debugging
- Network tab for API call monitoring

## 🤝 Contributing

### Code Style
- Use ESLint and Prettier for consistent formatting
- Follow React hooks best practices
- Use TypeScript-style JSDoc comments
- Maintain component prop documentation

### Pull Request Process
1. Create feature branch from main
2. Implement changes with tests
3. Update documentation
4. Submit pull request with description

## 📄 License

This project is proprietary software for Seenyor OS. All rights reserved.

## 📞 Support

For technical support or questions:
- Email: dev@seenyoros.com
- Documentation: [Internal Wiki]
- Slack: #frontend-support

# seenyor-os
