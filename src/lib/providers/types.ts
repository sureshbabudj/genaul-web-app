import type { GenaulData, ProviderName } from "@/types";

export interface VaultProvider {
  name: ProviderName;
  save(data: GenaulData): Promise<void>;
  load(): Promise<GenaulData | null>;
}
