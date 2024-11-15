const IndexedDBService = {

  db: null,
  dbName: '',

  async initialize(dbName) {
    this.dbName = dbName;
    const request = indexedDB.open(this.dbName, this.getLastVersion());

    const dbPromise = new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });

    this.db = await dbPromise;
  },

  getLastVersion() {
    let version = localStorage.getItem('versionIndexedDB');
    console.log({version})
    if(!version) {
      version = 1
      this.setVersion(1);
    }
    return Number(version);
  },

  setVersion(version) {
    localStorage.setItem('versionIndexedDB', version)
  },

  async deleteExistingDatabase() {
    const request = indexedDB.deleteDatabase(this.dbName);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  searchWithoutIndex(tableName, field, value) {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction([tableName], "readonly");
        const store = transaction.objectStore(tableName);
  
        const results = [];
        const request = store.openCursor();
  
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            const record = cursor.value;
            if (record[field] === value) {
              results.push(record);
            }
            cursor.continue();
          } else {
            resolve(results);
          }
        };
  
        request.onerror = (event) => {
          reject(event.target.error);
        };
      } else {
        reject(new Error("Database is not available."));
      }
    });
  },

  async createTable(tableName, keyPath, indexes = []) {
    if (this.db) {

      this.db.close();
      indexedDB.deleteDatabase(this.dbName);

      const lastVersion = this.getLastVersion();
      this.setVersion(lastVersion + 1)
      const request = indexedDB.open(this.dbName, this.getLastVersion());

      const upgradePromise = new Promise((resolve) => {
        request.onupgradeneeded = (event) => {
          const newDB = event.target.result;
          newDB.createObjectStore(tableName, { keyPath });;

          resolve(event);
        };
      });

      const successPromise = new Promise((resolve) => {
        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(event);
        };
      });

      const [upgradeResult, successResult] = await Promise.all([
        upgradePromise,
        successPromise,
      ]);

      return { upgradeResult, successResult };
    }
  },

  addRecord(tableName, record) {
    if (this.db) {
      const transaction = this.db.transaction([tableName], "readwrite");
      const store = transaction.objectStore(tableName, "readwrite");
      store.add(record);
    }
  },

  addManyRecords(tableName, records) {
    if (this.db) {
      const transaction = this.db.transaction([tableName], "readwrite");
      const store = transaction.objectStore(tableName, "readwrite");

      records.forEach((record) => {
        store.add(record);
      });

    }
  },

  updateRecord(tableName, record) {
    if (this.db) {
      const transaction = this.db.transaction([tableName], "readwrite");
      const store = transaction.objectStore(tableName);
      store.put(record);
    }
  },

  deleteRecord(tableName, key) {
    if (this.db) {
      const transaction = this.db.transaction([tableName], "readwrite");
      const store = transaction.objectStore(tableName);
      store.delete(key);
    }
  },

  getAllRecords(tableName) {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction([tableName], "readonly");
        const store = transaction.objectStore(tableName);
        const request = store.getAll();

        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        request.onerror = (event) => {
          reject(event.target.error);
        };
      } else {
        reject(new Error("Database is not available."));
      }
    });
  },

  searchByField(tableName, field, value) {
    return new Promise((resolve, reject) => {
      if (this.db) {
        try {
          const transaction = this.db.transaction([tableName], "readonly");
          const store = transaction.objectStore(tableName);

          const results = [];
          const index = store.index(field + "_index");
          const request = index.get(IDBKeyRange.only(value));

          request.onsuccess = (event) => {
            if (event.target.result) {
              results.push(event.target.result);
            }
          };

          transaction.oncomplete = () => {
            resolve(results);
          };

          transaction.onerror = (event) => {
            reject(event.target.error);
          };
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error("Database is not available."));
      }
    });
  },
};

export default IndexedDBService;
