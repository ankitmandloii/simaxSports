// src/admin/NotFound.js
import { Page, Text } from "@shopify/polaris";

export default function NotFound() {
  return (
    <Page>
      <Text variant="headingLg" as="h1">404 - Page Not Found</Text>
      <Text variant="bodyMd">The page you're looking for doesn't exist.</Text>
    </Page>
  );
}
