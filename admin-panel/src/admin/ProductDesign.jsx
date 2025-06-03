// src/admin/ProductDesignList.js
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

export default function ProductDesignList() {
  const [designs, setDesigns] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 10;

  useEffect(() => {
    setLoading(true);
    fetch('https://fakestoreapi.com/products?limit=100') // Replace with real Product Design API
      .then((res) => res.json())
      .then((data) => {
        setDesigns(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Design API fetch failed:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const startIndex = (page - 1) * perPage;
    const paginatedData = designs.slice(startIndex, startIndex + perPage);

    const formatted = paginatedData.map((item) => [
      item.id.toString(),
      item.title,
      item.category,
      `$${item.price}`,
    ]);
    setRows(formatted);
  }, [designs, page]);

  const totalPages = Math.ceil(designs.length / perPage);

  return (
    <Page fullWidth title="Product Design List" subtitle="Manage your design templates here.">
      <Card sectioned>
        {loading ? (
          // 🧱 Skeleton instead of Spinner
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
                headings={['ID', 'Title', 'Category', 'Price']}
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
