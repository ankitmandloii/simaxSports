import {
  Page,
  Card,
  Text,
  Box,
  BlockStack,
  Divider,
  Icon,
  InlineStack,
  Button,
  IndexTable,
  Badge,
  ProgressBar,
  EmptyState,
  useIndexResourceState
} from '@shopify/polaris';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '../admin/ToastContext';
import {
  PersonLockFilledIcon,
  InventoryUpdatedIcon
} from '@shopify/polaris-icons';

export default function ActiveUsers() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [activeUserNumber, setActiveUserNumber] = useState(0);
  const [users, setUsers] = useState([]);
  const animationRef = useRef();
  const currentNumberRef = useRef(0);

  const animateNumber = (start, end, duration = 800) => {
    const steps = 30;
    const stepDuration = duration / steps;
    const increment = (end - start) / steps;

    let current = start;
    let stepCount = 0;

    clearInterval(animationRef.current);

    animationRef.current = setInterval(() => {
      stepCount++;
      current += increment;

      if (stepCount >= steps) {
        clearInterval(animationRef.current);
        setActiveUserNumber(end);
        currentNumberRef.current = end;
      } else {
        setActiveUserNumber(Math.floor(current));
        currentNumberRef.current = Math.floor(current);
      }
    }, stepDuration);
  };

  const getActiveUsersWithLocation = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
      const BASE_URL = process.env.REACT_APP_BASE_URL;
      const token = localStorage.getItem('admin-token');
      const response = await fetch(`${BASE_URL}auth/getActiveUsersWithLocation`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Something went wrong');

      const data = await response.json();
      const newCount = data.activeUserCount;
      animateNumber(currentNumberRef.current, newCount);
      setUsers(data.users);

      showToast({
        content: `Active Users Fetched`,
        icon: <Icon source={InventoryUpdatedIcon} tone="success" />
      });

    } catch (error) {
      console.log("ERROR::::", error);
      showToast({ content: `${error.message}`, error: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(animationRef.current);
    };
  }, []);

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(users);

  const uniqueCountries = [...new Set(users.map(u => u.location?.country).filter(Boolean))];
  const progressValue = Math.min((activeUserNumber / 100) * 100, 100); // Example scale

  return (
    <Page>
      <Card padding="300" rounded>

        <InlineStack align="space-between" blockAlign="center">
          <InlineStack gap="300">
            <Box style={{ width: '20px', height: '20px' }}>
              <Icon source={PersonLockFilledIcon} tone="base" />
            </Box>
            <Text variant="headingMd">Active Users on Design App</Text>
          </InlineStack>
          <Button variant="primary" onClick={getActiveUsersWithLocation} loading={loading}>
            Refresh
          </Button>
        </InlineStack>

        <div style={{ marginTop: "1rem" }} >

          <BlockStack gap="400" paddingBlockStart="300" >
            {/* <InlineStack gap="400" wrap>
              <Card padding="400" rounded background="bg-surface-secondary" shadow="base">
                <BlockStack align="center">
                  <Text tone="subdued" variant="bodySm">Active Users</Text>
                  <Text variant="heading2xl" fontWeight="bold" tone="success">
                    {activeUserNumber}
                  </Text>
                </BlockStack>
              </Card>

              <Card padding="400" rounded background="bg-surface-secondary" shadow="base">
                <BlockStack align="center">
                  <Text tone="subdued" variant="bodySm">Unique Countries</Text>
                  <Text variant="heading2xl" fontWeight="bold">
                    {uniqueCountries.length}
                  </Text>
                </BlockStack>
              </Card>
            </InlineStack> */}
            <InlineStack gap="400" wrap>
              <Card padding="200" rounded background="bg-surface-secondary" shadow="base">
                <BlockStack align="center" gap="100">
                  <Text tone="subdued" variant="bodySm">Active Users</Text>
                  <Text variant="headingLg" fontWeight="bold" tone="success">
                    {activeUserNumber}
                  </Text>
                </BlockStack>
              </Card>

              <Card padding="200" rounded background="bg-surface-secondary" shadow="base">
                <BlockStack align="center" gap="100">
                  <Text tone="subdued" variant="bodySm">Unique Countries</Text>
                  <Text variant="headingLg" fontWeight="bold">
                    {uniqueCountries.length}
                  </Text>
                </BlockStack>
              </Card>
            </InlineStack>



            <Box paddingBlock="100" paddingInline="200">
              <ProgressBar
                progress={progressValue}
                tone="highlight"
                size="small"
                animated
              />
            </Box>
          </BlockStack>
        </div>
      </Card>

      <Divider />

      {users.length > 0 ? (
        <Card title="Active Users with Location" padding="300" rounded>
          <Box maxHeight="400px" overflow="auto">
            <IndexTable
              resourceName={{ singular: 'user', plural: 'users' }}
              itemCount={users.length}
              selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: 'Anon ID' },
                { title: 'City' },
                { title: 'Region' },
                { title: 'IP' },
                { title: 'Last Active' },
              ]}
              selectable={false}
            >
              {users.map((user, index) => (
                <IndexTable.Row
                  id={user._id}
                  key={user._id}
                  selected={selectedResources.includes(user._id)}
                  position={index}
                >
                  <IndexTable.Cell>
                    <Text as="span" fontWeight="medium" fontFamily="monospace">
                      {user.anonId}
                    </Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>{user.location?.city || '-'}</IndexTable.Cell>
                  <IndexTable.Cell>{user.location?.region || '-'}</IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" fontFamily="monospace">{user.location?.ip || '-'}</Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>{new Date(user.lastActive).toLocaleString()}</IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </Box>
        </Card>
      ) : (
        <Card padding="300" rounded>
          <EmptyState
            heading="No active users yet"
            action={{ content: 'Refresh', onAction: getActiveUsersWithLocation, loading }}
          >
            <p>Click refresh to load the latest active users.</p>
          </EmptyState>
        </Card>
      )}
    </Page>

    // <Page>
    //   <Card padding="500" rounded>
    //     <InlineStack align="space-between" blockAlign="center">
    //       <InlineStack gap="400">
    //         <Box style={{ width: '24px', height: '24px' }}>
    //           <Icon source={PersonLockFilledIcon} tone="base" />
    //         </Box>
    //         <Text variant="headingLg">Active Users on Design App</Text>
    //       </InlineStack>
    //       <Button variant="primary" onClick={getActiveUsersWithLocation} loading={loading}>
    //         Refresh
    //       </Button>
    //     </InlineStack>

    //     <BlockStack gap="500" paddingBlockStart="400" margin='200'>
    //       <InlineStack gap="400" wrap={false}>
    //         <Card background="bg-surface-secondary" padding="300">
    //           <BlockStack gap="100" align="center">
    //             <Text tone="subdued">Active Users</Text>
    //             <Text variant="heading2xl" tone="success">{activeUserNumber}</Text>
    //           </BlockStack>
    //         </Card>

    //         <Card background="bg-surface-secondary" padding="300">
    //           <BlockStack gap="100" align="center">
    //             <Text tone="subdued">Unique Countries</Text>
    //             <Text variant="heading2xl">{uniqueCountries.length}</Text>
    //           </BlockStack>
    //         </Card>
    //       </InlineStack>

    //       <Box paddingBlock="200">
    //         <ProgressBar progress={progressValue} tone="success" />
    //       </Box>
    //     </BlockStack>
    //   </Card>

    //   <Divider />

    //   {users.length > 0 ? (
    //     <Card title="Active Users with Location" padding="300">
    //       <Box maxHeight="400px" overflow="auto">
    //         <IndexTable
    //           resourceName={{ singular: 'user', plural: 'users' }}
    //           itemCount={users.length}
    //           selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
    //           onSelectionChange={handleSelectionChange}
    //           headings={[
    //             { title: 'Anon ID' },
    //             { title: 'City' },
    //             // { title: 'Country' },
    //             { title: 'Region' },
    //             { title: 'IP' },
    //             { title: 'Last Active' },
    //           ]}
    //           selectable={false}
    //         >
    //           {users.map((user, index) => (
    //             <IndexTable.Row
    //               id={user._id}
    //               key={user._id}
    //               selected={selectedResources.includes(user._id)}
    //               position={index}
    //             >
    //               <IndexTable.Cell>
    //                 <Text as="span" fontWeight="medium" fontFamily="monospace">
    //                   {user.anonId}
    //                 </Text>
    //               </IndexTable.Cell>
    //               <IndexTable.Cell>{user.location?.city || '-'}</IndexTable.Cell>
    //               {/* <IndexTable.Cell>
    //                 {user.location?.country
    //                   ? <Badge tone="success">{user.location.country}</Badge>
    //                   : '-'}
    //               </IndexTable.Cell> */}
    //               <IndexTable.Cell>{user.location?.region || '-'}</IndexTable.Cell>
    //               <IndexTable.Cell>
    //                 <Text as="span" fontFamily="monospace">{user.location?.ip || '-'}</Text>
    //               </IndexTable.Cell>
    //               <IndexTable.Cell>{new Date(user.lastActive).toLocaleString()}</IndexTable.Cell>
    //             </IndexTable.Row>
    //           ))}
    //         </IndexTable>
    //       </Box>
    //     </Card>
    //   ) : (
    //     <Card padding="300">

    //       <EmptyState
    //         heading="No active users yet"
    //         action={{ content: 'Refresh', onAction: getActiveUsersWithLocation, loading }}
    //       >

    //         <p>Click refresh to load the latest active users.</p>
    //       </EmptyState>
    //     </Card>
    //   )}
    // </Page>
  );
}




