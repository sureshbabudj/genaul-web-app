import type { GenaulData, ProviderName } from "@/types";
import type { VaultProvider } from "./types";

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
}
