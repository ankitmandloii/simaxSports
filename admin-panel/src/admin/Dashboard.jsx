// src/admin/Dashboard.js
import {
  Page,
  Box,
  Text,
  Card,
  InlineStack,
  TextField,
  Icon,
  Button,
} from '@shopify/polaris';
import { useState } from 'react';

export default function Dashboard() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <Page fullWidth>
      <Box paddingBlockEnd="800">
        <Text variant="heading2xl" as="h1">
          Welcome to the Dashboard
        </Text>
      </Box>

      {[1, 2, 3, 4].map((_, index) => (
        <Card key={index}>
          <Box padding="500">
            <InlineStack gap="400" align="start">
              <div style={{ flex: 1, maxWidth: '300px' }}>
                <TextField
                  labelHidden
                  placeholder="Search Subscriptions"
                  value={searchValue}
                  onChange={setSearchValue}
                  prefix={<Icon source="" />}
                  autoComplete="off"
                />
              </div>
              <Button variant="tertiary" onClick={() => setSearchValue('')}>
                Cancel
              </Button>
            </InlineStack>
          </Box>
        </Card>
      ))}

      <Box paddingBlock="400">
        <Card>
          <Box padding="400">
            <InlineStack gap="200" wrap={false}>
              <Button size="slim">All Autoships</Button>
              <Button size="slim">All Products</Button>
              <Button size="slim">All Statuses</Button>
              <Button size="slim">All Processed</Button>
              <Button size="slim">All Dates</Button>
              <Button size="slim" variant="secondary">
                Add filter +
              </Button>
              <Button size="slim" variant="tertiary">
                Clear all
              </Button>
            </InlineStack>
          </Box>
        </Card>
      </Box>

      <Card sectioned>
        <Text>📋 Table would go here...</Text>
        <Text variant="bodySm" tone="subdued">
          (Add Polaris DataTable here for listing subscriptions)
        </Text>
      </Card>
    </Page>
  );
}
