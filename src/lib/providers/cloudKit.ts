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
    } catch (_e) {
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
}
