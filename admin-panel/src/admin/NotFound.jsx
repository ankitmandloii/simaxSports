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
      <Box
        minHeight="80vh" // make sure it fills most of the page
        display="flex"
        alignItems="center"
        justifyContent="center"
        background="bg-subdued"
        padding="8"
        borderRadius="2xl"
      >
        <Card>
          <Box padding="8" textAlign="center">
            <Text variant="heading2xl" as="h1" tone="critical">
              404 - Page Not Found
            </Text>
            <Text variant="bodyLg" tone="subdued" as="p" paddingBlockStart="4" paddingBlockEnd="6">
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
