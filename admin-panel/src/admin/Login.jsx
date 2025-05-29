import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, FormLayout, TextField, Button, Card } from '@shopify/polaris';

export default function Login() {
      const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Validate email format
    const validateEmail = useCallback((value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
            return 'Email is required';
        } else if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
        }
        return '';
    }, []);

    // Validate password
    const validatePassword = useCallback((value) => {
        if (!value) {
            return 'Password is required';
        } else if (value.length < 5) {
            return 'Password must be at least 5 characters long';
        }
        return '';
    }, []);

    // Handle form submission
const handleLogin = useCallback(async () => {
    
 
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);

  setEmailError(emailValidation);
  setPasswordError(passwordValidation);

  if (emailValidation || passwordValidation) return;

  setLoading(true); // Start loading

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Login failed');
    }
     
    console.log('Login response:', data);
     localStorage.setItem('admin-token', data.result.token);
    // Success path
    console.log('Login success:', data);
    navigate('/admin/dashboard');
  } catch (error) {
    console.error('Login error:', error.message);
    setEmailError('Invalid email or password');
    setPasswordError('Invalid email or password');
  } finally {
    setLoading(false); // Stop loading
  }
}, [email, password, navigate, validateEmail, validatePassword]);


    // Handle input changes and clear errors
    const handleEmailChange = useCallback((value) => {
        setEmail(value);
        setEmailError(validateEmail(value));
    }, [validateEmail]);

    const handlePasswordChange = useCallback((value) => {
        setPassword(value);
        setPasswordError(validatePassword(value));
    }, [validatePassword]);

    return (
        <Page title="Admin Login">
            <Card sectioned>
                <FormLayout>
                    <TextField
                        label="Email"
                        value={email}
                        onChange={handleEmailChange}
                        autoComplete="email"
                        type="email"
                        error={emailError}
                    />
                    <TextField
                        label="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        type="password"
                        error={passwordError}
                    />
                    <Button onClick={handleLogin} primary loading={loading}>Login</Button>
                </FormLayout>
            </Card>
        </Page>
    );
}