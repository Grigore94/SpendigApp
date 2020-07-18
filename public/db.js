let db;
const request = indexedDB.open("budget", 1);

//when back online to post pendings
function checkDatabase(){
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if(getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                mothod: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept:"aplication/json,text/plain, */*",
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
            .then(() => {
            const transaction= db.transaction(["pending"],"readwrite");
            const store = transaction.objectStore("pending");

            store.clear();
        });
        }
    }
}

request.onupgradeneeded = e => {
    const db = e.target.result;
    db.createObjectStore("pending", {autoIncrement: true});
};

request.onsuccess = function(e) {
    db = e.target.result;
    if(navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(e) {
    console.log(e.target.errorCode);
} 

function saveRecord(record) {
const transaction = db.transaction(["pending"],"redwrite");
const store = transaction.objectStore("pending");
store.add(record);
}
function deletePending() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.clear();
  }

//run checkdb func when app back online
window.addEventListener("online",checkDatabase);