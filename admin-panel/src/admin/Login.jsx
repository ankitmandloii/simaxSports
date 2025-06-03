import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Page,
    FormLayout,
    TextField,
    Button,
    Card,
    Box,
    Text,
} from '@shopify/polaris';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useToast } from './ToastContext';

export default function Login() {
    const { showToast } = useToast();
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

            showToast({ content: `${data.message}` });
            localStorage.setItem('admin-token', data.result.token);
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Login error:', error.message);
            showToast({ content: `${error.message}`, error: true });
            setEmailError('Invalid email or password');
            setPasswordError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    }, [email, password, navigate, validateEmail, validatePassword, BASE_URL, showToast]);

    const handleEmailChange = useCallback((value) => {
        setEmail(value);
        setEmailError(validateEmail(value));
    }, [validateEmail]);

    const handlePasswordChange = useCallback((value) => {
        setPassword(value);
        setPasswordError(validatePassword(value));
    }, [validatePassword]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin();
        }
    };
    return (
        <Page>
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '1rem',
                }}
            >
                <Card>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            maxWidth: '900px',
                            width: '100%',
                        }}
                    >
                        {/* Left Section - Logo and Text */}
                        <div
                            style={{
                                flex: 1,
                                padding: '2rem',
                                minWidth: '300px',
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <Box padding="400">
                                <img
                                    src="https://simaxapparel.com/cdn/shop/files/SimaxApparel_Logo.png?v=1734029356&width=340"
                                    alt="Logo"
                                    style={{ maxWidth: '100%', padding: '0 16px' }}
                                />
                            </Box>
                            <Text variant="headingXl" as="h2" color="subdued">
                                Welcome to the Admin Dashboard
                            </Text>
                            <Text variant="bodyMd" as="p" color="subdued">
                                Access the Simax Apparel Admin Panel to manage products, designs, and store operations. Please log in to continue.
                            </Text>
                            <Box paddingBlockStart="400">
                                <Text variant="bodySm" as="p" color="subdued">
                                    www.simaxapparel.com
                                </Text>
                            </Box>
                        </div>

                        {/* Right Section - Login Form */}
                        <div
                            style={{
                                flex: 1,
                                padding: '2rem',
                                minWidth: '300px',
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <Box paddingBlockEnd="400">
                                <Text variant="headingLg" as="h3">
                                    Login
                                </Text>
                            </Box>
                            <form onKeyDown={handleKeyDown}>
                                <FormLayout>
                                    <TextField
                                        label="Username"
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
                                        type={showPassword ? 'text' : 'password'}
                                        error={passwordError}
                                        suffix={
                                            <span
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '0 8px',
                                                }}
                                            >
                                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                            </span>
                                        }
                                    />
                                    <Button onClick={handleLogin} primary fullWidth loading={loading}>
                                        Login
                                    </Button>
                                </FormLayout>
                            </form>
                        </div>
                    </div>
                </Card>
            </div>
        </Page>
    );


}