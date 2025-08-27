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
} from "@shopify/polaris";

export function Dashboard() {
  // New absolute endpoint per your curl example
  const DESIGNS_URL = "http://localhost:8080/api/design/getAllDesigns";

  const [userDesigns, setUserDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete dialog
  const [deleteDlg, setDeleteDlg] = useState({ open: false, id: null, email: "", name: "" });
  const [deleting, setDeleting] = useState(false);

  // Viewer modal
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0: front, 1: back, 2: left, 3: right
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Filters (client-side)
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { showToast } = useToast();

  async function reloadDesigns() {
    try {
      const res = await fetch(DESIGNS_URL);
      const data = await res.json();
      // API response: { ok: true, data: { designs: [...], page, limit, total, totalPages } }
      setUserDesigns(data?.data?.designs ?? []);
    } catch (e) {
      // non-fatal
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
        showToast({ content: "Failed to load designs", error: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [DESIGNS_URL, showToast]);

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

  const statusTone = (status) => (status || "").toLowerCase().includes("ordered") ? "success" : "info";
  const statusColor = (s) =>
    s.includes("ordered") ? "success" : s.includes("draft") ? "subdued" : "info";

  // ---------- Stats ----------
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

  // ---------- Filters ----------
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

  // ---------- Delete ----------
  async function confirmDelete() {
    if (!deleteDlg.id) return;

    const { id, email } = deleteDlg;
    try {
      setDeleting(true);
      // keep your existing delete route if it stays the same:
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}design/delete-designfrontEnd/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerEmail: email }),
      });

      if (res.ok) {
        // Optimistic update
        setUserDesigns((prev) => prev.filter((d) => d._id !== id));
        showToast({ content: "Design deleted successfully!", error: false });
        // Close dialog
        setDeleteDlg({ open: false, id: null, email: "", name: "" });
        // Hard refresh from the new all-designs API
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

          {/* SUMMARY CARDS */}
          <Box
            paddingBlockEnd="400"
            style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}
          >
            <Card><Box padding="400"><Text variant="headingSm">Total Designs</Text><Text variant="headingLg">{stats.total}</Text></Box></Card>
            <Card><Box padding="400"><Text variant="headingSm">New Today</Text><Text variant="headingLg">{stats.today}</Text></Box></Card>
            <Card><Box padding="400"><Text variant="headingSm">Last 7 Days</Text><Text variant="headingLg">{stats.last7d}</Text></Box></Card>
            <Card><Box padding="400"><Text variant="headingSm">% Ordered</Text><Text variant="headingLg">{stats.orderedPct}%</Text></Box></Card>
            <Card><Box padding="400"><Text variant="headingSm">Unique Customers</Text><Text variant="headingLg">{stats.uniqueCustomers}</Text></Box></Card>
            <Card><Box padding="400"><Text variant="headingSm">Avg Images / Design</Text><Text variant="headingLg">{stats.avgImages}</Text></Box></Card>
          </Box>

          {/* STATUS BREAKDOWN */}
           <br></br>
          <Card>
            <Box padding="400">
              <Text variant="headingMd">Status</Text>
              <Box paddingBlockStart="200" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {Object.entries(stats.byStatus).map(([s, c]) => (
                  <Badge key={s} tone={statusColor(s)}>{s}: {c}</Badge>
                ))}
              </Box>
            </Box>
          </Card>

          {/* QUICK FILTERS + EXPORT */}
          <br></br>
          <Box
            paddingBlockStart="400"
            paddingBlockEnd="200"
            style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" , }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or email…"
              style={{ padding: "8px 12px", border: "1px solid var(--p-color-border)", borderRadius: 8, minWidth: 260 }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: "8px 12px", border: "1px solid var(--p-color-border)", borderRadius: 8 }}
            >
              <option value="all">All statuses</option>
              {Object.keys(stats.byStatus).map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <div style={{ marginLeft: "auto" }}>
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
            </div>
          </Box>

          {/* LIST */}
          <br></br>
          <Card>
            <Box padding="400">
              <Text variant="headingLg" as="h2">All Designs</Text>
            </Box>
            <Divider />
            <Box padding="400">
              {userDesigns.length === 0 ? (
                <EmptyState
                  heading="No designs found."
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <p>Track and receive your incoming designs from customers.</p>
                </EmptyState>
              ) : filteredDesigns.length === 0 ? (
                <Card>
                  <Box padding="400">
                    <Text tone="subdued">No designs match your current filters.</Text>
                  </Box>
                </Card>
              ) : (
                <ResourceList
                  items={filteredDesigns}
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
                      (FinalImages?.[0] ?? "/placeholder.png");

                    return (
                      <ResourceItem id={_id} key={_id} media={<Thumbnail source={firstThumb} size="small" />}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                          <TextContainer>
                            <Text variant="headingMd" as="h3">{DesignName || "(untitled)"}</Text>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <Badge tone={statusTone(status)}>{status}</Badge>
                              <Text variant="bodySm" tone="subdued">
                                version: <strong>{version ?? "-"}</strong>
                              </Text>
                              <Text variant="bodySm" tone="subdued">
                                Created: {new Date(createdAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC
                              </Text>
                            </div>
                            <Text variant="bodySm" tone="subdued">Email: {ownerEmail}</Text>
                          </TextContainer>

                          <div style={{ display: "flex", gap: 8 }}>
                            <Button onClick={() => handleViewDesign(item)} primary>
                              View details
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
                    );
                  }}
                />
              )}
            </Box>
          </Card>
        </Layout.Section>
      </Layout>

      {/* VIEWER MODAL */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          selectedDesign ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
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

                  <div
                    style={{
                      marginTop: 12,
                      display: "grid",
                      gridTemplateColumns: "repeat(4, minmax(0,1fr))",
                      gap: 10,
                    }}
                  >
                    {(selectedDesign.FinalImages || []).map((img, i) => (
                      <button
                        key={img + i}
                        onClick={() => setGalleryIndex(i)}
                        style={{
                          border:
                            i === galleryIndex
                              ? "2px solid var(--p-color-border-interactive)"
                              : "1px solid var(--p-color-border)",
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

      {/* DELETE CONFIRM MODAL */}
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
                <div
                  key={idx}
                  style={{ border: "1px solid var(--p-color-border)", borderRadius: 12, overflow: "hidden" }}
                >
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
                    <Text><strong>Content:</strong> {t.content}</Text>
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
                      <strong>{t.width}×{t.height}</strong>
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
}

