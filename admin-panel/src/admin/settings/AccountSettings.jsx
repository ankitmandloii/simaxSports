import {
  Page,
  Card,
  Text,
  TextField,
  InlineStack,
  Button,
  Box,
  Checkbox,
  BlockStack,
  Divider,
  Toast,
} from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { useToast } from '../ToastContext';


export default function AccountSettings() {
  const { showToast } = useToast();

  const [AdminName, setAdminName] = useState('admin');
  const [email, setEmail] = useState('adminsimax@yopmail.com');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');



  const validateEmail = useCallback((value) => {
    if(value.trim() == '') return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    else if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  }, []);

  const validatePassword = useCallback((value) => {
    if(value.trim() == '') return 'Password is required';
    if (!value) return 'Password is required';
    else if (value.length < 5) return 'Password must be at least 5 characters long';
    return '';
  }, []);


  const ChangePasswordAdmin = async () => {
    try {
      setLoading(true);

      const emailValidation = validateEmail(email);
      const passwordValidation = validatePassword(oldPassword);
      const newPasswordValidation = validatePassword(newPassword)


      setEmailError(emailValidation);
      setPasswordError(passwordValidation);
      setNewPasswordError(newPasswordValidation);

      if (emailValidation || passwordValidation || newPasswordValidation) return;

      const BASE_URL = process.env.REACT_APP_BASE_URL;



      const token = localStorage.getItem('admin-token');


      const response = await fetch(`${BASE_URL}auth/admin-change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });

      const data = await response.json();


      if (!response.ok) throw new Error(data?.message || 'Something Went Wrong');

      showToast({ content: `${data.message}` });

    } catch (error) {

      showToast({ content: `${error.message}`, error: true });
    } finally {
      setLoading(false);
    }





  };

  return (
    <Page>
      <Card sectioned title="Account Settings" subtitle="Manage your account settings and preferences">
        <BlockStack gap="400" >
          <Text variant="headingLg" as="h2">Change Password</Text>
          <Text tone="subdued">Update your Password And Basic contact info below.</Text>
          <Divider />
          <Box paddingBlockStart="300">
            <TextField
              label="Admin name"
              value={AdminName}
              onChange={setAdminName}
              autoComplete="off"
            />
          </Box>
          <Box paddingBlockStart="300">
            <TextField
              label="Admin Email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              error={emailError}
            />
          </Box>
          <Box paddingBlockStart="300">
            <TextField
              label="Old Password"
              value={oldPassword}
              onChange={setOldPassword}
              autoComplete="tel"
              error={passwordError}
            />
          </Box>
          <Box paddingBlockStart="300">
            <TextField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="tel"
              error={newPasswordError}
            />
          </Box>
          <InlineStack align="end" paddingBlockStart="300">
            <Button variant="primary" onClick={ChangePasswordAdmin} loading={loading}>
              Save Admin Info
            </Button>
          </InlineStack>
        </BlockStack>
      </Card>

    </Page>
  );

}