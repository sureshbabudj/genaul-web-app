import type {
  GenaulData,
  ProviderName,
  VaultAccountInfo,
  VaultSession,
} from "@/types";
import type { VaultProvider } from "./types";
import { formatBytes } from "./utils";

export class CloudKitProvider implements VaultProvider {
  public readonly name: ProviderName = "cloudkit";
  private recordName = "GENAUL_VAULT_RECORD";

  async save(data: GenaulData): Promise<void> {
    const privateDB =
      window.CloudKit.getDefaultContainer().privateCloudDatabase;
    const payload = JSON.stringify(data);

    try {
      // Try fetching first to maintain the correct record change tag
      const { records } = await privateDB.fetchRecords([this.recordName]);
      const record = records[0];
      record.fields.payload = { value: payload };
      await privateDB.saveRecords([record]);
    } catch (_unusedError) {
      // Create new if doesn't exist
      await privateDB.saveRecords([
        {
          recordType: "VaultData",
          recordName: this.recordName,
          fields: { payload: { value: payload } },
        },
      ]);
    }
  }

  async load(): Promise<GenaulData | null> {
    try {
      const { records } =
        await window.CloudKit.getDefaultContainer().privateCloudDatabase.fetchRecords(
          [this.recordName],
        );
      return JSON.parse(records[0].fields.payload.value);
    } catch (e) {
      return null;
    }
  }

  async updateEcho(id: string, front: string, back: string): Promise<void> {
    const privateDB =
      window.CloudKit.getDefaultContainer().privateCloudDatabase;
    const payload = JSON.stringify({ id, front, back });

    try {
      const { records } = await privateDB.fetchRecords([id]);
      const record = records[0];
      record.fields.payload = { value: payload };
      await privateDB.saveRecords([record]);
    } catch (_unusedError) {
      throw new Error("Failed to update Echo in CloudKit");
    }
  }

  async deleteEcho(id: string): Promise<void> {
    const privateDB =
      window.CloudKit.getDefaultContainer().privateCloudDatabase;
    try {
      await privateDB.deleteRecords([id]);
    } catch (_unusedError) {
      throw new Error("Failed to delete Echo in CloudKit");
    }
  }

  async updateHall(id: string, name: string): Promise<void> {
    const privateDB =
      window.CloudKit.getDefaultContainer().privateCloudDatabase;
    const payload = JSON.stringify({ id, name });

    try {
      const { records } = await privateDB.fetchRecords([id]);
      const record = records[0];
      record.fields.payload = { value: payload };
      await privateDB.saveRecords([record]);
    } catch (_unusedError) {
      throw new Error("Failed to update Hall in CloudKit");
    }
  }

  async deleteHall(id: string): Promise<void> {
    const privateDB =
      window.CloudKit.getDefaultContainer().privateCloudDatabase;
    try {
      // Fetch all Echoes associated with the Hall
      const { records } = await privateDB.performQuery({
        recordType: "Echo",
        filterBy: [
          {
            fieldName: "hallId",
            comparator: "EQUALS",
            fieldValue: { value: id },
          },
        ],
      });

      // Delete all associated Echoes
      const echoIds = records.map(
        (record: { recordName: string }) => record.recordName,
      );
      if (echoIds.length > 0) {
        await privateDB.deleteRecords(echoIds);
      }

      // Delete the Hall itself
      await privateDB.deleteRecords([id]);
    } catch (_unusedError) {
      throw new Error(
        "Failed to delete Hall and associated Echoes in CloudKit",
      );
    }
  }

  async login(_silent?: boolean): Promise<VaultSession> {
    try {
      const container = window.CloudKit.getDefaultContainer();
      const userIdentity = await container.fetchCurrentUserIdentity();
      if (userIdentity?.userRecordName) {
        return {
          access_token: userIdentity.userRecordName,
          scope: "",
          expires_at: Date.now() + 3600 * 1000, // Assuming 1 hour expiry for CloudKit
        };
      }
      throw new Error("CloudKit auth failed");
    } catch (e) {
      throw new Error((e as Error).message || "CloudKit auth failed");
    }
  }

  async getAccountInfo(): Promise<VaultAccountInfo> {
    // update for IndexedDB
    return Promise.resolve({ email: "", name: "" });
  }

  async getStorageMetadata(): Promise<{ used: string }> {
    const container = window.CloudKit.getDefaultContainer();
    const privateDB = container.privateCloudDatabase;
    const { records } = await privateDB.fetchRecords([this.recordName]);
    if (!records?.[0]) return { used: "0 Bytes" };

    // Calculate size of the payload string specifically
    const bytes = new TextEncoder().encode(
      records[0].fields.payload.value,
    ).length;
    return { used: formatBytes(bytes) };
  }

  async logout(): Promise<void> {
    try {
      await window.CloudKit.getDefaultContainer().signOut();
    } catch (_error) {
      // Just clear the local token
      console.warn("CloudKit sign out failed, clearing local session.");
    }
  }

  async revokeAndReset(): Promise<void> {
    const privateDB =
      window.CloudKit.getDefaultContainer().privateCloudDatabase;

    // 1. Delete the main Vault record
    try {
      await privateDB.deleteRecords([this.recordName]);
    } catch (e) {
      console.warn("Record already gone or deletion failed", e);
    }

    // 2. Sign out
    await this.logout();
  }
}
