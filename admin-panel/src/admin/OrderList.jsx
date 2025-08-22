// import { useEffect, useState } from 'react';
// import {
//   Button,
//   Card,
//   DataTable,
//   Page,
//   Text,
//   InlineStack,
//   BlockStack,
//   SkeletonBodyText,
//   SkeletonDisplayText,
//   Modal,
//   EmptyState
// } from '@shopify/polaris';


// const BASE_URL = process.env.REACT_APP_BASE_URL;


// export default function OrderList() {
//   const [allProducts, setAllProducts] = useState([]);
//   const [rows, setRows] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const perPage = 10;

//   useEffect(() => {
//     setLoading(true);
//     fetch(`${BASE_URL}customer/order-list`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       // body: JSON.stringify({ limit: perPage, cursor }),
//     })
//       .then(res => res.json())
//       .then(data => {

//         if (data?.result?.data?.orders?.edges?.length === 0) {
//           setAllProducts([]); // Empty list
//         } else {
//           setAllProducts(data?.result?.data?.orders?.edges.map(e => e.node));
//         }
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('API fetch failed:', error);
//         setLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     const startIndex = (page - 1) * perPage;
//     const paginatedData = allProducts?.slice(startIndex, startIndex + perPage);

//     const formatted = paginatedData.map(product => [
//       product.id.toString(),
//       product.title,
//       `$${product.price}`,
//       product.category,
//       <img src={product.image} alt="product" style={{ height: '40px', objectFit: 'contain', cursor: 'pointer' }} onClick={() => setSelectedImage(product.image)} />,
//     ]);
//     setRows(formatted);
//   }, [allProducts, page]);

//   const totalPages = Math.ceil(allProducts.length / perPage);

//   return (
//     <Page fullWidth title="Order List" subtitle="Manage your Orders from here.">
//       <Card sectioned>
//         {loading ? (
//           // 🔄 Skeleton UI instead of spinner
//           <BlockStack gap="300">
//             <SkeletonDisplayText size="medium" />
//             <SkeletonBodyText lines={12} />
//             <InlineStack align="center" gap="400" wrap={false}>
//               <SkeletonBodyText lines={1} />
//             </InlineStack>
//           </BlockStack>
//         ) : allProducts.length === 0 ? (
//           <EmptyState
//             heading="No orders yet.."
//             // action={{content: 'Add transfer'}}
//             // secondaryAction={{
//             //   content: 'Learn more',
//             //   url: 'https://help.shopify.com',
//             // }}
//             image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
//           >
//             <p>Track and receive your incoming Orders from customers.</p>
//           </EmptyState>
//         ) : (
//           <>
//             <div style={{ overflowX: 'auto', maxHeight: '600px' }}>
//               <DataTable
//                 columnContentTypes={['text', 'text', 'text', 'text', 'text']}
//                 headings={['ID', 'Title', 'Price', 'Category', 'Image']}
//                 rows={rows}
//                 footerContent={`${page}`}
//               />
//             </div>

//             <InlineStack align="center" gap="400" wrap={false} style={{ marginTop: '1rem' }}>
//               <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
//               <Text variant="bodyMd">{`Page ${page} of ${totalPages}`}</Text>
//               <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
//             </InlineStack>
//           </>
//         )}

//         {selectedImage && (
//           <Modal
//             open={true}
//             onClose={() => setSelectedImage(null)}
//             title="Product Image"
//             large
//           >
//             <Modal.Section>
//               <div style={{ textAlign: 'center' }}>
//                 <img
//                   src={selectedImage}
//                   alt="Product"
//                   style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
//                 />
//               </div>
//             </Modal.Section>
//           </Modal>
//         )}
//       </Card>
//     </Page>

//   );
// }
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
      // body: JSON.stringify({ limit: perPage, cursor }),
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
      const name = order?.name ?? '';
      const email = order?.email ?? '';
      const createdAt = order?.createdAt
        ? new Date(order.createdAt).toLocaleString()
        : '';
      const total = order?.totalPriceSet?.shopMoney
        ? `${order.totalPriceSet.shopMoney.currencyCode} ${order.totalPriceSet.shopMoney.amount}`
        : '';

      const items =
        order?.lineItems?.edges?.map((li) => {
          const n = li?.node;
          if (!n) return '';
          const qty = typeof n.quantity === 'number' ? ` x${n.quantity}` : '';
          return `${n.title ?? 'Item'}${qty}`;
        }).join(', ') ?? '';

      return [id, name, email, createdAt, total, items];
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
                columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text']}
                headings={['Order ID (GID)', 'Name', 'Email', 'Created At', 'Total', 'Items']}
                rows={rows}
                footerContent={`${page}`}
              />
            </div>

            <InlineStack align="center" gap="400" wrap={false} style={{ marginTop: '1rem' }}>
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Text variant="bodyMd">{`Page ${page} of ${totalPages}`}</Text>
              <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </InlineStack>
          </>
        )}
      </Card>
    </Page>
  );
}
