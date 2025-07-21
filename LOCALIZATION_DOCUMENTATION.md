# Localization (Multi-Language Support) Documentation

## Overview

The Seenyor OS Portal now supports multiple languages through a comprehensive localization system built with `react-i18next`. This implementation allows users to switch between languages dynamically and provides a scalable foundation for adding new languages in the future.

## Features

- **Dynamic Language Switching**: Users can change languages on-the-fly without page refresh
- **Automatic Language Detection**: The system detects the user's browser language preference
- **Fallback Support**: Falls back to English if the detected language is not available
- **Interpolation Support**: Supports dynamic content insertion (e.g., user names, role names)
- **Scalable Architecture**: Easy to add new languages and translation keys

## Supported Languages

- **English (en)**: Default language
- **Spanish (es)**: Secondary language

## Technical Implementation

### Libraries Used

- `i18next`: Core internationalization framework
- `react-i18next`: React bindings for i18next
- `i18next-browser-languagedetector`: Automatic language detection

### File Structure

```
src/
├── i18n.js                           # Main i18n configuration
├── components/
│   └── common/
│       └── LanguageSwitcher.jsx      # Language switching component
├── pages/
│   ├── LoginPage.jsx                 # Localized login page
│   └── Dashboard.jsx                 # Localized dashboard
└── components/
    ├── layout/
    │   └── AppLayout.jsx             # Localized navigation and layout
    └── dashboards/
        └── DynamicDashboard.jsx      # Localized dashboard content
```

### Configuration

The main configuration is in `src/i18n.js`:

```javascript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation resources are defined directly in the configuration
const resources = {
  en: { translation: { /* English translations */ } },
  es: { translation: { /* Spanish translations */ } }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false, // React already handles XSS protection
    },
  });
```

### Usage in Components

#### Basic Translation

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('login_title')}</p>
    </div>
  );
};
```

#### Translation with Interpolation

```javascript
const { t } = useTranslation();
const userName = "John Doe";

return <h1>{t('welcome_message', { userName })}</h1>;
// Renders: "Welcome, John Doe!" or "¡Bienvenido, John Doe!"
```

#### Language Switching

The `LanguageSwitcher` component provides a dropdown for language selection:

```javascript
import LanguageSwitcher from '../common/LanguageSwitcher';

// Usage in layout
<LanguageSwitcher />
```

## Translation Keys

### Authentication & Login
- `login_title`: Login page subtitle
- `email_label`: Email field label
- `password_label`: Password field label
- `sign_in_button`: Sign in button text
- `signing_in`: Loading state text
- `invalid_credentials`: Error message for invalid login
- `demo_credentials`: Demo credentials label

### Navigation & Layout
- `dashboard`: Dashboard menu item
- `logout`: Logout button
- `profile_settings`: Profile settings menu
- `preferences`: Preferences menu
- `theme_customizer`: Theme customizer option
- `notifications`: Notifications button

### Role-Based Menu Items
- `tenant_management`: Tenant management (Admin)
- `user_management`: User management (Admin)
- `device_management`: Device management (All roles)
- `alerts_monitoring`: Alerts & monitoring (Admin)
- `subscriptions`: Subscriptions (Admin)
- `reseller_management`: Reseller management (Distributor)
- `orders`: Orders (Distributor)
- `customer_management`: Customer management (Reseller)
- `sales_commission`: Sales & commission (Reseller)

### Dynamic Content
- `welcome_message`: Personalized welcome with user name
- `dashboard_overview`: Role-specific dashboard description
- `good_morning/afternoon/evening`: Time-based greetings

## Adding New Languages

### Step 1: Add Translation Resources

In `src/i18n.js`, add a new language object to the `resources`:

```javascript
const resources = {
  en: { translation: { /* English translations */ } },
  es: { translation: { /* Spanish translations */ } },
  fr: { translation: { /* French translations */ } }, // New language
};
```

### Step 2: Update Language Switcher

In `src/components/common/LanguageSwitcher.jsx`, add the new language option:

```javascript
<Select defaultValue={i18n.language} style={{ width: 120 }} onChange={handleChange}>
  <Option value="en">English</Option>
  <Option value="es">Español</Option>
  <Option value="fr">Français</Option> {/* New option */}
</Select>
```

### Step 3: Translate All Keys

Ensure all translation keys are translated for the new language. Missing keys will fall back to the default language (English).

## Adding New Translation Keys

### Step 1: Add to Resources

Add the new key to all language objects in `src/i18n.js`:

```javascript
const resources = {
  en: {
    translation: {
      // ... existing keys
      "new_feature": "New Feature",
    }
  },
  es: {
    translation: {
      // ... existing keys
      "new_feature": "Nueva Característica",
    }
  }
};
```

### Step 2: Use in Components

```javascript
const { t } = useTranslation();
return <button>{t('new_feature')}</button>;
```

## Best Practices

### Translation Keys
- Use descriptive, hierarchical key names (e.g., `auth.login.title`)
- Keep keys consistent across languages
- Use snake_case for key naming
- Group related keys logically

### Component Integration
- Import `useTranslation` hook in components that need translations
- Avoid hardcoded strings in JSX
- Use interpolation for dynamic content
- Test all language variants

### Performance
- Translations are loaded synchronously for better UX
- Consider lazy loading for large translation files
- Use namespaces for large applications

### Accessibility
- Ensure proper `lang` attribute is set on HTML elements
- Consider RTL (right-to-left) languages for future expansion
- Test with screen readers in different languages

## Browser Language Detection

The system automatically detects the user's preferred language using:
1. URL query parameter (`?lng=es`)
2. Local storage (`i18nextLng`)
3. Browser language settings
4. Fallback to English

## Persistence

Language preferences are automatically saved to browser local storage and persist across sessions.

## Testing

### Manual Testing
1. Switch languages using the language switcher
2. Verify all text updates immediately
3. Check that the selection persists after page refresh
4. Test with different browser language settings

### Automated Testing
Consider adding tests for:
- Translation key coverage
- Component rendering with different languages
- Language switching functionality
- Interpolation with dynamic values

## Future Enhancements

### Planned Features
- **Additional Languages**: French, German, Portuguese, Chinese
- **Pluralization**: Support for complex plural rules
- **Date/Time Formatting**: Locale-specific formatting
- **Number Formatting**: Currency and number localization
- **RTL Support**: Right-to-left language support

### Advanced Features
- **Lazy Loading**: Load translations on demand
- **Translation Management**: Integration with translation services
- **Context-Aware Translations**: Different translations based on context
- **Gender-Aware Translations**: Support for gendered languages

## Troubleshooting

### Common Issues

1. **Translations Not Updating**
   - Check if the translation key exists in all languages
   - Verify the component is using `useTranslation` hook
   - Ensure i18n is properly initialized

2. **Language Not Persisting**
   - Check browser local storage permissions
   - Verify LanguageDetector is properly configured

3. **Missing Translations**
   - Add missing keys to all language resources
   - Check for typos in translation keys
   - Verify fallback language is working

### Debug Mode

Enable debug mode in `src/i18n.js` for development:

```javascript
i18n.init({
  // ... other config
  debug: true, // Enable for development
});
```

This will log translation loading and missing key warnings to the console.

## Conclusion

The localization system provides a solid foundation for multi-language support in the Seenyor OS Portal. It's designed to be scalable, maintainable, and user-friendly, allowing for easy expansion to support additional languages and features as the application grows.

