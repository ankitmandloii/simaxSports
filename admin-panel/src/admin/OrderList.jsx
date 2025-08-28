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
  Modal,
} from '@shopify/polaris';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function moneyFromSet(set) {
  const amt = set?.shopMoney?.amount ?? '';
  const cur = set?.shopMoney?.currencyCode ?? '';
  return amt !== '' && cur ? `${cur} ${amt}` : '';
}

function getAttr(node, key) {
  return node?.customAttributes?.find((a) => a?.key === key)?.value ?? '';
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

function designIdsSummary(order) {
  const edges = order?.lineItems?.edges ?? [];
  const ids = edges.map((e) => getAttr(e?.node, 'Design ID')).filter(Boolean);
  return ids.join(', ');
}

function shippingLineSummary(order) {
  const slNode = order?.shippingLines?.edges?.[0]?.node;
  if (!slNode) return '';
  const title = slNode.title ?? '';
  const priceStr = slNode.price ?? '';
  const currency = order?.currencyCode ?? '';
  const price = priceStr !== '' ? `${currency} ${priceStr}` : '';
  return [title, price].filter(Boolean).join(' ');
}

/** Gather all image URLs across line items for this order (de-duped) */
function allOrderImages(order) {
  const keysWeWant = new Set([
    'Preview Image',
    'Design Front',
    'Design Back',
    'Design Left',
    'Design Right',
  ]);

  const edges = order?.lineItems?.edges ?? [];
  const urls = [];

  for (const e of edges) {
    const n = e?.node;
    if (!n) continue;

    // Custom attribute images
    for (const a of n?.customAttributes ?? []) {
      if (a?.key && keysWeWant.has(a.key) && a?.value) {
        urls.push(a.value);
      }
    }

    // Fallback featured image if needed
    // const fromFeatured = n?.variant?.product?.featuredImage?.url;
    // if (fromFeatured) urls.push(fromFeatured);
  }

  return Array.from(new Set(urls.filter(Boolean)));
}

/** First image to show as the preview in the table */
function firstOrderImage(order) {
  const imgs = allOrderImages(order);
  return imgs[0] ?? '';
}

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 10;

  // Modal state
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [modalTitle, setModalTitle] = useState('');

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

  // Keyboard nav inside modal
  useEffect(() => {
    const onKey = (e) => {
      if (!imgModalOpen) return;
      if (e.key === 'ArrowLeft') {
        setActiveImgIdx((i) => Math.max(0, i - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveImgIdx((i) => Math.min(modalImages.length - 1, i + 1));
      } else if (e.key === 'Escape') {
        setImgModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [imgModalOpen, modalImages.length]);

  function openImageModal(order) {
    const imgs = allOrderImages(order);
    if (!imgs.length) return;
    setModalImages(imgs);
    setActiveImgIdx(0);
    setModalTitle(`${order?.name ?? 'Order'} — ${imgs.length} image${imgs.length > 1 ? 's' : ''}`);
    setImgModalOpen(true);
  }

  useEffect(() => {
    const startIndex = (page - 1) * perPage;
    const paginated = orders.slice(startIndex, startIndex + perPage);

    const formatted = paginated.map((order) => {
      const id = order?.id ?? '';
      const name = order?.name ?? '';
      const email = order?.email ?? '';
      const createdAt = order?.createdAt
        ? new Date(order.createdAt).toLocaleString()
        : '';
      const total = moneyFromSet(order?.totalPriceSet);
      const items = itemsSummary(order);
      const shipping = shippingLineSummary(order);
      const designIds = designIdsSummary(order);
      const previewUrl = firstOrderImage(order);
      const count = allOrderImages(order).length;

      const imgCell = previewUrl ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => openImageModal(order)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') openImageModal(order);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          title="Click to view all images"
        >
          <img
            src={previewUrl}
            alt="Order preview"
            style={{ height: 40, width: 40, objectFit: 'cover', borderRadius: 4, flex: '0 0 auto' }}
          />
          <span style={{ fontSize: 12, opacity: 0.8 }}>
            {count} image{count > 1 ? 's' : ''}
          </span>
        </div>
      ) : (
        ''
      );

      return [
        imgCell, // Image (clickable)
        id, // Order ID (GID)
        name, // Name (e.g. #1009)
        email, // Email
        createdAt, // Created At
        total, // Total
        items, // Items
        designIds, // Design IDs
        shipping, // Shipping
      ];
    });

    setRows(formatted);
  }, [orders, page]);

  const totalPages = Math.max(1, Math.ceil(orders.length / perPage));

  const hasPrev = activeImgIdx > 0;
  const hasNext = activeImgIdx < modalImages.length - 1;

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
                  'text', // Image cell (React node)
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                  'text',
                ]}
                headings={[
                  'Image',
                  'Order ID (GID)',
                  'Name',
                  'Email',
                  'Created At',
                  'Total',
                  'Items',
                  'Design IDs',
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

      {/* Image viewer modal */}
      <Modal
        open={imgModalOpen}
        onClose={() => setImgModalOpen(false)}
        title={modalTitle || 'Order images'}
      >
        <Modal.Section>
          {modalImages.length > 0 && (
            <div style={{ display: 'grid', gap: 12 }}>
              {/* Main viewer with overlay nav */}
              <div style={{ position: 'relative', width: '100%', minHeight: 320 }}>
                <img
                  src={modalImages[activeImgIdx]}
                  alt={`Order image ${activeImgIdx + 1} of ${modalImages.length}`}
                  style={{
                    width: '100%',
                    maxHeight: 480,
                    objectFit: 'contain',
                    borderRadius: 8,
                    display: 'block',
                    background: '#fafafa',
                  }}
                />

                {/* Left / Right controls */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 8,
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    gap: 8,
                  }}
                >
                  <Button
                    disabled={!hasPrev}
                    onClick={() => setActiveImgIdx((i) => Math.max(0, i - 1))}
                    accessibilityLabel="Previous image"
                  >
                    ‹
                  </Button>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: 8,
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    gap: 8,
                  }}
                >
                  <Button
                    disabled={!hasNext}
                    onClick={() => setActiveImgIdx((i) => Math.min(modalImages.length - 1, i + 1))}
                    accessibilityLabel="Next image"
                  >
                    ›
                  </Button>
                </div>

                {/* Counter */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 12,
                    padding: '4px 8px',
                    borderRadius: 12,
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    fontSize: 12,
                  }}
                >
                  {activeImgIdx + 1} / {modalImages.length}
                </div>
              </div>

              {/* Thumbnail strip */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  overflowX: 'auto',
                  paddingBottom: 4,
                }}
              >
                {modalImages.map((src, idx) => {
                  const isActive = idx === activeImgIdx;
                  return (
                    <img
                      key={src + idx}
                      src={src}
                      alt={`Thumbnail ${idx + 1}`}
                      onClick={() => setActiveImgIdx(idx)}
                      style={{
                        height: 64,
                        width: 64,
                        objectFit: 'cover',
                        borderRadius: 6,
                        border: isActive ? '2px solid #008060' : '1px solid #ddd',
                        boxShadow: isActive ? '0 0 0 2px rgba(0,128,96,0.2)' : 'none',
                        cursor: 'pointer',
                        flex: '0 0 auto',
                        background: '#fff',
                      }}
                    />
                  );
                })}
              </div>

              <InlineStack align="end">
                <Button onClick={() => setImgModalOpen(false)}>Close</Button>
              </InlineStack>
            </div>
          )}
        </Modal.Section>
      </Modal>
    </Page>
  );
}
