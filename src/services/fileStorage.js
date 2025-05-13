// fileStorage.js
const DB_NAME = 'RoomFilesDB';
const STORE_NAME = 'files';
const DB_VERSION = 1;

export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Database error:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            console.log('Database opened successfully');
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
};

export const saveFiles = async (key, files) => {
    console.log('Saving files with key:', key);
    console.log('Files to save:', files);
    
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            // Validate files object
            if (!files || typeof files !== 'object') {
                reject(new Error('Invalid files object'));
                return;
            }

            // Create a copy of files with only the necessary data
            const filesToStore = {
                images: files.images || [],
                video: files.video || null,
                model3D: files.model3D || null,
                view360: files.view360 || []
            };

            const request = store.put(filesToStore, key);

            request.onerror = () => {
                console.error('Error saving files:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                console.log('Files saved successfully');
                resolve(request.result);
            };

            transaction.oncomplete = () => {
                console.log('Transaction completed');
            };
        });
    } catch (error) {
        console.error('Error in saveFiles:', error);
        throw error;
    }
};

export const getFiles = async (key) => {
    console.log('Getting files for key:', key);
    
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.get(key);

            request.onerror = () => {
                console.error('Error getting files:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                const files = request.result;
                console.log('Retrieved files:', files);
                resolve(files);
            };
        });
    } catch (error) {
        console.error('Error in getFiles:', error);
        throw error;
    }
};

export const deleteFiles = async (key) => {
    console.log('Deleting files for key:', key);
    
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.delete(key);

            request.onerror = () => {
                console.error('Error deleting files:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                console.log('Files deleted successfully');
                resolve(request.result);
            };
        });
    } catch (error) {
        console.error('Error in deleteFiles:', error);
        throw error;
    }
}; 