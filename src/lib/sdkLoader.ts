export const initSdks = async () => {
  // 1. Initialize Google
  if (window.gapi) {
    await new Promise((resolve) => {
      window.gapi.load("client", async () => {
        await window.gapi.client.init({
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
          ],
        });
        resolve(true);
      });
    });
  }

  // 2. Initialize CloudKit
  if (window.CloudKit) {
    window.CloudKit.configure({
      containers: [
        {
          containerIdentifier: import.meta.env.VITE_CLOUDKIT_CONTAINER_ID,
          apiToken: import.meta.env.VITE_CLOUDKIT_API_TOKEN,
          environment: import.meta.env.DEV ? "development" : "production",
        },
      ],
    });
  }

  return true;
};
