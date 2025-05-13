// fileStorage.js
const DB_NAME = 'RoomFilesDB';
const STORE_NAME = 'files';
const DB_VERSION = 1;

export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
};

export const saveFiles = async (orderId, files) => {
    try {
        const db = await initDB();
        await db.put('files', {
            id: orderId,
            images: files.images || [],
            model: files.model ? [files.model] : [], // Store as array to match backend
            web360: files.web360 || [], // Renamed from view360
            video: files.video || null
        });
    } catch (error) {
        console.error('Error saving files:', error);
        throw error;
    }
};

export const getFiles = async (orderId) => {
    try {
        const db = await initDB();
        const files = await db.get('files', orderId);
        return {
            images: files?.images || [],
            model: files?.model || [],
            web360: files?.web360 || [],
            video: files?.video || null
        };
    } catch (error) {
        console.error('Error getting files:', error);
        throw error;
    }
};

export const deleteFiles = async (key) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const request = store.delete(key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}; 