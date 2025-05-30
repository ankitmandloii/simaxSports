// src/admin/Setting.js
import {
  Page,
  Card,
  Text,
  TextField,
  InlineStack,
  Button,
  Box,
  Checkbox,
  BlockStack,
  Divider,
  Toast,
} from '@shopify/polaris';
import { useCallback, useState } from 'react';

export default function Setting() {
  const [storeName, setStoreName] = useState('Simax Apparel');
  const [email, setEmail] = useState('admin@simaxapparel.com');
  const [phone, setPhone] = useState('+1 123-456-7890');
  const [toastActive, setToastActive] = useState(false);

  const toggleToastActive = useCallback(() => setToastActive((active) => !active), []);
  const toastMarkup = toastActive ? (
    <Toast content="Settings saved successfully" onDismiss={toggleToastActive} />
  ) : null;

  const [settingsForTextSection, setSettingsForTextSection] = useState({
    sideBarTextSection: true,
    textEditor: true,
    font: true,
    color: true,
    outline: true,
    size: true,
    arc: true,
    rotate: true,
    spacing: true,
    center: true,
    layering: true,
    flip: true,
    lock: true,
    boldItalic: true,
    duplicate: true,
  });

  const handleToggleForTextSection = (field) => {
    setSettingsForTextSection(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveTextForm = () => {
    console.log('Settings saved:', settingsForTextSection);
    setToastActive(true);
  };

  const SettingsStoresaved = () => {
    console.log('Settings saved:', { storeName, email, phone });
    setToastActive(true);
  };

  const [settingsforAddNamesAndNumbers, setSettingsforAddNamesAndNumbers] = useState({
    sideBarAddNamesAndNumbersSection: true,
    addNames: true,
    addNumbers: true,
    sideSelection: true,
    sizeSelection: true,
    fontSelector: true,
    colorPicker: true,
    submitButton: true,
  });

  const handleToggleforNameAndNumbersSetting = (key) => {
    setSettingsforAddNamesAndNumbers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveforNameAndNumbersSetting = () => {
    console.log('Saved Names & Numbers Settings:', settingsforAddNamesAndNumbers);
    setToastActive(true);
  };


  // ADD ART SECTION SETTINGS

  const [settingsforAddArtSection, setSettingsforAddArtSection] = useState({
    sideBarAddArtSection: true,
    addArt: true,
    artSelection: true,
    sizeSelection: true,
    fontSelector: true,
    colorPicker: true,
    submitButton: true,
  });
  const handleToggleforAddArtSectionSetting = (key) => {
    setSettingsforAddArtSection(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const handleSaveforAddArtSectionSettings = () => {
    console.log('Saved Add Art Settings:', settingsforAddArtSection);
    setToastActive(true);
  };




  // Image Upload SECTION SETTINGS

  const [uploadSettings, setUploadSettings] = useState({
    sideBarImageUploadSection: true,
    enableDragAndDrop: true,
    enableShareButton: true,
    enableGoogleDrive: true,
    enableDropbox: true,

  });


  const handleToggleUploadSetting = (key) => {
    setUploadSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const handleSaveUploadSettings = () => {
    console.log('Saved Upload Settings:', uploadSettings);
    setToastActive(true);
  };


  //  IMAGE UPLOAD edit ART work section SETTINGS

  const [artworkEditorSettings, setArtworkEditorSettings] = useState({
    Filter: true,
    editColors: true,
    removeBackgroundAI: true,
    cropTrim: true,
    superResolution: true,
    replaceBackgroundAI: true,
    sizeSlider: true,
    rotateSlider: true,
    centerButton: true,
    layeringButton: true,
    flipButton: true,
    lockButton: true,
    duplicateButton: true,
  });

  const handleToggleArtworkSettings = (key) => {
    setArtworkEditorSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const handleSaveArtworkEditorSettings = () => {
    console.log('Saved Artwork Editor Settings:', artworkEditorSettings);
    setToastActive(true);
  }


  return (
    <Page title="Settings" fullWidth subtitle="Manage your product gadget settings here for visible to the user.">
      {/* GRID WRAPPER FOR CARDS */}
      <Box
        paddingBlockEnd="500"
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        }}
      >
        {/* TEXT SECTION SETTINGS */}
        <Card sectioned>
          <BlockStack gap="400">
            <Text variant="headingLg" as="h2">Text Section Settings</Text>
            <Text tone="subdued">Toggle features you want to enable in the text design section.</Text>
            <Divider />
            <Box paddingBlock="300">
              <BlockStack gap="200">
                {Object.entries(settingsForTextSection).map(([key, value]) => (
                  <Checkbox
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    checked={value}
                    onChange={() => handleToggleForTextSection(key)}
                  />
                ))}
              </BlockStack>
            </Box>
            <InlineStack align="end">
              <Button variant="primary" onClick={handleSaveTextForm}>
                Save Text Section Settings
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* NAMES & NUMBERS SETTINGS */}
        <Card sectioned>
          <BlockStack gap="400">
            <Text variant="headingLg" as="h2">Names & Numbers Settings</Text>
            <Text tone="subdued">Enable/disable personalized name and number options.</Text>
            <Divider />
            <Box paddingBlock="300">
              <BlockStack gap="200">
                {Object.entries(settingsforAddNamesAndNumbers).map(([key, value]) => (
                  <Checkbox
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    checked={value}
                    onChange={() => handleToggleforNameAndNumbersSetting(key)}
                  />
                ))}
              </BlockStack>
            </Box>
            <InlineStack align="end">
              <Button variant="primary" onClick={handleSaveforNameAndNumbersSetting}>
                Save Names & Numbers Settings
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* ADD ART Sectoin */}
        <Card sectioned>
          <BlockStack gap="400">
            <Text variant="headingLg" as="h2">Add Art Settings</Text>
            <Text tone="subdued">Enable/disable personalized ADD ART options.</Text>
            <Divider />
            <Box paddingBlock="300">
              <BlockStack gap="200">
                {Object.entries(settingsforAddArtSection).map(([key, value]) => (
                  <Checkbox
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    checked={value}
                    onChange={() => handleToggleforAddArtSectionSetting(key)}
                  />
                ))}
              </BlockStack>
            </Box>
            <InlineStack align="end">
              <Button variant="primary" onClick={handleSaveforAddArtSectionSettings}>
                Save Add Art Settings
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>



        {/* ARTWORK EDITOR SETTINGS */}

        <Card sectioned>
          <BlockStack gap="400">
            <Text variant="headingLg" as="h2">Image Upload Sections's Edit Artwork Settings</Text>
            <Text tone="subdued">Toggle options to control artwork editing tools visible to the user.</Text>
            <Divider />
            <Box paddingBlock="300">
              <BlockStack gap="200">
                {Object.entries(artworkEditorSettings).map(([key, value]) => (
                  <Checkbox
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    checked={value}
                    onChange={() => handleToggleArtworkSettings(key)}
                  />
                ))}
              </BlockStack>
            </Box>
            <InlineStack align="end">
              <Button variant="primary" onClick={handleSaveArtworkEditorSettings}>
                Save Artwork Settings
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>

     


      {/* IMAGE UPLOAD SETTINGS */}
      <Card sectioned>
        <BlockStack gap="400">
          <Text variant="headingLg" as="h2">Upload Art Settings</Text>
          <Text tone="subdued">Enable or disable options for the upload section.</Text>
          <Divider />
          <Box paddingBlock="300">
            <BlockStack gap="200">
              {Object.entries(uploadSettings).map(([key, value]) => (
                <Checkbox
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  checked={value}
                  onChange={() => handleToggleUploadSetting(key)}
                />
              ))}
            </BlockStack>
          </Box>
          <InlineStack align="end">
            <Button variant="primary" onClick={handleSaveUploadSettings}>
              Save Upload Settings
            </Button>
          </InlineStack>
        </BlockStack>
      </Card>

 </Box>
      {/* STORE INFO SETTINGS */}
      <Card sectioned>
        <BlockStack gap="400">
          <Text variant="headingLg" as="h2">Information</Text>
          <Text tone="subdued">Update your store’s basic contact info below.</Text>
          <Divider />
          <Box paddingBlockStart="300">
            <TextField
              label="Store name"
              value={storeName}
              onChange={setStoreName}
              autoComplete="off"
            />
          </Box>
          <Box paddingBlockStart="300">
            <TextField
              label="Email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
          </Box>
          <Box paddingBlockStart="300">
            <TextField
              label="Phone"
              value={phone}
              onChange={setPhone}
              autoComplete="tel"
            />
          </Box>
          <InlineStack align="end" paddingBlockStart="300">
            <Button variant="primary" onClick={SettingsStoresaved}>
              Save Store Info
            </Button>
          </InlineStack>
        </BlockStack>
      </Card>

      {toastMarkup}
    </Page>
  );
}
