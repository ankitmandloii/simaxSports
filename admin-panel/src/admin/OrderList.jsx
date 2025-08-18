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
  Modal,
  EmptyState
} from '@shopify/polaris';


const BASE_URL = process.env.REACT_APP_BASE_URL;


export default function OrderList() {
  const [allProducts, setAllProducts] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const perPage = 10;

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}customer/order-list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ limit: perPage, cursor }),
    })
      .then(res => res.json())
      .then(data => {
        if (data?.orders?.edges?.length === 0) {
          setAllProducts([]); // Empty list will be handled below
        } else {
          setAllProducts(data.orders.edges.map(edge => edge.node)); // Assuming data shape
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('API fetch failed:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const startIndex = (page - 1) * perPage;
    const paginatedData = allProducts?.slice(startIndex, startIndex + perPage);

    const formatted = paginatedData.map(product => [
      product.id.toString(),
      product.title,
      `$${product.price}`,
      product.category,
      <img src={product.image} alt="product" style={{ height: '40px', objectFit: 'contain', cursor: 'pointer' }} onClick={() => setSelectedImage(product.image)} />,
    ]);
    setRows(formatted);
  }, [allProducts, page]);

  const totalPages = Math.ceil(allProducts.length / perPage);

  return (
    <Page fullWidth title="Order List" subtitle="Manage your Orders from here.">
      <Card sectioned>
        {loading ? (
          // 🔄 Skeleton UI instead of spinner
          <BlockStack gap="300">
            <SkeletonDisplayText size="medium" />
            <SkeletonBodyText lines={12} />
            <InlineStack align="center" gap="400" wrap={false}>
              <SkeletonBodyText lines={1} />
            </InlineStack>
          </BlockStack>
        ) : allProducts.length === 0 ? (
          <EmptyState
            heading="No orders yet.."
            // action={{content: 'Add transfer'}}
            // secondaryAction={{
            //   content: 'Learn more',
            //   url: 'https://help.shopify.com',
            // }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Track and receive your incoming Orders from customers.</p>
          </EmptyState>
        ) : (
          <>
            <div style={{ overflowX: 'auto', maxHeight: '600px' }}>
              <DataTable
                columnContentTypes={['text', 'text', 'text', 'text', 'text']}
                headings={['ID', 'Title', 'Price', 'Category', 'Image']}
                rows={rows}
                footerContent={`${page}`}
              />
            </div>

            <InlineStack align="center" gap="400" wrap={false} style={{ marginTop: '1rem' }}>
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <Text variant="bodyMd">{`Page ${page} of ${totalPages}`}</Text>
              <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </InlineStack>
          </>
        )}

        {selectedImage && (
          <Modal
            open={true}
            onClose={() => setSelectedImage(null)}
            title="Product Image"
            large
          >
            <Modal.Section>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={selectedImage}
                  alt="Product"
                  style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                />
              </div>
            </Modal.Section>
          </Modal>
        )}
      </Card>
    </Page>

  );
}
