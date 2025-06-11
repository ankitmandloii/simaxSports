import {
    Page,
    Card,
    Text,
    //   TextField,
    //   InlineStack,
    //   Button,
    Box,
    BlockStack,
    Divider,
    Icon,
    InlineStack,
    Button,
} from '@shopify/polaris';
import { useState } from 'react';
import { useToast } from '../admin/ToastContext';
import {
    PersonLockFilledIcon,
    InventoryUpdatedIcon
} from '@shopify/polaris-icons';


export default function AccountSettings() {
    const { showToast } = useToast();


    const [loading, setLoading] = useState(false);
    const [activeUserNumber, setActiveUserNumber] = useState(0);





    const ActiveUsers = async () => {

        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            const BASE_URL = process.env.REACT_APP_BASE_URL;
            const token = localStorage.getItem('admin-token');
            const response = await fetch(`${BASE_URL}auth/get-active-user-count`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(data?.message || 'Something Went Wrong');

            const data = await response.json();
            // console.log("response from API ", data.activeUserCount);
            setActiveUserNumber(data.activeUserCount);

            showToast({
                content: `Active Users Fetched`,
                icon: <Icon source={InventoryUpdatedIcon} tone="success" />
            });

        } catch (error) {

            showToast({ content: `${error.message}`, error: true });
        } finally {
            setLoading(false);
        }





    };

    return (
        <Page>
            <Card sectioned title="Account Settings" subtitle="Manage your account settings and preferences">
                <Box style={{ width: '16px', height: '16px' }}>
                    <Icon source={PersonLockFilledIcon} tone="base" />
                </Box>
                <BlockStack gap="400" >
                    <Text variant="headingLg" as="h2">Active users on our design App</Text>
                    <Text tone="subdued">Number of User Currntly Using The App</Text>
                    <Divider />
                    <Text variant="headingLg" as="h2" >Active users : {activeUserNumber}</Text>

                    <InlineStack align="end" paddingBlockStart="300">
                        <Button variant="primary" onClick={ActiveUsers} loading={loading}>
                            Get Active Count
                        </Button>
                    </InlineStack>
                </BlockStack>
            </Card>

        </Page>
    );

}