import type {
  GenaulData,
  ProviderName,
  VaultSession,
  VaultAccountInfo,
} from "@/types";

export interface VaultProvider {
  name: ProviderName;
  save(data: GenaulData): Promise<void>;
  load(): Promise<GenaulData | null>;

  // unused methods for future expansion
  updateEcho(id: string, front: string, back: string): Promise<void>;
  deleteEcho(id: string): Promise<void>;
  updateHall(id: string, name: string): Promise<void>;
  deleteHall(id: string): Promise<void>;

  // Auth & Account
  login(silent?: boolean): Promise<VaultSession>;
  logout(): Promise<void>;
  getAccountInfo(): Promise<VaultAccountInfo>;
  getStorageMetadata(): Promise<{ used: string }>;
}
