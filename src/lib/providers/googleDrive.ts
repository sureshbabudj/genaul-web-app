import type { GenaulData, ProviderName } from "@/types";
import { useGenaulStore } from "@/hooks/useGenaulStore";
import type { VaultProvider } from "./types";

export class GoogleDriveProvider implements VaultProvider {
  public readonly name: ProviderName = "google-drive";
  private fileName = "vault.json";
  private accessToken: string | null = null;

  setToken(token: string) {
    this.accessToken = token;
  }

  async save(data: GenaulData): Promise<void> {
    if (!this.accessToken) throw new Error("Google SSO not authenticated");

    // 1. Find if file exists
    const searchResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${this.fileName}'&spaces=appDataFolder`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } },
    );

    if (searchResponse.status === 401) {
      // This is the signal that the token is dead
      useGenaulStore.getState().setVaultToken(null);
      throw new Error("Session expired");
    }

    if (!searchResponse.ok) throw new Error("Failed to search Google Drive");
    const { files } = await searchResponse.json();
    const fileId = files[0]?.id;

    // 2. Prepare Metadata (Only include parents for NEW files)
    const metadata: { name: string; parents?: string[] } = {
      name: this.fileName,
    };
    if (!fileId) {
      metadata.parents = ["appDataFolder"];
    }

    const boundary = "genaul_sync_boundary";
    const body = [
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`,
      `--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(data)}\r\n`,
      `--${boundary}--`,
    ].join("");

    const url = fileId
      ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
      : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

    const response = await fetch(url, {
      method: fileId ? "PATCH" : "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    });

    if (!response.ok) {
      const err = await response.json();
      if (response.status === 401)
        useGenaulStore.getState().setVaultToken(null);
      throw new Error(err.error?.message || "Drive Save Failed");
    }
  }

  async load(): Promise<GenaulData | null> {
    if (!this.accessToken) return null;

    try {
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${this.fileName}'&spaces=appDataFolder&fields=files(id)`,
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        },
      );

      if (searchResponse.status === 401) {
        useGenaulStore.getState().setVaultToken(null);
        return null;
      }

      const { files } = await searchResponse.json();
      if (!files || files.length === 0) return null;

      const fileId = files[0].id;
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        },
      );

      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error("[GoogleDriveProvider] Load error:", err);
      return null;
    }
  }
}
