import {
  Page,
  Card,
  Text,
  Box,
  BlockStack,
  Divider,
  Icon,
  InlineStack,
  Button,
  IndexTable,
  useIndexResourceState
} from '@shopify/polaris';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '../admin/ToastContext';
import {
  PersonLockFilledIcon,
  InventoryUpdatedIcon
} from '@shopify/polaris-icons';

export default function ActiveUsers() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [activeUserNumber, setActiveUserNumber] = useState(0);
  const [users, setUsers] = useState([]);
  const animationRef = useRef();
  const currentNumberRef = useRef(0);

  const animateNumber = (start, end, duration = 800) => {
    const steps = 30;
    const stepDuration = duration / steps;
    const increment = (end - start) / steps;

    let current = start;
    let stepCount = 0;

    clearInterval(animationRef.current);

    animationRef.current = setInterval(() => {
      stepCount++;
      current += increment;

      if (stepCount >= steps) {
        clearInterval(animationRef.current);
        setActiveUserNumber(end);
        currentNumberRef.current = end;
      } else {
        setActiveUserNumber(Math.floor(current));
        currentNumberRef.current = Math.floor(current);
      }
    }, stepDuration);
  };

  const getActiveUsersWithLocation = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // simulate delay
      const BASE_URL = process.env.REACT_APP_BASE_URL;
      const token = localStorage.getItem('admin-token');
      const response = await fetch(`${BASE_URL}auth/getActiveUsersWithLocation`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Something went wrong');

      const data = await response.json();
      const newCount = data.activeUserCount;
      animateNumber(currentNumberRef.current, newCount);
      setUsers(data.users);

      showToast({
        content: `Active Users Fetched`,
        icon: <Icon source={InventoryUpdatedIcon} tone="success" />
      });

    } catch (error) {
      console.log("ERROR::::", error);
      showToast({ content: `${error.message}`, error: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(animationRef.current);
    };
  }, []);

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(users);

  return (
    <Page>
      <Card sectioned title="Account Settings" subtitle="Manage your account settings and preferences">
        <Box style={{ width: '16px', height: '16px' }}>
          <Icon source={PersonLockFilledIcon} tone="base" />
        </Box>
        <BlockStack gap="400">
          <Text variant="headingLg" as="h2">Active users on our design App</Text>
          <Text tone="subdued">Number of User Currently Using The App</Text>
          <Divider />
          <Text variant="headingLg" as="h2">Active users : {activeUserNumber}</Text>
          <InlineStack align="end" paddingBlockStart="300">
            <Button variant="primary" onClick={getActiveUsersWithLocation} loading={loading}>
              Get Active Count
            </Button>
          </InlineStack>
        </BlockStack>
      </Card>

      {users.length > 0 && (
        <Card title="Active Users with Location">
          <IndexTable
            resourceName={{ singular: 'user', plural: 'users' }}
            itemCount={users.length}
            selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: 'Anon ID' },
              { title: 'City' },
              { title: 'Country' },
              { title: 'Region' },
              { title: 'IP' },
              { title: 'Last Active' },
            ]}
            selectable={false}

          >
            {users.map((user, index) => (
              <IndexTable.Row
                id={user._id}
                key={user._id}
                selected={selectedResources.includes(user._id)}
                position={index}
              >
                <IndexTable.Cell>{user.anonId}</IndexTable.Cell>
                <IndexTable.Cell>{user.location?.city || '-'}</IndexTable.Cell>
                <IndexTable.Cell>{user.location?.country || '-'}</IndexTable.Cell>
                <IndexTable.Cell>{user.location?.region || '-'}</IndexTable.Cell>
                <IndexTable.Cell>{user.location?.ip || '-'}</IndexTable.Cell>
                <IndexTable.Cell>{new Date(user.lastActive).toLocaleString()}</IndexTable.Cell>
              </IndexTable.Row>
            ))}
          </IndexTable>
        </Card>
      )}
    </Page>
  );
}
