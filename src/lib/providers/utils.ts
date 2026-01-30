import { CloudKitProvider } from "./cloudKit";
import { GoogleDriveProvider } from "./googleDrive";
import { IndexedDBProvider } from "./idb";

export function createProviderInstance(type: string) {
  switch (type) {
    case "google-drive":
      return new GoogleDriveProvider();
    case "cloudkit":
      return new CloudKitProvider();
    case "indexeddb":
      return new IndexedDBProvider();
    default:
      return null;
  }
}
