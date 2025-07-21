import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Define translations directly in the file to avoid JSON parsing issues
const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Seenyor OS Portal!",
      "login_title": "Sign in to your account to continue",
      "email_label": "Email",
      "password_label": "Password",
      "sign_in_button": "Sign In",
      "signing_in": "Signing in...",
      "invalid_credentials": "Invalid credentials",
      "demo_access": "Demo Access",
      "use_demo_credentials": "Use Demo Credentials",
      "demo_email": "Email: admin@seenyor.com",
      "demo_password": "Password: admin123",
      "dashboard": "Dashboard",
      "logout": "Logout",
      "profile_settings": "Profile Settings",
      "preferences": "Preferences",
      "theme_customizer": "Theme Customizer",
      "switch_to_light_mode": "Switch to light mode",
      "switch_to_dark_mode": "Switch to dark mode",
      "notifications": "Notifications",
      "please_fill_all_fields": "Please fill in all fields",
      "login_failed": "Login failed. Please try again.",
      "enter_your_email": "Enter your email",
      "enter_your_password": "Enter your password",
      "demo_credentials": "Demo credentials:",
      "tenant_management": "Tenant Management",
      "user_management": "User Management",
      "device_management": "Device Management",
      "alerts_monitoring": "Alerts & Monitoring",
      "subscriptions": "Subscriptions",
      "reseller_management": "Reseller Management",
      "orders": "Orders",
      "customer_management": "Customer Management",
      "sales_commission": "Sales & Commission",
      "good_morning": "Good morning",
      "good_afternoon": "Good afternoon",
      "good_evening": "Good evening",
      "user": "User",
      "admin": "Administrator",
      "distributor": "Distributor",
      "reseller": "Reseller"
    }
  },
  es: {
    translation: {
      "welcome": "¡Bienvenido a Seenyor OS Portal!",
      "login_title": "Inicia sesión en tu cuenta para continuar",
      "email_label": "Correo electrónico",
      "password_label": "Contraseña",
      "sign_in_button": "Iniciar sesión",
      "signing_in": "Iniciando sesión...",
      "invalid_credentials": "Credenciales no válidas",
      "demo_access": "Acceso de demostración",
      "use_demo_credentials": "Usar credenciales de demostración",
      "demo_email": "Correo electrónico: admin@seenyor.com",
      "demo_password": "Contraseña: admin123",
      "dashboard": "Tablero",
      "logout": "Cerrar sesión",
      "profile_settings": "Configuración de perfil",
      "preferences": "Preferencias",
      "theme_customizer": "Personalizador de tema",
      "switch_to_light_mode": "Cambiar a modo claro",
      "switch_to_dark_mode": "Cambiar a modo oscuro",
      "notifications": "Notificaciones",
      "please_fill_all_fields": "Por favor, rellena todos los campos",
      "login_failed": "Error de inicio de sesión. Por favor, inténtalo de nuevo.",
      "enter_your_email": "Introduce tu correo electrónico",
      "enter_your_password": "Introduce tu contraseña",
      "demo_credentials": "Credenciales de demostración:",
      "tenant_management": "Gestión de inquilinos",
      "user_management": "Gestión de usuarios",
      "device_management": "Gestión de dispositivos",
      "alerts_monitoring": "Alertas y monitoreo",
      "subscriptions": "Suscripciones",
      "reseller_management": "Gestión de revendedores",
      "orders": "Pedidos",
      "customer_management": "Gestión de clientes",
      "sales_commission": "Ventas y comisión",
      "good_morning": "Buenos días",
      "good_afternoon": "Buenas tardes",
      "good_evening": "Buenas noches",
      "user": "Usuario",
      "admin": "Administrador",
      "distributor": "Distribuidor",
      "reseller": "Revendedor"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en", // use en if detected lng is not available
    debug: false,

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