/////////////////////////////


// import {
//   Page,
//   Card,
//   Text,
//   Box,
//   BlockStack,
//   Divider,
//   Icon,
//   InlineStack,
//   Button,
//   IndexTable,
//   ProgressBar,
//   EmptyState,
//   useIndexResourceState
// } from '@shopify/polaris';
// import { useEffect, useRef, useState } from 'react';
// import { useToast } from '../admin/ToastContext';
// import {
//   PersonLockFilledIcon,
//   InventoryUpdatedIcon
// } from '@shopify/polaris-icons';
// import GlobeView from './GlobeView';

// export default function ActiveUsers() {
//   const { showToast } = useToast();

//   const [loading, setLoading] = useState(false);
//   const [activeUserNumber, setActiveUserNumber] = useState(0);
//   const [users, setUsers] = useState([]);
//   const animationRef = useRef();
//   const currentNumberRef = useRef(0);

//   const animateNumber = (start, end, duration = 800) => {
//     const steps = 30;
//     const stepDuration = duration / steps;
//     const increment = (end - start) / steps;

//     let current = start;
//     let stepCount = 0;

//     clearInterval(animationRef.current);

//     animationRef.current = setInterval(() => {
//       stepCount++;
//       current += increment;

//       if (stepCount >= steps) {
//         clearInterval(animationRef.current);
//         setActiveUserNumber(end);
//         currentNumberRef.current = end;
//       } else {
//         setActiveUserNumber(Math.floor(current));
//         currentNumberRef.current = Math.floor(current);
//       }
//     }, stepDuration);
//   };

