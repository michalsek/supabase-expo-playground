import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { createMMKV, type MMKV } from "react-native-mmkv";

const AUTH_STORAGE_ID = "supabase.auth";
const ENCRYPTION_KEY_NAME = "supabase.auth.encryption-key";

let nativeStoragePromise: Promise<MMKV> | null = null;
let webStorage: MMKV | null = null;

function getWebStorage() {
  webStorage ??= createMMKV({ id: AUTH_STORAGE_ID });

  return webStorage;
}

async function getNativeStorage() {
  if (nativeStoragePromise) {
    return nativeStoragePromise;
  }

  nativeStoragePromise = (async () => {
    let encryptionKey = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);

    if (!encryptionKey) {
      encryptionKey = `${Crypto.randomUUID()}${Crypto.randomUUID()}`;

      await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, encryptionKey, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    }

    return createMMKV({
      encryptionKey,
      id: AUTH_STORAGE_ID,
    });
  })();

  return nativeStoragePromise;
}

async function getStorage() {
  if (Platform.OS === "web") {
    return getWebStorage();
  }

  return getNativeStorage();
}

export const supabaseStorage = {
  isServer: false,
  async getItem(key: string) {
    const storage = await getStorage();

    return storage.getString(key) ?? null;
  },
  async removeItem(key: string) {
    const storage = await getStorage();

    storage.remove(key);
  },
  async setItem(key: string, value: string) {
    const storage = await getStorage();

    storage.set(key, value);
  },
};
