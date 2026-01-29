/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Window {
    gapi: {
      load: (module: string, callback: () => void) => void;
      client: {
        init: (config: {
          apiKey: string;
          discoveryDocs: string[];
        }) => Promise<void>;
        setToken: (token: any) => void;
      };
      auth: {
        getToken: () => { access_token: string } | null;
      };
    };

    CloudKit?: any;

    google?: any;
  }
}
