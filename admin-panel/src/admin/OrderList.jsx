// src/admin/OrderList.js
import { Card, Page, Text } from '@shopify/polaris';

export default function OrderList() {
  return (

    <Page fullWidth title="Order List" subtitle="Manage your orders here.">
    <Card sectioned>
      <Text variant="heading2xl" as="h1">Order List</Text>
      <Text>A table of orders will be displayed here in future.</Text>
    </Card>
  </Page>
  );
}
