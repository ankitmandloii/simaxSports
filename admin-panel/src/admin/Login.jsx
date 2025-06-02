import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, FormLayout, TextField, Button, Card, Text, Box } from '@shopify/polaris';

export default function Login() {




    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (localStorage.getItem('admin-token')) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);


    const validateEmail = useCallback((value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return 'Email is required';
        else if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
    }, []);

    const validatePassword = useCallback((value) => {
        if (!value) return 'Password is required';
        else if (value.length < 5) return 'Password must be at least 5 characters long';
        return '';
    }, []);

    const handleLogin = useCallback(async () => {
        const emailValidation = validateEmail(email);
        const passwordValidation = validatePassword(password);

        setEmailError(emailValidation);
        setPasswordError(passwordValidation);

        if (emailValidation || passwordValidation) return;

        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data?.message || 'Login failed');

            localStorage.setItem('admin-token', data.result.token);
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Login error:', error.message);
            setEmailError('Invalid email or password');
            setPasswordError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    }, [email, password, navigate, validateEmail, validatePassword, BASE_URL]);

    const handleEmailChange = useCallback((value) => {
        setEmail(value);
        setEmailError(validateEmail(value));
    }, [validateEmail]);

    const handlePasswordChange = useCallback((value) => {
        setPassword(value);
        setPasswordError(validatePassword(value));
    }, [validatePassword]);

    // Detect Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // prevent default form submission
            handleLogin();
        }
    };

    return (
        <Page>
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: '#f6f6f7',
                padding: '1rem',
            }}>
                <div style={{ width: '100%', maxWidth: '380px' }}>

                    <Card sectioned>
                          <Box padding="400">
                              <img
                                src="https://simaxapparel.com/cdn/shop/files/SimaxApparel_Logo.png?v=1734029356&width=340"
                                alt="Logo"
                                style={{ maxWidth: '100%', padding: '0 16px' }}
                              />
                            </Box>
                        <Text as="h1" variant="headingLg" alignment='center'>
                            Admin Login
                        </Text>
                        <form onKeyDown={handleKeyDown}>
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
                                <Button onClick={handleLogin} primary fullWidth loading={loading}>
                                    Login
                                </Button>
                            </FormLayout>
                        </form>
                    </Card>
                </div>
            </div>
        </Page>
    );

}
