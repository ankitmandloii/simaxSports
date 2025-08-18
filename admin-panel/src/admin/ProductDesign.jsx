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
import Left from './images/leftttt.jpg'

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function ProductDesignList() {
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState([]);
  const [endCursor, setEndCursor] = useState(null);
  const [startCursor, setStartCursor] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
            return [...prev, cursor];
          } else if (direction === 'prev') {
            return prev.slice(0, -1);
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
    fetchProducts(null);
  }, []);

  useEffect(() => {
    const formatted = products.map(product => [
      product.name,
      <img
        src={product.imgurl}
        alt="product"
        style={{ height: '40px', objectFit: 'contain', cursor: 'pointer' }}
        onClick={() => {
          const frontImage = product.imgurl;
          const staticBack = Left;
          const staticLeft = product.imgurl;
          const staticRight = Left;

          setSelectedImages([frontImage, staticBack, staticLeft, staticRight]);
          setCurrentIndex(0);
        }}
      />,
      "10*10"
    ]);
    setRows(formatted);
  }, [products]);

  return (
    <Page fullWidth title="Product Design List" subtitle="Manage your designs from here.">
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
                headings={['Title', 'Image', `Dimension`]}
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

        {selectedImages.length > 0 && (
          <Modal
            open={true}
            onClose={() => {
              setSelectedImages([]);
              setCurrentIndex(0);
            }}
            title="Product Images"
            large
          >
            <Modal.Section>
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <img
                  src={selectedImages[currentIndex]}
                  alt={`Product view ${currentIndex + 1}`}
                  style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                />

                {selectedImages.length > 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      right: 0,
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0 20px',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <Button
                      onClick={() => setCurrentIndex((i) => (i > 0 ? i - 1 : selectedImages.length - 1))}
                    >
                      ‹
                    </Button>
                    <Button
                      onClick={() => setCurrentIndex((i) => (i + 1) % selectedImages.length)}
                    >
                      ›
                    </Button>
                  </div>
                )}
              </div>
            </Modal.Section>
          </Modal>
        )}
      </Card>
    </Page>
  );
}
