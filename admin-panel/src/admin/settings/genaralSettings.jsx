import {
  Page,
  Card,
  Text,
  InlineStack,
  Button,
  Box,
  BlockStack,
  Divider,
  } from '@shopify/polaris';
import { useEffect, useState } from 'react';
import { useToast } from '../ToastContext';
import { useDispatch } from 'react-redux';
import { setAllSettings } from '../../redux/settings/settingsSlice';
import { SwitchToggle } from '../switchToggle';



export default function GeneralSettings() {

  const { showToast } = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

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

  // const handleSaveTextForm = () => {
  //   console.log('Settings saved:', settingsForTextSection);
  //   setToastActive(true);
  // };


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

  // const handleSaveforNameAndNumbersSetting = () => {
  //   console.log('Saved Names & Numbers Settings:', settingsforAddNamesAndNumbers);
  //   setToastActive(true);
  // };


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

  // const handleSaveforAddArtSectionSettings = () => {
  //   console.log('Saved Add Art Settings:', settingsforAddArtSection);
  //   setToastActive(true);
  // };




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

  // const handleSaveUploadSettings = () => {
  //   console.log('Saved Upload Settings:', uploadSettings);
  //   setToastActive(true);
  // };


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

  // const handleSaveArtworkEditorSettings = () => {
  //   console.log('Saved Artwork Editor Settings:', artworkEditorSettings);
  //   setToastActive(true);
  // }



  const [otherSettings, setOtherSettings] = useState({
    enableZoomFeature: true,
    enableSleevesShow: true,
    enableFrontSmallImageSectionShow: true,
    enableBackSmallImageSectionShow: true,
    enableMainImageSectionShow: true,
  });

  const handleToggleOtherSetting = (key) => {
    setOtherSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }

  // const handleSaveOtherSettings = () => {
  //   console.log('Saved Other Settings:', otherSettings);
  //   setToastActive(true);
  // }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}design/admin-get-settings`);
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();

        setSettingsForTextSection(data.settingsForTextSection || {});
        setSettingsforAddNamesAndNumbers(data.settingsforAddNamesAndNumbers || {});
        setSettingsforAddArtSection(data.settingsforAddArtSection || {});
        setUploadSettings(data.uploadSettings || {});
        setArtworkEditorSettings(data.artworkEditorSettings || {});
        setOtherSettings(data.otherSettings || {});

        dispatch(setAllSettings(data)); // Optional: update redux state too

      } catch (error) {
        console.error('Error fetching settings:', error);
        showToast({ content: "Failed to load settings", error: true });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [BASE_URL, dispatch ,showToast]);

  function checkIfAnyTrueExists(settings) {
    let hasAnyTrue = false;

    function recursiveCheck(obj) {
      for (const value of Object.values(obj)) {
        if (typeof value === 'object' && value !== null) {
          recursiveCheck(value);
        } else if (value === true) {
          hasAnyTrue = true;
          return;
        }
      }
    }

    recursiveCheck(settings);

    if (hasAnyTrue) {
      return true;
    } else {
      return false;
    }
  }

  const handleSaveAllSettings = async () => {


    const settings = {
      settingsForTextSection: settingsForTextSection,
      settingsforAddNamesAndNumbers: settingsforAddNamesAndNumbers,
      settingsforAddArtSection: settingsforAddArtSection,
      uploadSettings: uploadSettings,
      artworkEditorSettings: artworkEditorSettings,
      otherSettings: otherSettings
    }
    const valid = checkIfAnyTrueExists(settings);
    if (!valid) {

      showToast({ content: "You have to enable something", error: true });
      return;

    }


    try {
      setLoading(true);

      dispatch(setAllSettings(settings));


      const res = await fetch(`${BASE_URL}design/admin-savesettings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        showToast({ content: "Settings Updated!" });
      } else {
        showToast({ content: "Failed to save settings", error: true });
      }
    } catch (error) {
      showToast({ content: "Error saving settings", error: true });
    } finally {
      setLoading(false);
    }

  };

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
                  <SwitchToggle
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    checked={value}
                    onChange={() => handleToggleForTextSection(key)}
                  />
                ))}
              </BlockStack>
            </Box>
            {/* <InlineStack align="end">
              <Button variant="primary" onClick={handleSaveTextForm}>
                Save Text Section Settings
              </Button>
            </InlineStack> */}
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
                  <SwitchToggle
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    checked={value}
                    onChange={() => handleToggleforNameAndNumbersSetting(key)}
                  />
                ))}
              </BlockStack>
            </Box>
            {/* <InlineStack align="end">
              <Button variant="primary" onClick={handleSaveforNameAndNumbersSetting}>
                Save Names & Numbers Settings
              </Button>
            </InlineStack> */}
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
                  <SwitchToggle
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    checked={value}
                    onChange={() => handleToggleforAddArtSectionSetting(key)}
                  />
                ))}
              </BlockStack>
            </Box>
            {/* <InlineStack align="end">
              <Button variant="primary" onClick={handleSaveforAddArtSectionSettings}>
                Save Add Art Settings
              </Button>
            </InlineStack> */}
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
                  <SwitchToggle
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    checked={value}
                    onChange={() => handleToggleArtworkSettings(key)}
                  />
                ))}
              </BlockStack>
            </Box>
            {/* <InlineStack align="end">
              <Button variant="primary" onClick={handleSaveArtworkEditorSettings}>
                Save Artwork Settings
              </Button>
            </InlineStack> */}
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
                  <SwitchToggle
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    checked={value}
                    onChange={() => handleToggleUploadSetting(key)}
                  />
                ))}
              </BlockStack>
            </Box>
            {/* <InlineStack align="end">
            <Button variant="primary" onClick={handleSaveUploadSettings}>
              Save Upload Settings
            </Button>
          </InlineStack> */}
          </BlockStack>
        </Card>


        {        /* Other SETTINGS  */}
        <Card sectioned>
          <BlockStack gap="400">
            <Text variant="headingLg" as="h2">Other Settings</Text>
            <Text tone="subdued">Enable or disable options for the Other settings section.</Text>
            <Divider />
            <Box paddingBlock="300">
              <BlockStack gap="200">
                {Object.entries(otherSettings).map(([key, value]) => (
                  <SwitchToggle
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    checked={value}
                    onChange={() => handleToggleOtherSetting(key)}
                  />
                ))}
              </BlockStack>
            </Box>
            {/* <InlineStack align="end">
            <Button variant="primary" onClick={handleSaveOtherSettings}>
              Save Others Settings
            </Button>
          </InlineStack> */}
          </BlockStack>
        </Card>
        <Box padding="1000">
          <InlineStack  >
            <Button variant="primary" size="large" onClick={handleSaveAllSettings} loading={loading}>
              Save Settings
            </Button>
          </InlineStack>
        </Box>
      </Box>







    </Page>
  );
}
