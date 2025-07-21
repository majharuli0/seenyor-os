import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2 } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        throw new Error(t('please_fill_all_fields'));
      }

      dispatch(loginStart());

      // Simulate API call
      const response = await new Promise(resolve => setTimeout(() => {
        if (formData.email === 'admin@seenyor.com' && formData.password === 'admin123') {
          resolve({
            user: { name: 'Admin User', email: formData.email },
            token: 'mock-admin-token',
            permissions: ['admin', 'dashboard', 'users'],
            role: 'admin',
            tenantId: 'mock-tenant-id'
          });
        } else {
          throw new Error(t('invalid_credentials'));
        }
      }, 1000));
      
      dispatch(loginSuccess(response));
      navigate('/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.message));
      setError(err.message || t('login_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Seenyor OS Portal
          </CardTitle>
          <CardDescription className="text-center">
            {t('login_title')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('email_label')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('enter_your_email')}
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('password_label')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t('enter_your_password')}
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('signing_in')}
                </>
              ) : (
                t('sign_in_button')
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>{t('demo_credentials')}</p>
            <p>{t('demo_email')}</p>
            <p>{t('demo_password')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

