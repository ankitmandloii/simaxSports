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
  EmptyState,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  InlineStack,
  TextField,
  Select,
  BlockStack,
} from "@shopify/polaris";

export function Dashboard() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const DESIGNS_URL = `${BASE_URL}design/getAllDesigns`;

  const [userDesigns, setUserDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteDlg, setDeleteDlg] = useState({ open: false, id: null, email: "", name: "" });
  const [deleting, setDeleting] = useState(false);

  const [selectedDesign, setSelectedDesign] = useState(null);
  console.log("--------selectedDesign", selectedDesign);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { showToast } = useToast();

  async function reloadDesigns() {
    try {
      const res = await fetch(DESIGNS_URL);
      const data = await res.json();
      console.log("--------Admindata", data);
      setUserDesigns(data?.data?.designs ?? []);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(DESIGNS_URL);
        const data = await res.json();
        setUserDesigns(data?.data?.designs ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [DESIGNS_URL, showToast]);

  const handleViewDesign = (design) => {
    console.log("design", design);
    setSelectedDesign(design);
    setModalOpen(true);
    setActiveTab(0);
    setGalleryIndex(0);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDesign(null);
  };

  const statusTone = (status) => (status || "").toLowerCase().includes("ordered") ? "success" : "info";
  const statusColor = (s) =>
    s.includes("ordered") ? "success" : s.includes("draft") ? "subdued" : "info";

  const stats = useMemo(() => {
    const total = userDesigns.length;
    const byStatus = userDesigns.reduce((m, d) => {
      const key = (d.status || "unknown").toLowerCase();
      m[key] = (m[key] || 0) + 1;
      return m;
    }, {});
    const now = Date.now();
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
    const today = userDesigns.filter(d => new Date(d.createdAt) >= startOfToday).length;
    const last7d = userDesigns.filter(d => (now - new Date(d.createdAt).getTime()) <= 7 * 24 * 3600 * 1000).length;
    const uniqueCustomers = new Set(userDesigns.map(d => d.ownerEmail).filter(Boolean)).size;
    const orderedCount = Object.entries(byStatus).reduce((sum, [k, v]) => (k.includes("ordered") ? sum + v : sum), 0);
    const orderedPct = total ? Math.round((orderedCount / total) * 100) : 0;
    const avgImages = total
      ? Math.round(
        (userDesigns.reduce((sum, d) => sum + ((d.FinalImages || []).length), 0) / total) * 10
      ) / 10
      : 0;

    return { total, today, last7d, uniqueCustomers, orderedPct, byStatus, avgImages };
  }, [userDesigns]);

  const filteredDesigns = useMemo(() => {
    return userDesigns.filter((d) => {
      const matchesQ =
        !q ||
        (d.DesignName && d.DesignName.toLowerCase().includes(q.toLowerCase())) ||
        (d.ownerEmail && d.ownerEmail.toLowerCase().includes(q.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" ? true : (d.status || "").toLowerCase() === statusFilter;
      return matchesQ && matchesStatus;
    });
  }, [userDesigns, q, statusFilter]);

  async function confirmDelete() {
    if (!deleteDlg.id) return;

    const { id, email } = deleteDlg;
    try {
      setDeleting(true);
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}design/delete-designfrontEnd/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerEmail: email }),
      });

      if (res.ok) {
        setUserDesigns((prev) => prev.filter((d) => d._id !== id));
        showToast({ content: "Design deleted successfully!", error: false });
        setDeleteDlg({ open: false, id: null, email: "", name: "" });
        await reloadDesigns();
      } else {
        showToast({ content: "Failed to delete design", error: true });
      }
    } catch (e) {
      showToast({ content: "Error deleting design", error: true });
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <SkeletonPage title="Dashboard" primaryAction>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Box padding="400">
                <SkeletonDisplayText size="medium" />
                <SkeletonBodyText lines={2} />
              </Box>
            </Card>
            <Card sectioned>
              <Box padding="400">
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={3} />
              </Box>
            </Card>
            <Card sectioned>
              <Box padding="400">
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={3} />
              </Box>
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );
  }

  return (
    <Page fullWidth title="Dashboard" subtitle="Manage your designs here.">
      <Layout>
        <Layout.Section>
          <Box paddingBlockEnd="400">
            <Layout>
              <Layout.Section>
                <Box
                  padding="400"
                  style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}
                >
                  <Card sectioned>
                    <Box padding="200">
                      <Text variant="headingSm" as="h3">Total Designs</Text>
                      <Text variant="headingLg" as="h2">{stats.total}</Text>
                    </Box>
                  </Card>
                  <Card sectioned>
                    <Box padding="200">
                      <Text variant="headingSm" as="h3">New Today</Text>
                      <Text variant="headingLg" as="h2">{stats.today}</Text>
                    </Box>
                  </Card>
                  <Card sectioned>
                    <Box padding="200">
                      <Text variant="headingSm" as="h3">Last 7 Days</Text>
                      <Text variant="headingLg" as="h2">{stats.last7d}</Text>
                    </Box>
                  </Card>
                  <Card sectioned>
                    <Box padding="200">
                      <Text variant="headingSm" as="h3">Orders Percentage</Text>
                      <Text variant="headingLg" as="h2">{stats.orderedPct}%</Text>
                    </Box>
                  </Card>
                  <Card sectioned>
                    <Box padding="200">
                      <Text variant="headingSm" as="h3">Unique Customers</Text>
                      <Text variant="headingLg" as="h2">{stats.uniqueCustomers}</Text>
                    </Box>
                  </Card>
                  <Card sectioned>
                    <Box padding="200">
                      <Text variant="headingSm" as="h3">Avg Images / Design</Text>
                      <Text variant="headingLg" as="h2">{stats.avgImages}</Text>
                    </Box>
                  </Card>
                </Box>
              </Layout.Section>
            </Layout>
          </Box>
          <BlockStack gap="300">
            <InlineStack gap="400" blockAlign="center" wrap>
              {/* Search Input - takes 70% on desktop, full width on small screens */}
              <Box width="70%" minWidth="250px">
                <TextField
                  value={q}
                  onChange={setQ}
                  placeholder="Search by name or email…"
                  autoComplete="off"
                />
              </Box>

              {/* Status Dropdown - takes auto width */}
              <Box width="auto" minWidth="150px">
                <Select
                  labelHidden
                  label="Filter by status"
                  options={[
                    { label: "All statuses", value: "all" },
                    ...Object.keys(stats.byStatus).map((k) => ({ label: k, value: k })),
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                />
              </Box>

              {/* Export Button */}
              <Box width="auto">
                <Button
                  onClick={() => {
                    const rows = filteredDesigns.map((d) => ({
                      id: d._id,
                      name: d.DesignName,
                      status: d.status,
                      email: d.ownerEmail,
                      createdAt: d.createdAt,
                      images: (d.FinalImages || []).length,
                    }));
                    const csv =
                      "data:text/csv;charset=utf-8," +
                      [
                        ["ID", "Name", "Status", "Email", "Created At", "Images"].join(","),
                        ...rows.map((r) =>
                          [r.id, r.name, r.status, r.email, r.createdAt, r.images]
                            .map((x) => `"${String(x ?? "").replace(/"/g, '""')}"`)
                            .join(",")
                        ),
                      ].join("\n");
                    const a = document.createElement("a");
                    a.href = encodeURI(csv);
                    a.download = "designs.csv";
                    a.click();
                  }}
                >
                  Export CSV
                </Button>
              </Box>
            </InlineStack>


            <Card sectioned >
              <Box padding="400">
                <Text variant="headingMd" as="h3" >Status Breakdown</Text>
                <Box paddingBlockStart="200" style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", marginTop: '1rem' }}>
                  {Object.entries(stats.byStatus).map(([s, c]) => (
                    <Badge key={s} tone={statusColor(s)}>{s}: {c}</Badge>
                  ))}
                </Box>
              </Box>
            </Card>

            <Card sectioned>
              <Box padding="400">
                <Text variant="headingLg" as="h2">All Designs</Text>
              </Box>
              <Divider />
              <ResourceList
                items={filteredDesigns}
                renderItem={(item, index) => {
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
                    (FinalImages?.[0] ?? "/placeholder.png");

                  const rowStyle = {
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    padding: "12px",
                    borderRadius: "4px",
                  };

                  return (
                    <div key={_id} style={rowStyle}>
                      <ResourceItem
                        id={_id}
                        media={<Thumbnail source={firstThumb} size="small" />}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "16px",
                            flexWrap: "wrap",
                          }}
                        >
                          <TextContainer>
                            <Text variant="headingMd" as="h3">
                              {DesignName || "(untitled)"}
                            </Text>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              <Badge tone={statusTone(status)}>{status}</Badge>
                              <Text variant="bodySm" tone="subdued">
                                Version: <strong>{version ?? "-"}</strong>
                              </Text>
                              <Text variant="bodySm" tone="subdued">
                                Created: {new Date(createdAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC
                              </Text>
                            </div>
                            <Text variant="bodySm" tone="subdued">
                              Email: {ownerEmail}
                            </Text>
                          </TextContainer>

                          <div style={{ display: "flex", gap: "8px", height: '2rem' }}>
                            <Button onClick={() => handleViewDesign(item)} primary size="medium">
                              View Details
                            </Button>
                            <Button
                              destructive
                              onClick={() =>
                                setDeleteDlg({
                                  open: true,
                                  id: _id,
                                  email: ownerEmail,
                                  name: DesignName || "this design",
                                })
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </ResourceItem>
                    </div>
                  );
                }}
              />
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          selectedDesign ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <Text variant="headingLg">{selectedDesign.DesignName || "(untitled)"}</Text>
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
            <Layout>
              <Layout.Section oneHalf>
                <Card sectioned>
                  <Box padding="400">
                    <Text variant="headingMd">Final Design Images</Text>
                  </Box>
                  <Divider />
                  <Box padding="400">
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "4 / 3",
                        borderRadius: "8px",
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
                    <div
                      style={{
                        marginTop: "16px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
                        gap: "8px",
                      }}
                    >
                      {(selectedDesign.FinalImages || []).map((img, i) => (
                        <button
                          key={img + i}
                          onClick={() => setGalleryIndex(i)}
                          style={{
                            border: i === galleryIndex ? "2px solid #005bff" : "1px solid var(--p-color-border)",
                            borderRadius: "6px",
                            padding: "2px",
                            overflow: "hidden",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                        >
                          <img src={img} alt={`thumb-${i}`} style={{ width: "100%", height: "60px", objectFit: "contain" }} />
                        </button>
                      ))}
                    </div>
                  </Box>
                </Card>
              </Layout.Section>
              <Layout.Section oneHalf>
                <BlockStack gap="300">
                  <Card sectioned>
                    <Box padding="400">
                      <Tabs
                        tabs={[
                          { id: "front", content: "Front" },
                          { id: "back", content: "Back" },
                          { id: "left", content: "Left Sleeve" },
                          { id: "right", content: "Right Sleeve" },
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
                  <Card sectioned marginBlockStart="300">
                    <Box padding="400">
                      <Text variant="headingMd">Design Notes</Text>
                    </Box>
                    <Divider />
                    <Box padding="400" style={{ display: "grid", gap: "16px" }}>
                      <NoteRow label="Front Notes" value={selectedDesign?.DesignNotes?.FrontDesignNotes} />
                      <NoteRow label="Back Notes" value={selectedDesign?.DesignNotes?.BackDesignNotes} />
                      <NoteRow label="Extra Info" value={selectedDesign?.DesignNotes?.ExtraInfo} />
                    </Box>
                  </Card>
                  <Card sectioned>
                    <Box padding="400" paddingBlockEnd="200">
                      <Text variant="headingMd">Name and Number</Text>
                    </Box>
                    <Divider />
                    <Box padding="400" style={{ display: "grid", gap: "16px" }}>
                      {selectedDesign?.NamesAndNumberPrintAreas?.length > 0 ? (
                        selectedDesign?.NamesAndNumberPrintAreas?.map((item, index) => (
                          <div key={index} style={{ display: "grid", gap: "8px", paddingBlock: "8px" }}>
                            <NoteRow label="Name" value={item?.name ?? "-"} />
                            <NoteRow label="Number" value={item?.number ?? "-"} />
                            <NoteRow label="Color" value={item?.color ?? "-"} />
                            <NoteRow label="Size" value={item?.size ?? "-"} />
                            <NoteRow label="Font Size" value={item?.fontSize ?? "-"} />
                            <NoteRow label="Font Color" value={item?.fontColor ?? "-"} />
                            <NoteRow label="Font Family" value={item?.fontFamily ?? "-"} />
                            <NoteRow label="Position" value={`X: ${item?.position?.x ?? "-"}, Y: ${item?.position?.y ?? "-"}`} />
                            <NoteRow label="Print Side" value={item?.printSide ?? "-"} />
                            <NoteRow label="Variant ID" value={item?.id ?? "-"} />
                            {index < (selectedDesign?.NamesAndNumberPrintAreas?.length ?? 0) - 1 && <Divider />}
                          </div>
                        ))
                      ) : (
                        <Text tone="subdued">No name and number details available.</Text>
                      )}
                    </Box>
                  </Card>
                  <Box paddingBlockStart="200" paddingBlockEnd="0">
                    <Text variant="bodySm" tone="subdued">
                      Saved: {new Date(selectedDesign.createdAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC
                    </Text>
                  </Box>
                </BlockStack>
              </Layout.Section>
            </Layout>
          )}
        </Modal.Section>
      </Modal>

      <Modal
        open={deleteDlg.open}
        onClose={() => setDeleteDlg((s) => ({ ...s, open: false }))}
        title={`Delete "${deleteDlg.name}"?`}
        primaryAction={{
          content: "Yes, Delete",
          destructive: true,
          onAction: confirmDelete,
          loading: deleting,
        }}
        secondaryActions={[
          {
            content: "No",
            onAction: () => setDeleteDlg((s) => ({ ...s, open: false })),
            disabled: deleting,
          },
        ]}
      >
        <Modal.Section>
          <Text>This action cannot be undone. The design will be permanently removed.</Text>
        </Modal.Section>
      </Modal>
    </Page>
  );

  function NoteRow({ label, value }) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "150px 1fr",
          gap: "12px",
          alignItems: "start",
        }}
      >
        <Text tone="subdued">{label}:</Text>
        <div
          style={{
            maxHeight: "150px",
            overflowY: "auto",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            background: "#f9f9f9",
            borderRadius: "4px",
            padding: "8px",
          }}
        >
          <Text>{value || "-"}</Text>
        </div>
      </div>
    );
  }

  function AreaDetails({ area }) {
    if (!area) {
      return <Text tone="subdued">No details available.</Text>;
    }

    const { images = [], texts = [] } = area;
    console.log("---------imagesAdmin", images)

    return (
      <div style={{ display: "grid", gap: "16px" }}>
        {images.length > 0 && (
          <>
            <Text variant="headingSm">Images</Text>
            <div style={{ display: "grid", gap: "12px" }}>
              {images.map((img, idx) => (
                <Card key={idx} sectioned>
                  <Box padding="400" style={{ display: "grid", gap: "8px" }}>
                    <div
                      style={{
                        border: "1px solid var(--p-color-border)",
                        borderRadius: "6px",
                        overflow: "hidden",
                        marginBottom: "8px",
                      }}
                    >
                      <img
                        src={img.src}
                        alt={`img-${idx}`}
                        style={{ width: "100%", height: "100px", objectFit: "contain" }}
                      />
                    </div>
                    <NoteRow label="Source" value={img.src} />
                    <NoteRow label="ID" value={img.id} />
                    <NoteRow label="Position" value={`X: ${img.position?.x ?? "-"}, Y: ${img.position?.y ?? "-"}`} />
                    <NoteRow label="Dimensions" value={`W: ${img.width ?? "-"} × H: ${img.height ?? "-"}`} />
                    <NoteRow label="Scale" value={`X: ${img.scaleX ?? "-"}, Y: ${img.scaleY ?? "-"}`} />
                    <NoteRow label="Flip" value={`X: ${img.flipX ? "true" : "false"}, Y: ${img.flipY ? "true" : "false"}`} />
                    <NoteRow label="Angle" value={img.angle ?? "-"} />
                    <NoteRow label="Layer Index" value={img.layerIndex ?? "-"} />
                    <NoteRow label="Crop and Trim" value={img.cropAndTrim ? "true" : "false"} />
                    <NoteRow label="Edit Color" value={img.editColor ? "true" : "false"} />
                    <NoteRow label="Invert Color" value={img.invertColor ? "true" : "false"} />
                    <NoteRow label="Remove Background" value={img.removeBg ? "true" : "false"} />
                    <NoteRow label="Replace Background Color" value={img.replaceBackgroundColor ?? "-"} />
                    <NoteRow label="Replace Background Param" value={img.replaceBgParamValue ?? "-"} />
                    <NoteRow label="Selected Filter" value={img.selectedFilter ?? "-"} />
                    <NoteRow label="Single Color" value={img.singleColor ?? "-"} />
                    <NoteRow label="Solid Color" value={img.solidColor ? "true" : "false"} />
                    <NoteRow label="Super Resolution" value={img.superResolution ? "true" : "false"} />
                    <NoteRow label="Threshold Value" value={img.thresholdValue ?? "-"} />
                  </Box>
                </Card>
              ))}
            </div>
          </>
        )}

        {texts.length > 0 && (
          <>
            <Divider />
            <Text variant="headingSm">Text Elements</Text>
            <div style={{ display: "grid", gap: "12px" }}>
              {texts.map((t, idx) => (
                <Card key={idx} sectioned>
                  <Box padding="400" style={{ display: "grid", gap: "8px" }}>
                    <NoteRow label="Content" value={t.content} />
                    <NoteRow label="Font" value={t.fontFamily} />
                    <NoteRow label="Font Size" value={t.fontSize} />
                    <NoteRow label="Font Weight" value={t.fontWeight} />
                    <NoteRow label="Font Style" value={t.fontStyle} />
                    <NoteRow label="Color" value={t.textColor} />
                    <NoteRow label="Position" value={`X: ${t.position?.x ?? "-"}, Y: ${t.position?.y ?? "-"}`} />
                    <NoteRow label="Angle" value={t.angle} />
                    <NoteRow label="Spacing" value={t.spacing} />
                    <NoteRow label="Arc" value={t.arc} />
                    <NoteRow label="Scale" value={`X: ${t.scaleX ?? "-"}, Y: ${t.scaleY ?? "-"}`} />
                    <NoteRow label="Flip" value={`X: ${t.flipX ? "true" : "false"}, Y: ${t.flipY ? "true" : "false"}`} />
                    <NoteRow label="Layer" value={t.layerIndex} />
                    <NoteRow label="Size" value={t.size} />
                    <NoteRow label="Dimensions" value={`W: ${t.width ?? "-"} × H: ${t.height ?? "-"}`} />
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
}
// import React, { useEffect, useMemo, useState } from "react";
// import { useToast } from "../admin/ToastContext";
// import {
//   Page,
//   Card,
//   Text,
//   Button,
//   Layout,
//   IndexTable,
//   TextContainer,
//   Thumbnail,
//   Badge,
//   Modal,
//   Tabs,
//   Divider,
//   Box,
//   EmptyState,
//   SkeletonBodyText,
//   SkeletonDisplayText,
//   SkeletonPage,
//   InlineStack,
// } from "@shopify/polaris";

// export function Dashboard() {
//   const BASE_URL = process.env.REACT_APP_BASE_URL;
//   const DESIGNS_URL = `${BASE_URL}design/getAllDesigns`;

//   const [userDesigns, setUserDesigns] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [deleteDlg, setDeleteDlg] = useState({ open: false, id: null, email: "", name: "" });
//   const [deleting, setDeleting] = useState(false);

//   const [selectedDesign, setSelectedDesign] = useState(null);
//   console.log("--------selectedDesign", selectedDesign);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);
//   const [galleryIndex, setGalleryIndex] = useState(0);

//   const [q, setQ] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const { showToast } = useToast();

//   async function reloadDesigns() {
//     try {
//       const res = await fetch(DESIGNS_URL);
//       const data = await res.json();
//       console.log("--------Admindata", data);
//       setUserDesigns(data?.data?.designs ?? []);
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch(DESIGNS_URL);
//         const data = await res.json();
//         console.log("-----adataaa", data)
//         setUserDesigns(data?.data?.designs ?? []);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [DESIGNS_URL, showToast]);

//   const handleViewDesign = (design) => {
//     console.log("design", design);
//     setSelectedDesign(design);
//     setModalOpen(true);
//     setActiveTab(0);
//     setGalleryIndex(0);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedDesign(null);
//   };

//   const statusTone = (status) => (status || "").toLowerCase().includes("ordered") ? "success" : "info";
//   const statusColor = (s) =>
//     s.includes("ordered") ? "success" : s.includes("draft") ? "subdued" : "info";

//   const stats = useMemo(() => {
//     const total = userDesigns.length;
//     const byStatus = userDesigns.reduce((m, d) => {
//       const key = (d.status || "unknown").toLowerCase();
//       m[key] = (m[key] || 0) + 1;
//       return m;
//     }, {});
//     const now = Date.now();
//     const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
//     const today = userDesigns.filter(d => new Date(d.createdAt) >= startOfToday).length;
//     const last7d = userDesigns.filter(d => (now - new Date(d.createdAt).getTime()) <= 7 * 24 * 3600 * 1000).length;
//     const uniqueCustomers = new Set(userDesigns.map(d => d.ownerEmail).filter(Boolean)).size;
//     const orderedCount = Object.entries(byStatus).reduce((sum, [k, v]) => (k.includes("ordered") ? sum + v : sum), 0);
//     const orderedPct = total ? Math.round((orderedCount / total) * 100) : 0;
//     const avgImages = total
//       ? Math.round(
//         (userDesigns.reduce((sum, d) => sum + ((d.FinalImages || []).length), 0) / total) * 10
//       ) / 10
//       : 0;

//     return { total, today, last7d, uniqueCustomers, orderedPct, byStatus, avgImages };
//   }, [userDesigns]);

//   const filteredDesigns = useMemo(() => {
//     return userDesigns.filter((d) => {
//       const matchesQ =
//         !q ||
//         (d.DesignName && d.DesignName.toLowerCase().includes(q.toLowerCase())) ||
//         (d.ownerEmail && d.ownerEmail.toLowerCase().includes(q.toLowerCase()));
//       const matchesStatus =
//         statusFilter === "all" ? true : (d.status || "").toLowerCase() === statusFilter;
//       return matchesQ && matchesStatus;
//     });
//   }, [userDesigns, q, statusFilter]);

//   async function confirmDelete() {
//     if (!deleteDlg.id) return;

//     const { id, email } = deleteDlg;
//     try {
//       setDeleting(true);
//       const res = await fetch(`${process.env.REACT_APP_BASE_URL}design/delete-designfrontEnd/${id}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ownerEmail: email }),
//       });

//       if (res.ok) {
//         setUserDesigns((prev) => prev.filter((d) => d._id !== id));
//         showToast({ content: "Design deleted successfully!", error: false });
//         setDeleteDlg({ open: false, id: null, email: "", name: "" });
//         await reloadDesigns();
//       } else {
//         showToast({ content: "Failed to delete design", error: true });
//       }
//     } catch (e) {
//       showToast({ content: "Error deleting design", error: true });
//     } finally {
//       setDeleting(false);
//     }
//   }

//   if (loading) {
//     return (
//       <SkeletonPage title="Dashboard" primaryAction>
//         <Layout>
//           <Layout.Section>
//             <Card sectioned>
//               <Box padding="400">
//                 <SkeletonDisplayText size="medium" />
//                 <SkeletonBodyText lines={2} />
//               </Box>
//             </Card>
//             <Card sectioned>
//               <Box padding="400">
//                 <SkeletonDisplayText size="small" />
//                 <SkeletonBodyText lines={3} />
//               </Box>
//             </Card>
//             <Card sectioned>
//               <Box padding="400">
//                 <SkeletonDisplayText size="small" />
//                 <SkeletonBodyText lines={3} />
//               </Box>
//             </Card>
//           </Layout.Section>
//         </Layout>
//       </SkeletonPage>
//     );
//   }

//   const resourceName = {
//     singular: 'design',
//     plural: 'designs',
//   };

//   const rowMarkup = filteredDesigns.map(
//     ({ _id, DesignName, present, status, FinalImages, ownerEmail, version, createdAt }, index) => (
//       <IndexTable.Row id={_id} key={_id} position={index}>
//         <IndexTable.Cell>
//           <Thumbnail source={
//             present?.front?.images?.[0]?.src ||
//             (FinalImages?.[0] ?? "/placeholder.png")
//           } size="small" />
//         </IndexTable.Cell>
//         <IndexTable.Cell>{DesignName || "(untitled)"}</IndexTable.Cell>
//         <IndexTable.Cell>{ownerEmail}</IndexTable.Cell>
//         <IndexTable.Cell>${(Math.random() * 1000).toFixed(2)}</IndexTable.Cell> {/* Simulated Total Value */}
//         <IndexTable.Cell>
//           <Badge tone={statusTone(status)}>{status}</Badge>
//         </IndexTable.Cell>
//         <IndexTable.Cell>{new Date(createdAt).toLocaleDateString()}</IndexTable.Cell>
//         <IndexTable.Cell>
//           <InlineStack gap="200">
//             <Button onClick={() => handleViewDesign({ _id, DesignName, present, status, FinalImages, ownerEmail, version, createdAt })} primary>
//               View
//             </Button>
//             <Button
//               destructive
//               onClick={() =>
//                 setDeleteDlg({
//                   open: true,
//                   id: _id,
//                   email: ownerEmail,
//                   name: DesignName || "this design",
//                 })
//               }
//             >
//               Delete
//             </Button>
//           </InlineStack>
//         </IndexTable.Cell>
//       </IndexTable.Row>
//     ),
//   );

//   return (
//     <Page fullWidth title="Dashboard" subtitle="Manage your designs here.">
//       <Layout>
//         <Layout.Section>
//           <Box paddingBlockEnd="400">
//             <Layout>
//               <Layout.Section>
//                 <Box
//                   padding="400"
//                   style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}
//                 >
//                   <Card sectioned>
//                     <Box padding="200">
//                       <Text variant="headingSm">Total Designs</Text>
//                       <Text variant="headingLg">{stats.total}</Text>
//                     </Box>
//                   </Card>
//                   <Card sectioned>
//                     <Box padding="200">
//                       <Text variant="headingSm">New Today</Text>
//                       <Text variant="headingLg">{stats.today}</Text>
//                     </Box>
//                   </Card>
//                   <Card sectioned>
//                     <Box padding="200">
//                       <Text variant="headingSm">Last 7 Days</Text>
//                       <Text variant="headingLg">{stats.last7d}</Text>
//                     </Box>
//                   </Card>
//                   <Card sectioned>
//                     <Box padding="200">
//                       <Text variant="headingSm">Orders Percentage</Text>
//                       <Text variant="headingLg">{stats.orderedPct}%</Text>
//                     </Box>
//                   </Card>
//                   <Card sectioned>
//                     <Box padding="200">
//                       <Text variant="headingSm">Unique Customers</Text>
//                       <Text variant="headingLg">{stats.uniqueCustomers}</Text>
//                     </Box>
//                   </Card>
//                   <Card sectioned>
//                     <Box padding="200">
//                       <Text variant="headingSm">Avg Images / Design</Text>
//                       <Text variant="headingLg">{stats.avgImages}</Text>
//                     </Box>
//                   </Card>
//                 </Box>
//               </Layout.Section>
//             </Layout>
//           </Box>

//           <Card sectioned>
//             <Box padding="400">
//               <Text variant="headingMd">Status Breakdown</Text>
//               <Box paddingBlockStart="200" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
//                 {Object.entries(stats.byStatus).map(([s, c]) => (
//                   <Badge key={s} tone={statusColor(s)}>{s}: {c}</Badge>
//                 ))}
//               </Box>
//             </Box>
//           </Card>

//           <Box paddingBlockStart="400" paddingBlockEnd="200">
//             <Layout>
//               <Layout.Section>
//                 <Box padding="200">
//                   <input
//                     value={q}
//                     onChange={(e) => setQ(e.target.value)}
//                     placeholder="Search by name or email…"
//                     style={{ padding: "8px 12px", border: "1px solid var(--p-color-border)", borderRadius: "4px", minWidth: "250px" }}
//                   />
//                 </Box>
//               </Layout.Section>
//               <Layout.Section secondary>
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   style={{ padding: "8px 12px", border: "1px solid var(--p-color-border)", borderRadius: "4px" }}
//                 >
//                   <option value="all">All statuses</option>
//                   {Object.keys(stats.byStatus).map((k) => (
//                     <option key={k} value={k}>{k}</option>
//                   ))}
//                 </select>
//               </Layout.Section>
//               <Layout.Section secondary>
//                 <Button
//                   onClick={() => {
//                     const rows = filteredDesigns.map((d) => ({
//                       id: d._id,
//                       name: d.DesignName,
//                       status: d.status,
//                       email: d.ownerEmail,
//                       createdAt: d.createdAt,
//                       images: (d.FinalImages || []).length,
//                     }));
//                     const csv =
//                       "data:text/csv;charset=utf-8," +
//                       [
//                         ["ID", "Name", "Status", "Email", "Created At", "Images"].join(","),
//                         ...rows.map((r) =>
//                           [r.id, r.name, r.status, r.email, r.createdAt, r.images]
//                             .map((x) => `"${String(x ?? "").replace(/"/g, '""')}"`)
//                             .join(",")
//                         ),
//                       ].join("\n");
//                     const a = document.createElement("a");
//                     a.href = encodeURI(csv);
//                     a.download = "designs.csv";
//                     a.click();
//                   }}
//                 >
//                   Export CSV
//                 </Button>
//               </Layout.Section>
//             </Layout>
//           </Box>

//           <Card sectioned>
//             <Box padding="400">
//               <Text variant="headingLg" as="h2">All Designs</Text>
//             </Box>
//             <Divider />
//             <IndexTable
//               resourceName={resourceName}
//               itemCount={filteredDesigns.length}
//               headings={[
//                 { title: 'Thumbnail' },
//                 { title: 'Customer Name' },
//                 { title: 'Customer Email' },
//                 { title: 'Total Value' },
//                 { title: 'Status' },
//                 { title: 'Date' },
//                 { title: 'Actions' },
//               ]}
//               selectable={false}
//             >
//               {rowMarkup}
//             </IndexTable>
//           </Card>
//         </Layout.Section>
//       </Layout>

//       <Modal
//         open={modalOpen}
//         onClose={handleCloseModal}
//         title={
//           selectedDesign ? (
//             <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
//               <Text variant="headingLg">{selectedDesign.DesignName || "(untitled)"}</Text>
//               <Badge tone={statusTone(selectedDesign.status)}>{selectedDesign.status}</Badge>
//             </div>
//           ) : (
//             "Design Details"
//           )
//         }
//         primaryAction={{ content: "Close", onAction: handleCloseModal }}
//         large
//       >
//         <Modal.Section>
//           {selectedDesign && (
//             <Layout>
//               <Layout.Section oneHalf>
//                 <Card sectioned>
//                   <Box padding="400">
//                     <Text variant="headingMd">Final Design Images</Text>
//                   </Box>
//                   <Divider />
//                   <Box padding="400">
//                     <div
//                       style={{
//                         width: "100%",
//                         aspectRatio: "4 / 3",
//                         borderRadius: "8px",
//                         overflow: "hidden",
//                         border: "1px solid var(--p-color-border)",
//                         background: "var(--p-color-bg-surface-secondary)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <img
//                         src={(selectedDesign.FinalImages || [])[galleryIndex]}
//                         alt="Selected preview"
//                         style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
//                       />
//                     </div>
//                     <div
//                       style={{
//                         marginTop: "16px",
//                         display: "grid",
//                         gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
//                         gap: "8px",
//                       }}
//                     >
//                       {(selectedDesign.FinalImages || []).map((img, i) => (
//                         <button
//                           key={img + i}
//                           onClick={() => setGalleryIndex(i)}
//                           style={{
//                             border: i === galleryIndex ? "2px solid #005bff" : "1px solid var(--p-color-border)",
//                             borderRadius: "6px",
//                             padding: "2px",
//                             overflow: "hidden",
//                             background: "transparent",
//                             cursor: "pointer",
//                           }}
//                         >
//                           <img src={img} alt={`thumb-${i}`} style={{ width: "100%", height: "60px", objectFit: "contain" }} />
//                         </button>
//                       ))}
//                     </div>
//                   </Box>
//                 </Card>
//               </Layout.Section>
//               <Layout.Section oneHalf>
//                 <Card sectioned>
//                   <Box padding="400">
//                     <Tabs
//                       tabs={[
//                         { id: "front", content: "Front" },
//                         { id: "back", content: "Back" },
//                         { id: "left", content: "Left Sleeve" },
//                         { id: "right", content: "Right Sleeve" },
//                       ]}
//                       selected={activeTab}
//                       onSelect={setActiveTab}
//                     />
//                   </Box>
//                   <Divider />
//                   <Box padding="400">
//                     {activeTab === 0 && <AreaDetails area={selectedDesign.present?.front} />}
//                     {activeTab === 1 && <AreaDetails area={selectedDesign.present?.back} />}
//                     {activeTab === 2 && <AreaDetails area={selectedDesign.present?.leftSleeve} />}
//                     {activeTab === 3 && <AreaDetails area={selectedDesign.present?.rightSleeve} />}
//                   </Box>
//                 </Card>
//                 <Card sectioned marginBlockStart="300">
//                   <Box padding="400">
//                     <Text variant="headingMd">Design Notes</Text>
//                   </Box>
//                   <Divider />
//                   <Box padding="400" style={{ display: "grid", gap: "16px" }}>
//                     <NoteRow label="Front Notes" value={selectedDesign?.DesignNotes?.FrontDesignNotes} />
//                     <NoteRow label="Back Notes" value={selectedDesign?.DesignNotes?.BackDesignNotes} />
//                     <NoteRow label="Extra Info" value={selectedDesign?.DesignNotes?.ExtraInfo} />
//                   </Box>
//                 </Card>
//                 <Card sectioned>
//                   <Box padding="400" paddingBlockEnd="200">
//                     <Text variant="headingMd">Name and Number</Text>
//                   </Box>
//                   <Divider />
//                   <Box padding="400" style={{ display: "grid", gap: "16px" }}>
//                     {selectedDesign?.NamesAndNumberPrintAreas?.length > 0 ? (
//                       selectedDesign?.NamesAndNumberPrintAreas?.map((item, index) => (
//                         <div key={index} style={{ display: "grid", gap: "8px", paddingBlock: "8px" }}>
//                           <NoteRow label="Name" value={item?.name ?? "-"} />
//                           <NoteRow label="Number" value={item?.number ?? "-"} />
//                           <NoteRow label="Color" value={item?.color ?? "-"} />
//                           <NoteRow label="Size" value={item?.size ?? "-"} />
//                           <NoteRow label="Font Size" value={item?.fontSize ?? "-"} />
//                           <NoteRow label="Font Color" value={item?.fontColor ?? "-"} />
//                           <NoteRow label="Font Family" value={item?.fontFamily ?? "-"} />
//                           <NoteRow label="Position" value={`X: ${item?.position?.x ?? "-"}, Y: ${item?.position?.y ?? "-"}`} />
//                           <NoteRow label="Print Side" value={item?.printSide ?? "-"} />
//                           <NoteRow label="Variant ID" value={item?.id ?? "-"} />
//                           {index < (selectedDesign?.NamesAndNumberPrintAreas?.length ?? 0) - 1 && <Divider />}
//                         </div>
//                       ))
//                     ) : (
//                       <Text tone="subdued">No name and number details available.</Text>
//                     )}
//                   </Box>
//                 </Card>
//                 <Box paddingBlockStart="200" paddingBlockEnd="0">
//                   <Text variant="bodySm" tone="subdued">
//                     Saved: {new Date(selectedDesign.createdAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC
//                   </Text>
//                 </Box>
//               </Layout.Section>
//             </Layout>
//           )}
//         </Modal.Section>
//       </Modal>

//       <Modal
//         open={deleteDlg.open}
//         onClose={() => setDeleteDlg((s) => ({ ...s, open: false }))}
//         title={`Delete "${deleteDlg.name}"?`}
//         primaryAction={{
//           content: "Yes, Delete",
//           destructive: true,
//           onAction: confirmDelete,
//           loading: deleting,
//         }}
//         secondaryActions={[
//           {
//             content: "No",
//             onAction: () => setDeleteDlg((s) => ({ ...s, open: false })),
//             disabled: deleting,
//           },
//         ]}
//       >
//         <Modal.Section>
//           <Text>This action cannot be undone. The design will be permanently removed.</Text>
//         </Modal.Section>
//       </Modal>
//     </Page>
//   );

//   function NoteRow({ label, value }) {
//     return (
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "150px 1fr",
//           gap: "12px",
//           alignItems: "start",
//         }}
//       >
//         <Text tone="subdued">{label}:</Text>
//         <div
//           style={{
//             maxHeight: "150px",
//             overflowY: "auto",
//             wordBreak: "break-word",
//             whiteSpace: "pre-wrap",
//             background: "#f9f9f9",
//             borderRadius: "4px",
//             padding: "8px",
//           }}
//         >
//           <Text>{value || "-"}</Text>
//         </div>
//       </div>
//     );
//   }

//   function AreaDetails({ area }) {
//     console.log("======area", area)
//     if (!area) {
//       return <Text tone="subdued">No details available.</Text>;
//     }

//     const { images = [], texts = [] } = area;
//     console.log("---------imagesAdmin", images)

//     return (
//       <div style={{ display: "grid", gap: "16px" }}>
//         {images.length > 0 && (
//           <>
//             <Text variant="headingSm">Images</Text>
//             <div style={{ display: "grid", gap: "12px" }}>
//               {images.map((img, idx) => (
//                 <Card key={idx} sectioned>
//                   <Box padding="400" style={{ display: "grid", gap: "8px" }}>
//                     <div
//                       style={{
//                         border: "1px solid var(--p-color-border)",
//                         borderRadius: "6px",
//                         overflow: "hidden",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       <img
//                         src={img.base64canvasImage || img.src}
//                         alt={`img-${idx}`}
//                         style={{ width: "100%", height: "100px", objectFit: "contain" }}
//                       />
//                     </div>
//                     <NoteRow label="Source" value={img.src} />
//                     {/* <NoteRow label="ID" value={img.id} /> */}
//                     <NoteRow label="Position" value={`X: ${img.position?.x ?? "-"}, Y: ${img.position?.y ?? "-"}`} />
//                     <NoteRow label="Dimensions" value={`W: ${img.width ?? "-"} × H: ${img.height ?? "-"}`} />
//                     {/* <NoteRow label="Scale" value={`X: ${img.scaleX ?? "-"}, Y: ${img.scaleY ?? "-"}`} /> */}
//                     {/* <NoteRow label="Flip" value={`X: ${img.flipX ? "true" : "false"}, Y: ${img.flipY ? "true" : "false"}`} /> */}
//                     {/* <NoteRow label="Angle" value={img.angle ?? "-"} /> */}
//                     {/* <NoteRow label="Layer Index" value={img.layerIndex ?? "-"} /> */}
//                     {/* <NoteRow label="Crop and Trim" value={img.cropAndTrim ? "true" : "false"} /> */}
//                     {/* <NoteRow label="Edit Color" value={img.editColor ? "true" : "false"} /> */}
//                     {/* <NoteRow label="Invert Color" value={img.invertColor ? "true" : "false"} /> */}
//                     {/* <NoteRow label="Remove Background" value={img.removeBg ? "true" : "false"} /> */}
//                     {/* <NoteRow label="Replace Background Color" value={img.replaceBackgroundColor ?? "-"} /> */}
//                     {/* <NoteRow label="Replace Background Param" value={img.replaceBgParamValue ?? "-"} /> */}
//                     {/* <NoteRow label="Selected Filter" value={img.selectedFilter ?? "-"} /> */}
//                     {/* <NoteRow label="Single Color" value={img.singleColor ?? "-"} /> */}
//                     {/* <NoteRow label="Solid Color" value={img.solidColor ? "true" : "false"} /> */}
//                     {/* <NoteRow label="Super Resolution" value={img.superResolution ? "true" : "false"} /> */}
//                     {/* <NoteRow label="Threshold Value" value={img.thresholdValue ?? "-"} /> */}
//                   </Box>
//                 </Card>
//               ))}
//             </div>
//           </>
//         )}

//         {texts.length > 0 && (
//           <>
//             <Divider />
//             <Text variant="headingSm">Text Elements</Text>
//             <div style={{ display: "grid", gap: "12px" }}>
//               {texts.map((t, idx) => (
//                 <Card key={idx} sectioned>
//                   <Box padding="400" style={{ display: "grid", gap: "8px" }}>
//                     <NoteRow label="Content" value={t.content} />
//                     <NoteRow label="Font" value={t.fontFamily} />
//                     <NoteRow label="Font Size" value={t.fontSize} />
//                     <NoteRow label="Font Weight" value={t.fontWeight} />
//                     <NoteRow label="Font Style" value={t.fontStyle} />
//                     <NoteRow label="Color" value={t.textColor} />
//                     <NoteRow label="Position" value={`X: ${t.position?.x ?? "-"}, Y: ${t.position?.y ?? "-"}`} />
//                     <NoteRow label="Angle" value={t.angle} />
//                     <NoteRow label="Spacing" value={t.spacing} />
//                     <NoteRow label="Arc" value={t.arc} />
//                     <NoteRow label="Scale" value={`X: ${t.scaleX ?? "-"}, Y: ${t.scaleY ?? "-"}`} />
//                     <NoteRow label="Flip" value={`X: ${t.flipX ? "true" : "false"}, Y: ${t.flipY ? "true" : "false"}`} />
//                     <NoteRow label="Layer" value={t.layerIndex} />
//                     <NoteRow label="Size" value={t.size} />
//                     <NoteRow label="Dimensions" value={`W: ${t.width ?? "-"} × H: ${t.height ?? "-"}`} />
//                   </Box>
//                 </Card>
//               ))}
//             </div>
//           </>
//         )}

//         {images.length === 0 && texts.length === 0 && (
//           <Text tone="subdued">No assets for this area.</Text>
//         )}
//       </div>
//     );
//   }
// }