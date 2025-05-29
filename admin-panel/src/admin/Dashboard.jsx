import { useState } from 'react';
import {
    AppProvider,
    Frame,
    TopBar,
    Navigation,
    Page,
    Card,
    Text,
    TextField,
    Icon,
    Button,
    InlineStack,
    Badge,
    Box,
} from '@shopify/polaris';
import { HomeIcon, ListNumberedIcon } from '@shopify/polaris-icons';

import '@shopify/polaris/build/esm/styles.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleSignOut = () => {
        localStorage.removeItem('admin-token'); // Remove token
        navigate('/admin/login'); // Redirect to login
    };
    const userMenuMarkup = (
        <TopBar.UserMenu
            actions={[{ items: [{ content: 'Sign out' ,
                onAction: handleSignOut
            }] }]}
            name="Admin"
            initials="A"
            open={isUserMenuOpen}
            onToggle={toggleUserMenu}
        />
    );

    const topBarMarkup = (
        <TopBar
            showNavigationToggle
            userMenu={userMenuMarkup}
            onNavigationToggle={toggleSidebar}
        />
    );

    const navigationMarkup = (
        <Navigation location="/">
            <Box padding="400">
                <img
                    src="https://simaxapparel.com/cdn/shop/files/SimaxApparel_Logo.png?v=1734029356&width=340"
                    alt="KimberBell"
                    style={{ maxWidth: '100%', padding: '0 16px' }} // Adjusted padding for logo
                />
            </Box>
            <Navigation.Section
                items={[
                    { label: 'Dashboard', icon: HomeIcon, url: '#', selected: true },
                    { label: 'Product Design List', icon: ListNumberedIcon, url: '#' },
                    { label: 'Setup', url: '#' },
                ]}
            />
        </Navigation>
    );

    return (
        <AppProvider i18n={{}}>
            <Frame
                topBar={topBarMarkup}
                navigation={navigationMarkup}
                showMobileNavigation={isSidebarOpen}
                onNavigationDismiss={toggleSidebar}
            >
                <Page fullWidth>
                    <Box paddingBlockEnd="800"> {/* Increased spacing below heading */}
                        <Text variant="heading2xl" as="h1">
                            Welcome to the Dashboard
                        </Text>
                    </Box>

                    <Card>
                        <Box padding="500"> {/* Adjusted padding */}
                            <InlineStack gap="400" align="start"> {/* Increased gap */}
                                <div style={{ flex: 1, maxWidth: '300px' }}> {/* Constrain TextField width */}
                                    <TextField
                                        labelHidden
                                        placeholder="Search Subscriptions"
                                        value={searchValue}
                                        onChange={setSearchValue}
                                        prefix={<Icon source={""} />}
                                        autoComplete="off"
                                    />
                                </div>
                                <Button variant="tertiary" onClick={() => setSearchValue('')}>
                                    Cancel
                                </Button>
                            </InlineStack>
                        </Box>
                    </Card>
                    <Card>
                        <Box padding="500"> {/* Adjusted padding */}
                            <InlineStack gap="400" align="start"> {/* Increased gap */}
                                <div style={{ flex: 1, maxWidth: '300px' }}> {/* Constrain TextField width */}
                                    <TextField
                                        labelHidden
                                        placeholder="Search Subscriptions"
                                        value={searchValue}
                                        onChange={setSearchValue}
                                        prefix={<Icon source={""} />}
                                        autoComplete="off"
                                    />
                                </div>
                                <Button variant="tertiary" onClick={() => setSearchValue('')}>
                                    Cancel
                                </Button>
                            </InlineStack>
                        </Box>
                    </Card>
                    <Card>
                        <Box padding="500"> {/* Adjusted padding */}
                            <InlineStack gap="400" align="start"> {/* Increased gap */}
                                <div style={{ flex: 1, maxWidth: '300px' }}> {/* Constrain TextField width */}
                                    <TextField
                                        labelHidden
                                        placeholder="Search Subscriptions"
                                        value={searchValue}
                                        onChange={setSearchValue}
                                        prefix={<Icon source={""} />}
                                        autoComplete="off"
                                    />
                                </div>
                                <Button variant="tertiary" onClick={() => setSearchValue('')}>
                                    Cancel
                                </Button>
                            </InlineStack>
                        </Box>
                    </Card>
                    <Card>
                        <Box padding="500"> {/* Adjusted padding */}
                            <InlineStack gap="400" align="start"> {/* Increased gap */}
                                <div style={{ flex: 1, maxWidth: '300px' }}> {/* Constrain TextField width */}
                                    <TextField
                                        labelHidden
                                        placeholder="Search Subscriptions"
                                        value={searchValue}
                                        onChange={setSearchValue}
                                        prefix={<Icon source={""} />}
                                        autoComplete="off"
                                    />
                                </div>
                                <Button variant="tertiary" onClick={() => setSearchValue('')}>
                                    Cancel
                                </Button>
                            </InlineStack>
                        </Box>
                    </Card>
                    <Box paddingBlock="400"> {/* Added spacing between cards */}
                        <Card>
                            <Box padding="400">
                                <InlineStack gap="200" wrap={false}> {/* Adjusted gap and no wrap */}
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

                <footer
                    style={{
                        width: '100%',
                        padding: '1rem',
                        textAlign: "center", // Alignlightgreyxt to the right as per screenshot
                        position: 'fixed',
                        bottom: 0,
                        background: 'lightgrey', // No background color as per screenshot
                        borderTop: 'none', // Remove border as per screenshot
                    }}
                >
                    <Text variant="bodySm" as="p">
                        © 2025 Your Company. All rights reserved.
                    </Text>
                </footer>
            </Frame>
        </AppProvider>
    );
}

export default Dashboard;