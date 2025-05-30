// src/admin/Setting.js
import {
  Page,
  Card,
  Text,
  TextField,
  InlineStack,
  Button,
  Box,
} from '@shopify/polaris';
import { useState } from 'react';

export default function Setting() {
  const [storeName, setStoreName] = useState('Simax Apparel');
  const [email, setEmail] = useState('admin@simaxapparel.com');
  const [phone, setPhone] = useState('+1 123-456-7890');

  const handleSave = () => {
    // Add your save logic here (e.g., API call)
    console.log('Settings saved:', { storeName, email, phone });
  };

  return (
    <Page title="Settings" fullWidth>
      <Card sectioned>
        <Text variant="headingLg" as="h2">
          Store Information
        </Text>
        <Box paddingBlockStart="400">
          <TextField
            label="Store name"
            value={storeName}
            onChange={setStoreName}
            autoComplete="off"
          />
        </Box>
        <Box paddingBlockStart="400">
          <TextField
            label="Email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
        </Box>
        <Box paddingBlockStart="400">
          <TextField
            label="Phone"
            value={phone}
            onChange={setPhone}
            autoComplete="tel"
          />
        </Box>
        <Box paddingBlockStart="400">
          <InlineStack>
            <Button variant="primary" onClick={handleSave}>
              Save Settings
            </Button>
          </InlineStack>
        </Box>
      </Card>
    </Page>
  );
}
