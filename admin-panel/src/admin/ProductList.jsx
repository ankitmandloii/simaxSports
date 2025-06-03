// src/admin/ProductList.js
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
  
} from '@shopify/polaris';

export default function ProductList() {
  const [allProducts, setAllProducts] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 10;

  useEffect(() => {
    setLoading(true);
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setAllProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('API fetch failed:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const startIndex = (page - 1) * perPage;
    const paginatedData = allProducts.slice(startIndex, startIndex + perPage);

    const formatted = paginatedData.map(product => [
      product.id.toString(),
      product.title,
      `$${product.price}`,
      product.category,
    ]);
    setRows(formatted);
  }, [allProducts, page]);

  const totalPages = Math.ceil(allProducts.length / perPage);

  return (
    <Page fullWidth title="Product List" subtitle="Manage your products from here.">
      <Card sectioned>
        {loading ? (
          // 🔄 Skeleton UI
          <BlockStack gap="300">
            <SkeletonDisplayText size="medium" />
            <SkeletonBodyText lines={12} />
            <InlineStack align="center" gap="400" wrap={false}>
              <SkeletonBodyText lines={1} />
            </InlineStack>
          </BlockStack>
        ) : (
          <>
            <div style={{ overflowX: 'auto', maxHeight: '600px' }}>
              <DataTable
                columnContentTypes={['text', 'text', 'text', 'text']}
                headings={['ID', 'Title', 'Price', 'Category']}
                rows={rows}
                footerContent={`Page ${page} of ${totalPages}`}
              />
            </div>

            <InlineStack align="center" gap="400" wrap={false} style={{ marginTop: '1rem' }}>
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <Text variant="bodyMd">{`Page ${page} of ${totalPages}`}</Text>
              <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </InlineStack>
          </>
        )}
      </Card>
    </Page>
  );
}
