import Dexie from "dexie";

// Ek hi baar DB initialize hoga
const db = new Dexie("ReduxDB");

// Version aur schema define karo
db.version(1).stores({
    state: "id",  // key-value store for redux state
});

export default db;