//   const getActiveUsersWithLocation = async () => {
//     try {
//       setLoading(true);
//       await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
//       const BASE_URL = process.env.REACT_APP_BASE_URL;
//       const token = localStorage.getItem('admin-token');
//       const response = await fetch(`${BASE_URL}auth/getActiveUsersWithLocation`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) throw new Error('Something went wrong');

//       const data = await response.json();
//       const newCount = data.activeUserCount;
//       animateNumber(currentNumberRef.current, newCount);
//       setUsers(data.users);

//       showToast({
//         content: `Active Users Fetched`,
//         icon: <Icon source={InventoryUpdatedIcon} tone="success" />
//       });

//     } catch (error) {
//       console.log("ERROR::::", error);
//       showToast({ content: `${error.message}`, error: true });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       clearInterval(animationRef.current);
//     };
//   }, []);

//   const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(users);

//   const uniqueCountries = [...new Set(users.map(u => u.location?.country).filter(Boolean))];
//   const progressValue = Math.min((activeUserNumber / 100) * 100, 100); // Example scale

//   return (
//     <Page>
//       <Card padding="300" rounded>
//         <InlineStack align="space-between" blockAlign="center">
//           <InlineStack gap="300">
//             <Box style={{ width: '20px', height: '20px' }}>
//               <Icon source={PersonLockFilledIcon} tone="base" />
//             </Box>
//             <Text variant="headingMd">Active Users on Design App</Text>
//           </InlineStack>
//           <Button variant="primary" onClick={getActiveUsersWithLocation} loading={loading}>
//             Refresh
//           </Button>
//         </InlineStack>

