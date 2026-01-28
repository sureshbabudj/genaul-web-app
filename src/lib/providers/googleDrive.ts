import type { GenaulData, ProviderName } from "@/types";
import type { VaultProvider } from "./types";

export class GoogleDriveProvider implements VaultProvider {
  public readonly name: ProviderName = "google-drive";
  private fileName = "vault.json";

  async save(data: GenaulData): Promise<void> {
    const token = window.gapi?.auth?.getToken()?.access_token;
    if (!token) throw new Error("Google SSO not authenticated");

    const search = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${this.fileName}'&spaces=appDataFolder`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const { files } = await search.json();
    const fileId = files[0]?.id;

    // Use Multipart Upload for metadata + content safety
    const boundary = "genaul_sync_boundary";
    const metadata = JSON.stringify({
      name: this.fileName,
      parents: ["appDataFolder"],
    });
    const content = JSON.stringify(data);

    const body =
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
      `--${boundary}\r\nContent-Type: application/json\r\n\r\n${content}\r\n--${boundary}--`;

    const url = fileId
      ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
      : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

    await fetch(url, {
      method: fileId ? "PATCH" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    });
  }

  async load(): Promise<GenaulData | null> {
    const token = window.gapi?.auth?.getToken()?.access_token;
    const search = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${this.fileName}'&spaces=appDataFolder&fields=files(id)`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const { files } = await search.json();
    if (!files.length) return null;

    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${files[0].id}?alt=media`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res.json();
  }
}
