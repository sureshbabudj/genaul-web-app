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

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
