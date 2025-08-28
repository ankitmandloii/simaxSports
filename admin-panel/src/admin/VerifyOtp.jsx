// src/admin/VerifyOtp.jsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Page, Card, Box, Text, FormLayout, TextField, Button, Icon, InlineError } from '@shopify/polaris';
import { useToast } from './ToastContext';
import { EnterIcon } from '@shopify/polaris-icons';

export default function VerifyOtp() {
  const { showToast } = useToast();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();

  // we'll pass email via navigate state or fall back to storage
  const initialEmail = location.state?.email || sessionStorage.getItem('pending-email') || '';
  const [email] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // simple cooldown (60s) for resend
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      // if we got here without an email, send back to login
      navigate('/admin/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    let t;
    if (cooldown > 0) {
      t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [cooldown]);

  const validateOtp = useCallback((value) => {
    if (!value) return 'OTP is required';
    if (!/^\d{4,8}$/.test(value)) return 'Enter the 6-digit OTP';
    return '';
  }, []);

  const handleVerify = useCallback(async () => {
    const err = validateOtp(otp);
    setOtpError(err);
    if (err) return;

    setLoading(true);
    try {
      // short-lived temp token set by /auth/login
      const tempToken = sessionStorage.getItem('otp-temp-token');
      if (!tempToken) throw new Error('Session expired. Please login again.');

      const res = await fetch(`${BASE_URL}auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'OTP verification failed');

      // success: we now have the real admin token
      localStorage.setItem('admin-token', data.result.token);
      sessionStorage.removeItem('otp-temp-token');
      sessionStorage.removeItem('pending-email');

      showToast({
        content: 'Verified! Welcome back 👋',
        icon: <Icon source={EnterIcon} tone="success" />,
      });

      navigate('/admin/dashboard');
    } catch (e) {
      setOtpError(e.message);
    } finally {
      setLoading(false);
    }
  }, [otp, email, BASE_URL, validateOtp, navigate, showToast]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0) return;
    setResending(true);
    try {
      const tempToken = sessionStorage.getItem('otp-temp-token');
      if (!tempToken) throw new Error('Session expired. Please login again.');

      const res = await fetch(`${BASE_URL}auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Could not resend OTP');

      // Optional: server may refresh temp token
      if (data?.result?.tempToken) {
        sessionStorage.setItem('otp-temp-token', data.result.tempToken);
      }

      setCooldown(60);
      showToast({ content: 'OTP sent again to your email.' });
    } catch (e) {
      setOtpError(e.message);
    } finally {
      setResending(false);
    }
  }, [BASE_URL, email, cooldown, showToast]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    }
  };

  return (
    <Page>
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
        <Card>
          <div style={{ maxWidth: 520, padding: '2rem' }}>
            <Box paddingBlockEnd="400">
              <Text variant="headingLg" as="h3">Verify OTP</Text>
            </Box>

            <Text as="p" tone="subdued" variant="bodyMd">
              We sent a 6-digit code to <b>{email}</b>. Enter it below to continue.
            </Text>

            <form onKeyDown={onKeyDown}>
              <FormLayout>
                <TextField
                  label="One-Time Password"
                  value={otp}
                  onChange={setOtp}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  error={otpError}
                  placeholder="Enter 6-digit code"
                />

                {/* {otpError && <InlineError message={otpError} fieldID="otp" />} */}

                <Button primary fullWidth loading={loading} onClick={handleVerify}>
                  Verify & Continue
                </Button>

                <Button
                  fullWidth
                  disabled={resending || cooldown > 0}
                  loading={resending}
                  onClick={handleResend}
                  outline
                >
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                </Button>
              </FormLayout>
            </form>
          </div>
        </Card>
      </div>
    </Page>
  );
}
