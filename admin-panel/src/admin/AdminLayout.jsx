import {
    AppProvider, Frame, TopBar, Navigation, Page, Box, Text
} from '@shopify/polaris';
import {
     HomeIcon, ListNumberedIcon, OrderIcon, ProductIcon, SettingsIcon
} from '@shopify/polaris-icons';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdSubdirectoryArrowRight } from "react-icons/md";

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
            initials="SO"
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
        {
          label: 'Dashboard',
          icon: HomeIcon,
          selected: location.pathname === '/admin/dashboard',
          onClick: () => navigate('/admin/dashboard'),
        },
        {
          label: 'Product Design List',
          icon: ListNumberedIcon,
          selected: location.pathname === '/admin/product-design',
          onClick: () => navigate('/admin/product-design'),
        },
        {
          label: 'Product List',
          icon: ProductIcon,
          selected: location.pathname === '/admin/product-list',
          onClick: () => navigate('/admin/product-list'),
        },
        {
          label: 'Order List',
          icon: OrderIcon,
          selected: location.pathname === '/admin/orders',
          onClick: () => navigate('/admin/orders'),
        },
        {
          label: 'Settings',
          icon: SettingsIcon,
          selected: location.pathname.startsWith('/admin/setting'),
          onClick: () => navigate('/admin/setting'),
        },
      ]}
    />

    {/* Render sub-navigation under Settings only when path matches */}
    {location.pathname.startsWith('/admin/setting') && (
 <Box paddingInlineStart="600" className="submenu" paddingBlock="200">
  
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div
      onClick={() => navigate('/admin/setting')}
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        fontWeight: location.pathname === '/admin/setting' ? 'bold' : 'normal',
        color: location.pathname === '/admin/setting' ? '#000' : '#666',
        padding: '6px 12px',
        borderRadius: '6px',
        backgroundColor: location.pathname === '/admin/setting' ? '#F1F1F1' : 'transparent',
      }}
    >
      <span style={{ width: '16px', marginRight: '8px' }}>
        {location.pathname === '/admin/setting' ? <MdSubdirectoryArrowRight /> : ''}
      </span>
      <span>General Settings</span>
    </div>

    <div
      onClick={() => navigate('/admin/setting/account-settings')}
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        fontWeight: location.pathname === '/admin/setting/account-settings' ? 'bold' : 'normal',
        color: location.pathname === '/admin/setting/account-settings' ? '#000' : '#666',
        padding: '6px 12px',
        borderRadius: '6px',
        backgroundColor: location.pathname === '/admin/setting/account-settings' ? '#F1F1F1' : 'transparent',
      }}
    >
      <span style={{ width: '16px', marginRight: '8px' }}>
        {location.pathname === '/admin/setting/account-settings' ? <MdSubdirectoryArrowRight /> : ''}
      </span>
      <span>Account Settings</span>
    </div>
  </div>
</Box>

)}

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
                      <div style={{ paddingBottom: '80px' }}>
                    {children}
                    </div>
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
                        © 2025 SimaxSports. All rights reserved.
                    </Text>
                </footer>
            </Frame>
        </AppProvider>
    );
}
