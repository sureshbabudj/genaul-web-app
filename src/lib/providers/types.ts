import type { GenaulData, ProviderName } from "@/types";

export interface VaultProvider {
  name: ProviderName;
  save(data: GenaulData): Promise<void>;
  load(): Promise<GenaulData | null>;
  updateEcho(id: string, front: string, back: string): Promise<void>;
  deleteEcho(id: string): Promise<void>;
  updateHall(id: string, name: string): Promise<void>;
  deleteHall(id: string): Promise<void>;
}
