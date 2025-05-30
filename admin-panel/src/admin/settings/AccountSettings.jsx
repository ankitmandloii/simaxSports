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
  const [email, setEmail] = useState('admin@simaxapparel.com');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');


  const SettingsAdminInfosaved = () => {
    console.log('Settings saved:', { AdminName, email, oldPassword, newPassword });
   showToast({ content: 'Settings updated successfully!' });
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
            />
          </Box>
          <Box paddingBlockStart="300">
            <TextField
              label="Old Password"
              value={oldPassword}
              onChange={setOldPassword}
              autoComplete="tel"
            />
          </Box>
          <Box paddingBlockStart="300">
            <TextField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="tel"
            />
          </Box>
          <InlineStack align="end" paddingBlockStart="300">
            <Button variant="primary" onClick={SettingsAdminInfosaved}>
              Save Admin Info
            </Button>
          </InlineStack>
        </BlockStack>
      </Card>

    </Page>
  );

}