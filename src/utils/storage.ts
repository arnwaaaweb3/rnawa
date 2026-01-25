// src/utils/storage.ts
const DB_NAME = 'NawaCodeCache';
const STORE_NAME = 'files';

// Cache koneksi biar nggak buka-tutup terus
let dbInstance: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // Kalau sudah ada koneksi, pakai yang lama saja
    if (dbInstance) return resolve(dbInstance);

    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onerror = () => reject(request.error);
  });
};

export const saveToLocal = async (path: string, content: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    // Langsung panggil aja, nggak usah dimasukin variabel kalau nggak butuh detail request-nya
    store.put(content, path); 
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getFromLocal = async (path: string): Promise<string | null> => {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(path);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
  });
};