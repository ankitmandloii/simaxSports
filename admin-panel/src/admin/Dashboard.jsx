import React, { useEffect, useState } from "react";
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
} from "@shopify/polaris";

export function Dashboard() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [userDesigns, setUserDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState(null); // For modal
  const [modalOpen, setModalOpen] = useState(false); // Modal visibility
  const [showFront, setShowFront] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [showLeftSleeve, setShowLeftSleeve] = useState(false);
  const [showRightSleeve, setShowRightSleeve] = useState(false);

  // Fetch design data from API
  useEffect(() => {
    const fetchDesigns = async () => {

      try {

        const response = await fetch(
          `${BASE_URL}design/get-AllOrderedDesignfrontEnd`
        );
        const data = await response.json();
        console.log("data", data?.data?.designs)
        setUserDesigns(data?.data?.designs ?? []); // Extract designs from the response
      } catch (error) {
        console.error("Error fetching designs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  // Handle View Design click
  const handleViewDesign = (design) => {
    setSelectedDesign(design);
    setModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDesign(null);
  };

  // Toggle visibility of design sections
  const toggleSection = (section) => {
    if (section === "front") setShowFront(!showFront);
    if (section === "back") setShowBack(!showBack);
    if (section === "leftSleeve") setShowLeftSleeve(!showLeftSleeve);
    if (section === "rightSleeve") setShowRightSleeve(!showRightSleeve);
  };

  if (loading) {
    return <Page fullWidth title="Dashboard" subtitle="Loading... Please wait" />;
  }

  return (
    <Page fullWidth title="Dashboard" subtitle="Manage your designs here.">
      <Layout>
        <Layout.Section>
          <Card title="All Designs" sectioned>
            {userDesigns.length === 0 ? (
              <Text variant="bodySm" tone="subdued">
                No designs found.
              </Text>
            ) : (
              <ResourceList
                items={userDesigns}
                renderItem={(item) => {
                  const { _id, DesignName, present, status, DesignNotes, FinalImages } = item;
                  return (
                    <ResourceItem id={_id}>
                      <TextContainer>
                        <Text variant="headingLg">{DesignName}</Text>
                        <Badge
                          tone={status?.toLowerCase().includes("ordered")
                            ? "Success"
                            : "info"}
                          style={{ marginBottom: "10px" }}
                        >
                          {status}
                        </Badge>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <Thumbnail
                            source={present.front.images[0]?.src || "/placeholder.png"}
                            alt="Design Image"
                            size="small"
                          />
                          <TextContainer>
                            <Text variant="bodyMd" as="p">{DesignNotes?.FrontDesignNotes}</Text>
                            <Text variant="bodySm" tone="subdued">{DesignNotes?.ExtraInfo}</Text>
                          </TextContainer>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <Button primary onClick={() => handleViewDesign(item)}>
                            View Details
                          </Button>
                          <Button destructive onClick={() => handleDelete(_id)}>
                            Delete
                          </Button>
                        </div>
                      </TextContainer>
                    </ResourceItem>
                  );
                }}
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>

      {/* Modal to view design details */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title="Design Details"
        primaryAction={{
          content: "Close",
          onAction: handleCloseModal,
        }}
      >
        <Modal.Section>
          {selectedDesign && (
            <div>
              {/* Design Name and Status */}
              <Text variant="headingLg">{selectedDesign.DesignName}</Text>
              <Badge
                tone={selectedDesign.status?.toLowerCase().includes("ordered")
                  ? "Success"
                  : "info"}
                style={{ marginBottom: "10px" }}
              >
                {selectedDesign.status}
              </Badge>

              {/* Final Images */}
              {selectedDesign.FinalImages && selectedDesign.FinalImages.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <Text variant="headingMd">Final Design Images</Text>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {selectedDesign.FinalImages.map((image, index) => (
                      <Thumbnail
                        key={index}
                        source={image}
                        alt={`Final Design Image ${index + 1}`}
                        size="large"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Front Design Section */}
              <Button onClick={() => toggleSection("front")} variant="primary">
                {showFront ? "Hide Front Design Details" : "Show Front Design Details"}
              </Button>
              {showFront && (
                <div style={{ marginTop: "20px" }}>
                  <Text variant="headingMd">Front Design</Text>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {selectedDesign.present.front.images.map((img, index) => (
                      <Thumbnail key={index} source={img.src} alt={`Image ${index + 1}`} size="large" />
                    ))}
                    {selectedDesign.present.front.texts.map((text, index) => (
                      <Card key={index} sectioned>
                        <Text variant="bodyMd" tone="subdued"> Content: <span style={{ fontWeight: "bold", color: "black" }}> {text.content}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontFamily}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Color: <span style={{ fontWeight: "bold", color: "black" }}> {text.textColor}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font Weight: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontWeight}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font Size: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontSize}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font Style: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontStyle}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Position: X: <span style={{ fontWeight: "bold", color: "black" }}> {text.position?.x}</span> Y: <span style={{ fontWeight: "bold", color: "black" }}> {text.position?.y}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Layer Index: <span style={{ fontWeight: "bold", color: "black" }}> {text.layerIndex}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Size: <span style={{ fontWeight: "bold", color: "black" }}> {text.size}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Scale X: <span style={{ fontWeight: "bold", color: "black" }}> {text.scaleX}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Scale Y: <span style={{ fontWeight: "bold", color: "black" }}> {text.scaleY}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Angle: <span style={{ fontWeight: "bold", color: "black" }}> {text.angle}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Spacing: <span style={{ fontWeight: "bold", color: "black" }}> {text.spacing}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Arc: <span style={{ fontWeight: "bold", color: "black" }}> {text.arc}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Center: <span style={{ fontWeight: "bold", color: "black" }}> {text.center}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Flip X: <span style={{ fontWeight: "bold", color: "black" }}> {text.flipX ? "true" : "false"}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Flip Y: <span style={{ fontWeight: "bold", color: "black" }}> {text.flipY ? "true" : "false"}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Width: <span style={{ fontWeight: "bold", color: "black" }}> {text.width}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Height: <span style={{ fontWeight: "bold", color: "black" }}> {text.height}</span> </Text>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Back Design Section */}
              <Button onClick={() => toggleSection("back")} variant="primary">
                {showBack ? "Hide Back Design Details" : "Show Back Design Details"}
              </Button>
              {showBack && (
                <div style={{ marginTop: "20px" }}>
                  <Text variant="headingMd">Back Design</Text>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {selectedDesign.present.back.images.map((img, index) => (
                      <Thumbnail key={index} source={img.src} alt={`Image ${index + 1}`} size="large" />
                    ))}
                    {selectedDesign.present.back.texts.map((text, index) => (
                      <Card key={index} sectioned>
                        <Text variant="bodyMd" tone="subdued"> Content: <span style={{ fontWeight: "bold", color: "black" }}> {text.content}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontFamily}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Color: <span style={{ fontWeight: "bold", color: "black" }}> {text.textColor}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font Weight: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontWeight}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font Size: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontSize}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font Style: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontStyle}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Position: X: <span style={{ fontWeight: "bold", color: "black" }}> {text.position?.x}</span> Y: <span style={{ fontWeight: "bold", color: "black" }}> {text.position?.y}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Layer Index: <span style={{ fontWeight: "bold", color: "black" }}> {text.layerIndex}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Size: <span style={{ fontWeight: "bold", color: "black" }}> {text.size}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Scale X: <span style={{ fontWeight: "bold", color: "black" }}> {text.scaleX}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Scale Y: <span style={{ fontWeight: "bold", color: "black" }}> {text.scaleY}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Angle: <span style={{ fontWeight: "bold", color: "black" }}> {text.angle}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Spacing: <span style={{ fontWeight: "bold", color: "black" }}> {text.spacing}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Arc: <span style={{ fontWeight: "bold", color: "black" }}> {text.arc}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Center: <span style={{ fontWeight: "bold", color: "black" }}> {text.center}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Flip X: <span style={{ fontWeight: "bold", color: "black" }}> {text.flipX ? "true" : "false"}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Flip Y: <span style={{ fontWeight: "bold", color: "black" }}> {text.flipY ? "true" : "false"}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Width: <span style={{ fontWeight: "bold", color: "black" }}> {text.width}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Height: <span style={{ fontWeight: "bold", color: "black" }}> {text.height}</span> </Text>

                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Left Sleeve Design Section */}
              <Button onClick={() => toggleSection("leftSleeve")} variant="primary">
                {showLeftSleeve ? "Hide Left Sleeve Details" : "Show Left Sleeve Details"}
              </Button>
              {showLeftSleeve && (
                <div style={{ marginTop: "20px" }}>
                  <Text variant="headingMd">Left Sleeve Design</Text>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {selectedDesign.present.leftSleeve.images.map((img, index) => (
                      <Thumbnail key={index} source={img.src} alt={`Image ${index + 1}`} size="large" />
                    ))}
                    {selectedDesign.present.leftSleeve.texts.map((text, index) => (
                      <Card key={index} sectioned>
                        <Text variant="bodyMd" tone="subdued"> Content: <span style={{ fontWeight: "bold", color: "black" }}> {text.content}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontFamily}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Color: <span style={{ fontWeight: "bold", color: "black" }}> {text.textColor}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font Weight: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontWeight}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font Size: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontSize}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font Style: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontStyle}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Position: X: <span style={{ fontWeight: "bold", color: "black" }}> {text.position?.x}</span> Y: <span style={{ fontWeight: "bold", color: "black" }}> {text.position?.y}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Layer Index: <span style={{ fontWeight: "bold", color: "black" }}> {text.layerIndex}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Size: <span style={{ fontWeight: "bold", color: "black" }}> {text.size}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Scale X: <span style={{ fontWeight: "bold", color: "black" }}> {text.scaleX}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Scale Y: <span style={{ fontWeight: "bold", color: "black" }}> {text.scaleY}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Angle: <span style={{ fontWeight: "bold", color: "black" }}> {text.angle}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Spacing: <span style={{ fontWeight: "bold", color: "black" }}> {text.spacing}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Arc: <span style={{ fontWeight: "bold", color: "black" }}> {text.arc}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Center: <span style={{ fontWeight: "bold", color: "black" }}> {text.center}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Flip X: <span style={{ fontWeight: "bold", color: "black" }}> {text.flipX ? "true" : "false"}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Flip Y: <span style={{ fontWeight: "bold", color: "black" }}> {text.flipY ? "true" : "false"}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Width: <span style={{ fontWeight: "bold", color: "black" }}> {text.width}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Height: <span style={{ fontWeight: "bold", color: "black" }}> {text.height}</span> </Text>

                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Right Sleeve Design Section */}
              <Button onClick={() => toggleSection("rightSleeve")} variant="primary">
                {showRightSleeve ? "Hide Right Sleeve Details" : "Show Right Sleeve Details"}
              </Button>
              {showRightSleeve && (
                <div style={{ marginTop: "20px" }}>
                  <Text variant="headingMd">Right Sleeve Design</Text>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {selectedDesign.present.rightSleeve.images.map((img, index) => (
                      <Thumbnail key={index} source={img.src} alt={`Image ${index + 1}`} size="large" />
                    ))}
                    {selectedDesign.present.rightSleeve.texts.map((text, index) => (
                      <Card key={index} sectioned>
                        <Text variant="bodyMd" tone="subdued"> Content: <span style={{ fontWeight: "bold", color: "black" }}> {text.content}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontFamily}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Color: <span style={{ fontWeight: "bold", color: "black" }}> {text.textColor}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font Weight: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontWeight}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font Size: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontSize}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Font Style: <span style={{ fontWeight: "bold", color: "black" }}> {text.fontStyle}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Position: X: <span style={{ fontWeight: "bold", color: "black" }}> {text.position?.x}</span> Y: <span style={{ fontWeight: "bold", color: "black" }}> {text.position?.y}</span>
                        </Text> <Text variant="bodySm" tone="subdued"> Layer Index: <span style={{ fontWeight: "bold", color: "black" }}> {text.layerIndex}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Size: <span style={{ fontWeight: "bold", color: "black" }}> {text.size}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Scale X: <span style={{ fontWeight: "bold", color: "black" }}> {text.scaleX}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Scale Y: <span style={{ fontWeight: "bold", color: "black" }}> {text.scaleY}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Angle: <span style={{ fontWeight: "bold", color: "black" }}> {text.angle}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Spacing: <span style={{ fontWeight: "bold", color: "black" }}> {text.spacing}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Arc: <span style={{ fontWeight: "bold", color: "black" }}> {text.arc}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Center: <span style={{ fontWeight: "bold", color: "black" }}> {text.center}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Flip X: <span style={{ fontWeight: "bold", color: "black" }}> {text.flipX ? "true" : "false"}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Flip Y: <span style={{ fontWeight: "bold", color: "black" }}> {text.flipY ? "true" : "false"}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Width: <span style={{ fontWeight: "bold", color: "black" }}> {text.width}</span> </Text>
                        <Text variant="bodySm" tone="subdued"> Height: <span style={{ fontWeight: "bold", color: "black" }}> {text.height}</span> </Text>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Design Notes */}
              <Text variant="headingMd">Design Notes</Text>
              <Card sectioned>
                <Text variant="bodySm"><strong>Front Notes:</strong> {selectedDesign.DesignNotes?.FrontDesignNotes}</Text>
                <Text variant="bodySm"><strong>Back Notes:</strong> {selectedDesign.DesignNotes?.BackDesignNotes}</Text>
                <Text variant="bodySm"><strong>Extra Info:</strong> {selectedDesign.DesignNotes?.ExtraInfo}</Text>
              </Card>
            </div>
          )}
        </Modal.Section>
      </Modal>
    </Page>
  );

  // Handle Delete Design
  function handleDelete(designId) {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    fetch(
      `${BASE_URL}design/delete-designfrontEnd/${designId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerEmail: "testuser@example.com" }),
      }
    ).then((response) => {
      if (response.ok) {
        setUserDesigns((prev) => prev.filter((design) => design._id !== designId));
        alert("Design deleted successfully!");
      } else {
        alert("Failed to delete design");
      }
    });
  }
}
