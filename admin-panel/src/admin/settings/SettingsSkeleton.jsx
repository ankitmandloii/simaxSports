import {
  Page,
  Card,
  SkeletonBodyText,
  SkeletonDisplayText,
  BlockStack,
  Text,
  Box,
  InlineStack,
  
  Divider,
} from '@shopify/polaris';

export  function SettingsSkeleton() {
  return (
    <Page
      title="Settings"
      fullWidth
      subtitle="Manage your product gadget settings here for visible to the user."
    >
      <Box
        paddingBlockEnd="500"
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        }}
      >
        {[...Array(6)].map((_, i) => (
          <Card key={i} sectioned>
            <BlockStack gap="400">
              <SkeletonDisplayText size="medium" />
              <Text tone="subdued">
                <SkeletonBodyText lines={1} />
              </Text>
              <Divider />
              <Box paddingBlock="300">
                <BlockStack gap="200">
                  {/* Simulating toggle rows */}
                  {[...Array(9)].map((_, j) => (
                    <SkeletonBodyText key={j} lines={1} />
                  ))}
                </BlockStack>
              </Box>
            </BlockStack>
          </Card>
        ))}
      </Box>

      <Box padding="1000">
        <InlineStack>
          <SkeletonBodyText lines={1} />
        </InlineStack>
      </Box>
    </Page>
  );
}
