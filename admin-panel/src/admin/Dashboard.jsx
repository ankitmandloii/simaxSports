import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "../admin/ToastContext";
import {
  Page,
  Card,
  Text,
  Button,
  Layout,
  ResourceList,
  ResourceItem,
  TextContainer,
  Thumbnail,
  Badge,
  Modal,
  Tabs,
  Divider,
  Box,
} from "@shopify/polaris";

export function Dashboard() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [userDesigns, setUserDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDesign, setSelectedDesign] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0: front, 1: back, 2: left, 3: right
  const [galleryIndex, setGalleryIndex] = useState(0);

  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}design/get-AllOrderedDesignfrontEnd`);
        const data = await res.json();
        setUserDesigns(data?.data?.designs ?? []);
      } catch (e) {
        console.error(e);
        showToast({ content: "Failed to load designs", error: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [BASE_URL, showToast]);

  const handleViewDesign = (design) => {
    setSelectedDesign(design);
    setModalOpen(true);
    setActiveTab(0);
    setGalleryIndex(0);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDesign(null);
  };

  const statusTone = (status) =>
    (status || "").toLowerCase().includes("ordered") ? "success" : "info";

  if (loading) {
    return <Page fullWidth title="Dashboard" subtitle="Loading… Please wait" />;
  }

  return (
    <Page fullWidth title="Dashboard" subtitle="Manage your designs here.">
      <Layout>
        <Layout.Section>
          <Card>
            <Box padding="400">
              <Text variant="headingLg" as="h2">
                All Designs
              </Text>
            </Box>
            <Divider />
            <Box padding="400">
              {userDesigns.length === 0 ? (
                <Text variant="bodySm" tone="subdued">
                  No designs found.
                </Text>
              ) : (
                <ResourceList
                  items={userDesigns}
                  renderItem={(item) => {
                    const {
                      _id,
                      DesignName,
                      present,
                      status,
                      FinalImages,
                      ownerEmail,
                      version,
                      createdAt,
                    } = item;

                    const firstThumb =
                      present?.front?.images?.[0]?.src ||
                      FinalImages?.[0] ||
                      "/placeholder.png";

                    return (
                      <ResourceItem id={_id} media={<Thumbnail source={firstThumb} size="small" />}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                          <TextContainer>
                            <Text variant="headingMd" as="h3">
                              {DesignName}
                            </Text>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <Badge tone={statusTone(status)}>{status}</Badge>
                              <Text variant="bodySm" tone="subdued">
                                version: <strong>{version ?? "-"}</strong>
                              </Text>
                              <Text variant="bodySm" tone="subdued">
                                Created: {new Date(createdAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC
                              </Text>
                            </div>
                            <Text variant="bodySm" tone="subdued">
                              Email: {ownerEmail}
                            </Text>
                          </TextContainer>

                          <div style={{ display: "flex", gap: 8 }}>
                            <Button onClick={() => handleViewDesign(item)} primary>
                              View details
                            </Button>
                            <Button destructive onClick={() => handleDelete(_id, ownerEmail)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </ResourceItem>
                    );
                  }}
                />
              )}
            </Box>
          </Card>
        </Layout.Section>
      </Layout>

      {/* BEAUTIFUL MODAL */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          selectedDesign ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Text variant="headingLg">{selectedDesign.DesignName}</Text>
              <Badge tone={statusTone(selectedDesign.status)}>{selectedDesign.status}</Badge>
            </div>
          ) : (
            "Design Details"
          )
        }
        primaryAction={{ content: "Close", onAction: handleCloseModal }}
        large
      >
        <Modal.Section>
          {selectedDesign && (
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
              {/* LEFT: Gallery */}
              <Card>
                <Box padding="400">
                  <Text variant="headingMd">Final Design Images</Text>
                </Box>
                <Divider />
                <Box padding="400">
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "1px solid var(--p-color-border)",
                      background: "var(--p-color-bg-surface-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={(selectedDesign.FinalImages || [])[galleryIndex]}
                      alt="Selected preview"
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  </div>

                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10 }}>
                    {(selectedDesign.FinalImages || []).map((img, i) => (
                      <button
                        key={img + i}
                        onClick={() => setGalleryIndex(i)}
                        style={{
                          border: i === galleryIndex ? "2px solid var(--p-color-border-interactive)" : "1px solid var(--p-color-border)",
                          borderRadius: 10,
                          padding: 0,
                          overflow: "hidden",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                      >
                        <img src={img} alt={`thumb-${i}`} style={{ width: "100%", height: 72, objectFit: "cover" }} />
                      </button>
                    ))}
                  </div>
                </Box>
              </Card>

              {/* RIGHT: Tabs + Notes */}
              <div style={{ display: "grid", gap: 20 }}>
                <Card>
                  <Box padding="400">
                    <Tabs
                      tabs={[
                        { id: "front", content: "Front" },
                        { id: "back", content: "Back" },
                        { id: "left", content: "Left sleeve" },
                        { id: "right", content: "Right sleeve" },
                      ]}
                      selected={activeTab}
                      onSelect={setActiveTab}
                    />
                  </Box>
                  <Divider />
                  <Box padding="400">
                    {activeTab === 0 && <AreaDetails area={selectedDesign.present?.front} />}
                    {activeTab === 1 && <AreaDetails area={selectedDesign.present?.back} />}
                    {activeTab === 2 && <AreaDetails area={selectedDesign.present?.leftSleeve} />}
                    {activeTab === 3 && <AreaDetails area={selectedDesign.present?.rightSleeve} />}
                  </Box>
                </Card>

                <Card>
                  <Box padding="400" paddingBlockEnd="200">
                    <Text variant="headingMd">Design Notes</Text>
                  </Box>
                  <Divider />
                  <Box padding="400" style={{ display: "grid", gap: 8 }}>
                    <NoteRow label="Front notes" value={selectedDesign?.DesignNotes?.FrontDesignNotes} />
                    <NoteRow label="Back notes" value={selectedDesign?.DesignNotes?.BackDesignNotes} />
                    <NoteRow label="Extra info" value={selectedDesign?.DesignNotes?.ExtraInfo} />
                  </Box>
                </Card>

                <Box paddingBlockStart="0" paddingBlockEnd="0" paddingInlineStart="0" paddingInlineEnd="0">
                  <Text variant="bodySm" tone="subdued">
                    Saved: {new Date(selectedDesign.createdAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC
                  </Text>
                </Box>
              </div>
            </div>
          )}
        </Modal.Section>
      </Modal>
    </Page>
  );

  // ——— helpers ———

  function NoteRow({ label, value }) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8 }}>
        <Text tone="subdued">{label}:</Text>
        <Text>{value || "-"}</Text>
      </div>
    );
  }

  function AreaDetails({ area }) {
    if (!area) {
      return <Text tone="subdued">No details available.</Text>;
    }

    const { images = [], texts = [] } = area;

    return (
      <div style={{ display: "grid", gap: 12 }}>
        {images.length > 0 && (
          <>
            <Text variant="headingSm">Images</Text>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
              {images.map((img, idx) => (
                <div key={idx} style={{ border: "1px solid var(--p-color-border)", borderRadius: 12, overflow: "hidden" }}>
                  <img src={img.src} alt={`img-${idx}`} style={{ width: "100%", height: 84, objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </>
        )}

        {texts.length > 0 && (
          <>
            <Divider />
            <Text variant="headingSm">Text elements</Text>
            <div style={{ display: "grid", gap: 8 }}>
              {texts.map((t, idx) => (
                <Card key={idx}>
                  <Box padding="400" style={{ display: "grid", gap: 6 }}>
                    <Text>
                      <strong>Content:</strong> {t.content}
                    </Text>
                    <Text tone="subdued">
                      Font: <strong>{t.fontFamily}</strong> • Size: <strong>{t.fontSize}</strong> • Weight:{" "}
                      <strong>{t.fontWeight}</strong> • Style: <strong>{t.fontStyle}</strong> • Color:{" "}
                      <strong>{t.textColor}</strong>
                    </Text>
                    <Text tone="subdued">
                      Position: X <strong>{t.position?.x}</strong>, Y <strong>{t.position?.y}</strong> • Angle:{" "}
                      <strong>{t.angle}</strong> • Spacing: <strong>{t.spacing}</strong> • Arc: <strong>{t.arc}</strong>
                    </Text>
                    <Text tone="subdued">
                      ScaleX <strong>{t.scaleX}</strong> • ScaleY <strong>{t.scaleY}</strong> • FlipX{" "}
                      <strong>{t.flipX ? "true" : "false"}</strong> • FlipY{" "}
                      <strong>{t.flipY ? "true" : "false"}</strong>
                    </Text>
                    <Text tone="subdued">
                      Layer: <strong>{t.layerIndex}</strong> • Size: <strong>{t.size}</strong> • W×H:{" "}
                      <strong>
                        {t.width}×{t.height}
                      </strong>
                    </Text>
                  </Box>
                </Card>
              ))}
            </div>
          </>
        )}

        {images.length === 0 && texts.length === 0 && (
          <Text tone="subdued">No assets for this area.</Text>
        )}
      </div>
    );
  }

  function handleDelete(designId, ownerEmail) {
    fetch(`${BASE_URL}design/delete-designfrontEnd/${designId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerEmail }),
    }).then((response) => {
      if (response.ok) {
        setUserDesigns((prev) => prev.filter((d) => d._id !== designId));
        showToast({ content: "Design deleted successfully!", error: false });
      } else {
        showToast({ content: "Failed to delete design", error: true });
      }
    });
  }
}
