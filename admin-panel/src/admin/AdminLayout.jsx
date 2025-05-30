import {
    AppProvider, Frame, TopBar, Navigation, Page, Box, Text
} from '@shopify/polaris';
import {
    HomeIcon, ListNumberedIcon, OrderIcon, ProductIcon, SettingsIcon
} from '@shopify/polaris-icons';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout({ children }) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleSignOut = () => {
        localStorage.removeItem('admin-token');
        navigate('/admin/login');
    };

    const userMenuMarkup = (
        <TopBar.UserMenu
            actions={[{ items: [{ content: 'Sign out', onAction: handleSignOut }] }]}
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
        <Navigation location={location.pathname}>
            <Box padding="400">
                <img
                    src="https://simaxapparel.com/cdn/shop/files/SimaxApparel_Logo.png?v=1734029356&width=340"
                    alt="Logo"
                    style={{ maxWidth: '100%', padding: '0 16px' }}
                />
            </Box>
            <Navigation.Section
                items={[
                    { label: 'Dashboard', icon: HomeIcon, onClick: () => navigate('/admin/dashboard') },
                    { label: 'Product Design List', icon: ListNumberedIcon,onClick: () => navigate('/admin/product-design') },
                    { label: 'Product List', icon: ProductIcon, onClick: () => navigate('/admin/product-list') },
                    { label: 'Setting', icon: SettingsIcon, onClick: () => navigate('/admin/setting') },
                    { label: 'Order List', icon: OrderIcon, onClick: () => navigate('/admin/orders')},
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
                    {children}
                </Page>

                <footer
                    style={{
                        width: '100%',
                        padding: '1rem',
                        textAlign: "center",
                        position: 'fixed',
                        bottom: 0,
                        background: 'lightgrey',
                        borderTop: 'none',
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
