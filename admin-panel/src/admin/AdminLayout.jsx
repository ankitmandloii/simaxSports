import {
  AppProvider, Frame, TopBar, Navigation, Page, Box, Text,
  Icon
} from '@shopify/polaris';
import {
  HomeIcon, ListNumberedIcon, OrderIcon, ProductIcon, SettingsIcon, PersonAddIcon, DiscountIcon
} from '@shopify/polaris-icons';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdSubdirectoryArrowRight } from "react-icons/md";
import {
  ExitIcon
} from '@shopify/polaris-icons';
import { useToast } from './ToastContext';
import Logo from './images/simaxDesignLogo.png'

export default function AdminLayout({ children }) {
  const { showToast } = useToast();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const navigate = useNavigate();
  const location = useLocation();


  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  // at top of AdminLayout
  // const BASE_URL = process.env.REACT_APP_BASE_URL;

  // ...

  // const handleSignOut = async () => {
  //   try {
  //     showToast({ content: 'Signing out…' });

  //     const token = localStorage.getItem('admin-token');

  //     // Call server to invalidate ALL sessions by bumping tokenVersion
  //     if (token) {
  //       await fetch(`${BASE_URL}auth/logout-all`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }).catch(() => { }); // even if it fails, proceed with local cleanup
  //     }
  //   } finally {
  //     // Client-side cleanup (do this regardless of server response)
  //     localStorage.removeItem('admin-token');
  //     sessionStorage.removeItem('otp-temp-token');  // if you used OTP step
  //     sessionStorage.removeItem('pending-email');   // if you stored email for OTP

  //     navigate('/admin/login');
  //   }
  // };


  // const logoutThisDevice = async () => {
  //   try {
  //     const token = localStorage.getItem('admin-token');
  //     if (token) {
  //       await fetch(`${BASE_URL}auth/logout`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }).catch(() => { });
  //     }
  //   } finally {
  //     localStorage.removeItem('admin-token');
  //     sessionStorage.removeItem('otp-temp-token');
  //     sessionStorage.removeItem('pending-email');
  //     navigate('/admin/login');
  //   }
  // };



  //  { icon: ExitIcon, content: 'Sign out (this device)', onAction: logoutThisDevice },
  //           { icon: ExitIcon, content: 'Sign out of all devices', onAction: handleSignOut },







  //without otp logic
  const handleSignOut = () => {
    showToast({
      content: 'Signing out...',
      duration: 1000,
      icon: <Icon source={ExitIcon} tone="success" />
    });
    setTimeout(() => {
      localStorage.removeItem('admin-token');
      localStorage.removeItem('activeLoginEmail');
      localStorage.removeItem('activeLoginUserName');

      navigate('/admin/login');
    }, 2000);


  };

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [
            {
              icon: ExitIcon,
              content: 'Sign out',
              onAction: handleSignOut,
            },
          ],
        },
      ]}
      name="Admin"
      avatar={{
        name: 'Admin',
        initials: '', // Leave empty to hide initials
        // source: '/icons/exit-icon.svg', // <-- Replace this with your image path
      }}
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
          src={Logo}
          // src="https://simaxapparel.com/cdn/shop/files/SimaxApparel_Logo.png?v=1734029356&width=340"
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
          // {
          //   label: 'Product Design List',
          //   icon: ListNumberedIcon,
          //   selected: location.pathname === '/admin/product-design',
          //   onClick: () => navigate('/admin/product-design'),
          // },
          // {
          //   label: 'Product List',
          //   icon: ProductIcon,
          //   selected: location.pathname === '/admin/product-list',
          //   onClick: () => navigate('/admin/product-list'),
          // },
          {
            label: 'Orders',
            icon: OrderIcon,
            selected: location.pathname === '/admin/orders',
            onClick: () => navigate('/admin/orders'),
          },
          {
            label: 'App Activity',
            icon: PersonAddIcon,
            selected: location.pathname.startsWith('/admin/activeUsers'),
            onClick: () => navigate('/admin/activeUsers'),
          },
          {
            label: 'Pricing And Discounts',
            icon: DiscountIcon,
            selected: location.pathname.startsWith('/admin/discountUpdate'),
            onClick: () => navigate('/admin/discountUpdate'),
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
            © 2025 SimaxDesign. All rights reserved.
          </Text>
        </footer>
      </Frame>
    </AppProvider>
  );
}