//         <div style={{ marginTop: "1rem" }} >
//           <BlockStack gap="400" paddingBlockStart="300" >
//             <InlineStack gap="400" wrap>
//               <Card padding="200" rounded background="bg-surface-secondary" shadow="base">
//                 <BlockStack align="center" gap="100">
//                   <Text tone="subdued" variant="bodySm">Active Users</Text>
//                   <Text variant="headingLg" fontWeight="bold" tone="success">
//                     {activeUserNumber}
//                   </Text>
//                 </BlockStack>
//               </Card>

//               <Card padding="200" rounded background="bg-surface-secondary" shadow="base">
//                 <BlockStack align="center" gap="100">
//                   <Text tone="subdued" variant="bodySm">Unique Countries</Text>
//                   <Text variant="headingLg" fontWeight="bold">
//                     {uniqueCountries.length}
//                   </Text>
//                 </BlockStack>
//               </Card>
//             </InlineStack>
//             <Box paddingBlock="100" paddingInline="200">
//               <ProgressBar
//                 progress={progressValue}
//                 tone="highlight"
//                 size="small"
//                 animated
//               />
//             </Box>
//           </BlockStack>
//         </div>
//       </Card>

//       <Divider />

//       {/* Globe Container with Centering */}
//       <Card title="Active Users Globe" padding="300" rounded>
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%" }}>
//           <GlobeView users={users} />
//         </div>
//       </Card>

//       <Divider />

//       {users.length > 0 ? (
//         <Card title="Active Users with Location" padding="300" rounded>
//           <Box maxHeight="400px" overflow="auto">
//             <IndexTable
//               resourceName={{ singular: 'user', plural: 'users' }}
//               itemCount={users.length}
//               selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
//               onSelectionChange={handleSelectionChange}
//               headings={[
//                 { title: 'Anon ID' },
//                 { title: 'City' },
//                 { title: 'Region' },
//                 { title: 'IP' },
//                 { title: 'Last Active' },
//               ]}
//               selectable={false}
//             >
//               {users.map((user, index) => (
//                 <IndexTable.Row
//                   id={user._id}
//                   key={user._id}
//                   selected={selectedResources.includes(user._id)}
//                   position={index}
//                 >
//                   <IndexTable.Cell>
//                     <Text as="span" fontWeight="medium" fontFamily="monospace">
//                       {user.anonId}
//                     </Text>
//                   </IndexTable.Cell>
//                   <IndexTable.Cell>{user.location?.city || '-'}</IndexTable.Cell>
//                   <IndexTable.Cell>{user.location?.region || '-'}</IndexTable.Cell>
//                   <IndexTable.Cell>
//                     <Text as="span" fontFamily="monospace">{user.location?.ip || '-'}</Text>
//                   </IndexTable.Cell>
//                   <IndexTable.Cell>{new Date(user.lastActive).toLocaleString()}</IndexTable.Cell>
//                 </IndexTable.Row>
//               ))}
//             </IndexTable>
//           </Box>
//         </Card>
//       ) : (
//         <Card padding="0" rounded>
//           <EmptyState
//             heading="No active users yet"
//             action={{ content: 'Refresh', onAction: getActiveUsersWithLocation, loading }}
//           >
//             <p>Click refresh to load the latest active users.</p>
//           </EmptyState>
//         </Card>
//       )}
//     </Page>
//   );
// }
