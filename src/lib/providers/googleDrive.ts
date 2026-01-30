import type {
  GenaulData,
  ProviderName,
  VaultAccountInfo,
  VaultSession,
} from "@/types";
import { useGenaulStore } from "@/hooks/useGenaulStore";
import type { VaultProvider } from "./types";

export class GoogleDriveProvider implements VaultProvider {
  public readonly name: ProviderName = "google-drive";
  private fileName = "vault.json";
  private accessToken: string | null = null;
  private isFetching = false;

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
      useGenaulStore.getState().setVaultSession(null);
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
    const content = JSON.stringify(data);
    const body =
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
      `--${boundary}\r\nContent-Type: application/json\r\n\r\n${content}\r\n--${boundary}--`;
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
        useGenaulStore.getState().setVaultSession(null);
      throw new Error(err.error?.message || "Drive Save Failed");
    }
  }

  async load(): Promise<GenaulData | null> {
    if (this.isFetching) return null; // Prevent concurrent loads
    this.isFetching = true;

    try {
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${this.fileName}'&spaces=appDataFolder&fields=files(id)`,
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        },
      );

      if (searchResponse.status === 401) {
        useGenaulStore.getState().setVaultSession(null);
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
    } finally {
      this.isFetching = false;
    }
  }

  async updateEcho(id: string, front: string, back: string): Promise<void> {
    if (!this.accessToken) throw new Error("Google SSO not authenticated");

    const searchResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${this.fileName}'&spaces=appDataFolder&fields=files(id)`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } },
    );

    if (!searchResponse.ok) throw new Error("Failed to search Google Drive");
    const { files } = await searchResponse.json();
    const fileId = files[0]?.id;

    if (!fileId) throw new Error("Vault file not found");

    const boundary = "genaul_sync_boundary";
    const payload = JSON.stringify({ id, front, back });
    const body = `--${boundary}\r\nContent-Type: application/json\r\n\r\n${payload}\r\n--${boundary}--`;

    const response = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body,
      },
    );

    if (!response.ok) throw new Error("Failed to update Echo in Google Drive");
  }

  async deleteEcho(_id: string): Promise<void> {
    if (!this.accessToken) throw new Error("Google SSO not authenticated");

    const searchResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${this.fileName}'&spaces=appDataFolder&fields=files(id)`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } },
    );

    if (!searchResponse.ok) throw new Error("Failed to search Google Drive");
    const { files } = await searchResponse.json();
    const fileId = files[0]?.id;

    if (!fileId) throw new Error("Vault file not found");

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${this.accessToken}` },
      },
    );

    if (!response.ok) throw new Error("Failed to delete Echo in Google Drive");
  }

  async updateHall(id: string, name: string): Promise<void> {
    if (!this.accessToken) throw new Error("Google SSO not authenticated");

    const searchResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${this.fileName}'&spaces=appDataFolder&fields=files(id)`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } },
    );

    if (!searchResponse.ok) throw new Error("Failed to search Google Drive");
    const { files } = await searchResponse.json();
    const fileId = files[0]?.id;

    if (!fileId) throw new Error("Vault file not found");

    const boundary = "genaul_sync_boundary";
    const payload = JSON.stringify({ id, name });
    const body = `--${boundary}\r\nContent-Type: application/json\r\n\r\n${payload}\r\n--${boundary}--`;

    const response = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body,
      },
    );

    if (!response.ok) throw new Error("Failed to update Hall in Google Drive");
  }

  async deleteHall(id: string): Promise<void> {
    if (!this.accessToken) throw new Error("Google SSO not authenticated");

    const searchResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${this.fileName}'&spaces=appDataFolder&fields=files(id)`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } },
    );

    if (!searchResponse.ok) throw new Error("Failed to search Google Drive");
    const { files } = await searchResponse.json();
    const fileId = files[0]?.id;

    if (!fileId) throw new Error("Vault file not found");

    // Fetch the current data
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } },
    );

    if (!res.ok) throw new Error("Failed to fetch Vault data");
    const data = await res.json();

    // Filter out the Hall and associated Echoes
    const updatedHalls = data.halls.filter((h: { id: string }) => h.id !== id);
    const updatedEchoes = data.echoes.filter(
      (e: { hallId: string }) => e.hallId !== id,
    );

    // Save the updated data
    await this.save({ ...data, halls: updatedHalls, echoes: updatedEchoes });
  }

  async login(silent = false): Promise<VaultSession> {
    return new Promise((resolve, reject) => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.appdata email profile",
        prompt: silent ? "none" : "",
        callback: (res: {
          access_token: string;
          expires_in: number;
          scope: string;
        }) => {
          if (res.access_token) {
            this.accessToken = res.access_token;
            resolve({
              access_token: res.access_token,
              expires_at: Date.now() + res.expires_in * 1000,
              scope: res.scope,
            });
          } else {
            reject(new Error("Auth failed"));
          }
        },
      });
      client.requestAccessToken();
    });
  }

  async getAccountInfo(): Promise<VaultAccountInfo> {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    const info = await res.json();
    return {
      email: info.email,
      name: info.name,
      avatarUrl: info.picture,
    };
  }

  async getStorageMetadata(): Promise<{ used: string }> {
    const res = await fetch(
      "https://www.googleapis.com/drive/v3/about?fields=storageQuota",
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      },
    );
    const { storageQuota } = await res.json();
    // Calculate usage specifically for the App Data folder if possible,
    // or return total Drive usage as a proxy
    const mb = (Number(storageQuota.usage) / (1024 * 1024)).toFixed(2);
    return { used: `${mb} MB` };
  }

  async logout(): Promise<void> {
    if (this.accessToken) {
      try {
        // 1. Revoke the token with Google so it can't be used again
        await fetch(
          `https://oauth2.googleapis.com/revoke?token=${this.accessToken}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          },
        );
      } catch (e) {
        console.warn(
          "Token revocation failed, proceeding with local logout",
          e,
        );
      }
    }
    this.accessToken = null;
  }
}
