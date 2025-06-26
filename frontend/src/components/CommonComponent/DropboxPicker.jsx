// DropboxPicker.js
import { useEffect, useState } from "react";

const DROPBOX_APP_KEY = process.env.REACT_APP_DROP_BOX_APP_KEY;




const DropboxPicker = ({ onFilesSelected, children }) => {
  const [isReady, setIsReady] = useState(false);



  useEffect(() => {
    if (!document.getElementById("dropboxjs")) {
      const script = document.createElement("script");
      script.id = "dropboxjs";
      script.src = "https://www.dropbox.com/static/api/2/dropins.js";
      script.type = "text/javascript";
      script.setAttribute("data-app-key", DROPBOX_APP_KEY);
      script.onload = () => setIsReady(true);
      document.body.appendChild(script);
    } else {
      setIsReady(true);
    }
  }, []);

  const openDropboxChooser = () => {
    if (!window.Dropbox) return;

    window.Dropbox.choose({
      linkType: "direct",
      multiselect: true,
      extensions: [".pdf", ".png", ".jpg", ".jpeg", ".psd", ".ai", ".tiff"],
      success: (files) => {
        onFilesSelected(files);
      },
      cancel: () => {
        console.log("Dropbox chooser closed");
      },
    });
  };

  return (
    <div onClick={isReady ? openDropboxChooser : undefined}>
      {children}
    </div>
  );
};

export default DropboxPicker;
