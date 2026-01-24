// src/utils/storage.ts
const DB_NAME = 'NawaCodeCache';
const STORE_NAME = 'files';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveToLocal = async (path: string, content: string) => {
  const db: any = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(content, path);
  return tx.complete;
};

export const getFromLocal = async (path: string): Promise<string | null> => {
  const db: any = await initDB();
  return new Promise((resolve) => {
    const request = db.transaction(STORE_NAME).objectStore(STORE_NAME).get(path);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
};