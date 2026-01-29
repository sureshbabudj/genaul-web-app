export const initSdks = async () => {
  // 1. Initialize Google
  if (window.gapi) {
    console.warn(
      "Skipping gapi.client.init as it is unnecessary for fetch-based calls.",
    );
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
