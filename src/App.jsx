import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import { store } from './store';
import ThemeProvider from './components/providers/ThemeProvider';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <AppRoutes />
            <Toaster richColors position="top-right" />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

