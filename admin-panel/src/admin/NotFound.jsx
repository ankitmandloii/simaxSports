// src/admin/NotFound.js
import { Page, Text, Button, Card, Box } from "@shopify/polaris";
import { IconsIcon } from "@shopify/polaris-icons";

import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/admin/dashboard");
  };

  return (
    <Page fullWidth>
      <Box padding="8" background="bg-subdued" borderRadius="2xl">
        <Card>
          <Box padding="8" textAlign="center">
          
              <Text variant="heading2xl" as="h1" tone="critical">
                404 - Page Not Found
              </Text>
              <Text variant="bodyLg">
                Oops! The page you're looking for doesn't exist or has been moved.
              </Text>
              <Button icon={IconsIcon} onClick={handleGoHome} primary>
                Go to Dashboard
              </Button>
            
          </Box>
        </Card>
      </Box>
    </Page>
  );
}
