import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  DataTable,
  Page,
  Text,
  InlineStack,
  BlockStack,
  SkeletonBodyText,
  SkeletonDisplayText,
  EmptyState,
} from '@shopify/polaris';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function moneyFromSet(set) {
  const amt = set?.shopMoney?.amount ?? '';
  const cur = set?.shopMoney?.currencyCode ?? '';
  return amt !== '' && cur ? `${cur} ${amt}` : '';
}

function itemsSummary(order) {
  const edges = order?.lineItems?.edges ?? [];
  if (!edges.length) return '';
  return edges
    .map((e) => {
      const n = e?.node;
      if (!n) return '';
      const qty =
        typeof n.quantity === 'number' && !Number.isNaN(n.quantity)
          ? ` x${n.quantity}`
          : '';
      return `${n.title ?? 'Item'}${qty}`;
    })
    .filter(Boolean)
    .join(', ');
}

function shippingLineSummary(order) {
  const slEdge = order?.shippingLines?.edges?.[0]?.node;
  if (!slEdge) return ''; // none
  const title = slEdge.title ?? '';
  const priceStr = slEdge.price ?? ''; // scalar string
  const currency = order?.currencyCode ?? '';
  const price = priceStr !== '' ? `${currency} ${priceStr}` : '';
  return [title, price].filter(Boolean).join(' ');
}

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 10;

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}customer/order-list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        const edges = data?.result?.data?.orders?.edges ?? [];
        const list = edges.map((e) => e?.node).filter(Boolean);
        setOrders(list);
        setLoading(false);
      })
      .catch((error) => {
        console.error('API fetch failed:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const startIndex = (page - 1) * perPage;
    const paginated = orders.slice(startIndex, startIndex + perPage);

    const formatted = paginated.map((order) => {
      const id = order?.id ?? '';
      const name = order?.name ?? ''; // e.g. "#1008"
      const email = order?.email ?? '';
      const createdAt = order?.createdAt
        ? new Date(order.createdAt).toLocaleString()
        : '';
      const total = moneyFromSet(order?.totalPriceSet);

      const items = itemsSummary(order);
      const shipping = shippingLineSummary(order);

      return [
        id,          // Order ID (GID)
        name,        // Name (e.g. #1008)
        email,       // Email
        createdAt,   // Created At
        total,       // Total (from totalPriceSet.shopMoney)
        items,       // Items (Title xQty, ...)
        shipping,    // Shipping (Title + currency price)
      ];
    });

    setRows(formatted);
  }, [orders, page]);

  const totalPages = Math.max(1, Math.ceil(orders.length / perPage));

  return (
    <Page fullWidth title="Order List" subtitle="Manage your Orders from here.">
      <Card sectioned>
        {loading ? (
          <BlockStack gap="300">
            <SkeletonDisplayText size="medium" />
            <SkeletonBodyText lines={12} />
            <InlineStack align="center" gap="400" wrap={false}>
              <SkeletonBodyText lines={1} />
            </InlineStack>
          </BlockStack>
        ) : orders.length === 0 ? (
          <EmptyState
            heading="No orders yet.."
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Track and receive your incoming Orders from customers.</p>
          </EmptyState>
        ) : (
          <>
            <div style={{ overflowX: 'auto', maxHeight: '600px' }}>
              <DataTable
                columnContentTypes={[
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                ]}
                headings={[
                  'Order ID (GID)',
                  'Name',
                  'Email',
                  'Created At',
                  'Total',
                  'Items',
                  'Shipping',
                ]}
                rows={rows}
                footerContent={`${page}`}
              />
            </div>

            <InlineStack
              align="center"
              gap="400"
              wrap={false}
              style={{ marginTop: '1rem' }}
            >
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Text variant="bodyMd">{`Page ${page} of ${totalPages}`}</Text>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </InlineStack>
          </>
        )}
      </Card>
    </Page>
  );
}
