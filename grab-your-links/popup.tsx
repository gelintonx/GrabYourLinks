import { useState } from "react";
import type Link from "~types";
import { toast, Toaster } from "react-hot-toast";
import browser from "webextension-polyfill";


function IndexPopup() {
  const [links, setLink] = useState<Link[]>([]);

  const handleGrabButton = () => {
    const queryOptions = { windowId: browser.windows.WINDOW_ID_CURRENT };
    browser.tabs.query(queryOptions).then((tabs) => {
      const newLinks = tabs.map((tab) => ({
        title: tab.title,
        url: tab.url,
      }));

      setLink(newLinks);
      copyToClipboard(newLinks);
    }).catch((error) => {
      toast.error("Error fetching tabs:", {
        position: 'bottom-right'
      });
    });
  };

  const copyToClipboard = (links: Link[]) => {
    let text = "";
    links.forEach((link) => {
      if (link.url !== undefined) {
        text += link.url + "\n";
      }
    });

    if (!text) {
      toast("No URLs available");
    } else {

      navigator.clipboard.writeText(text).then(() => {
        toast.success("URLs copied to clipboard!", {
          position: 'bottom-right'
        });
      }).catch((err) => {
        toast.error("Failed to copy URLs", {
          position: 'bottom-right'

        });
      });
    }
  };

  return (
    <div style={popupContainerStyle}>
      <h4 style={titleStyle}>Grab Your Links</h4>
      <button onClick={handleGrabButton} style={buttonStyle}>
        <p style={buttonTextStyle}>Go!</p>
      </button>
      <Toaster toastOptions={{
        duration: 2000
      }} />
    </div>
  );
}

// Styles
const popupContainerStyle = {
  padding: "10px",
  width: "200px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const titleStyle = {
  fontWeight: "600",
  color: "#333",
  marginBottom: "16px",
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  padding: "12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "bold",
  transition: "background-color 0.3s ease",
};

const buttonTextStyle = {
  margin: "0",
};

export default IndexPopup;
