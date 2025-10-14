import {
  IExecDataProtector,
  IExecDataProtectorCore,
} from '@iexec/dataprotector';
import { Eip1193Provider } from 'iexec';

let iExecDataProtectorCore: IExecDataProtectorCore | null = null;

export function cleanDataProtectorClient() {
  iExecDataProtectorCore = null;
}

export async function initDataProtectorClient({ provider }: { provider?: unknown }) {
  if (!provider) {
    cleanDataProtectorClient();
    return;
  }

  const dataProtectorParent = new IExecDataProtector(provider as Eip1193Provider);
  iExecDataProtectorCore = dataProtectorParent.core;
}

export async function getDataProtectorCoreClient(): Promise<IExecDataProtectorCore> {
  if (!iExecDataProtectorCore) {
    throw new Error('iExec SDK not initialized. Please connect your wallet first.');
  }
  return iExecDataProtectorCore;
}