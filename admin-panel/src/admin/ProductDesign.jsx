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
} from '@shopify/polaris';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function ProductDesignList() {
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState([]); // store visited cursors for Prev
  const [endCursor, setEndCursor] = useState(null);
  const [startCursor, setStartCursor] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
   const [selectedImage, setSelectedImage] = useState(null);
  const perPage = 25;

  const fetchProducts = (cursor = null, direction = null) => {
    setLoading(true);

    fetch(`${BASE_URL}products/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: perPage, cursor }),
    })
      .then(res => res.json())
      .then(data => {
        const edges = data?.result?.data?.products?.edges || [];
        const pageInfo = data?.result?.data?.products?.pageInfo || {};

        const newProducts = edges.map(({ node }) => {
          const variants = node.variants.edges.map((v) => v.node);
          const colorMap = {};
          variants.forEach((variant) => {
            const color = variant.selectedOptions.find((opt) => opt.name === "Color")?.value;
            if (color && !colorMap[color]) {
              colorMap[color] = {
                name: color,
                img: variant.image?.originalSrc || "",
                variant,
              };
            }
          });

          return {
            name: node.title,
            imgurl: variants[0]?.image?.originalSrc,
            colors: Object.values(colorMap),
            allVariants: variants,
            id: node.id
          };
        });

        setProducts(newProducts);
        setStartCursor(pageInfo.startCursor);
        setEndCursor(pageInfo.endCursor);
        setHasNext(pageInfo.hasNextPage);
        setHasPrev(pageInfo.hasPreviousPage);

        setCursors(prev => {
          if (direction === 'next') {
            return [...prev, cursor]; // push current cursor
          } else if (direction === 'prev') {
            return prev.slice(0, -1); // pop last one
          } else {
            return prev;
          }
        });

        setPage(prev =>
          direction === 'next' ? prev + 1 :
            direction === 'prev' ? prev - 1 : prev
        );

        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  };


  useEffect(() => {
    fetchProducts(null); // initial fetch
  }, []);

  useEffect(() => {
    const formatted = products.map(product => [
      product.id.toString(),
      product.name,
      <img src={product.imgurl} alt="product" style={{ height: '40px', objectFit: 'contain', cursor: 'pointer' }} onClick={() => setSelectedImage(product.imgurl)}/>
    ]);
    setRows(formatted);
  }, [products]);

  return (
    <Page fullWidth title="Product List" subtitle="Manage your products from here.">
      <Card sectioned>
        {loading ? (
          <BlockStack gap="300">
            <SkeletonDisplayText size="medium" />
            <SkeletonBodyText lines={12} />
          </BlockStack>
        ) : (
          <>
            <div style={{ overflowX: 'auto', maxHeight: '600px' }}>
              <DataTable
                columnContentTypes={['text', 'text', 'text']}
                headings={['ID', 'Title', 'Image']}
                rows={rows}
               
              />
            </div>

            <InlineStack align="center" gap="400" wrap={false} style={{ marginTop: '1rem' }}>
              <Button
                disabled={!hasPrev || page === 0 || cursors.length < 1}
                onClick={() => fetchProducts(cursors[cursors.length - 2], 'prev')}
              >
                Previous
              </Button>
              <Text variant="bodyMd">{`Page ${page}`}</Text>
              <Button
                disabled={!hasNext}
                onClick={() => fetchProducts(endCursor, 'next')}
              >
                Next
              </Button>
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
