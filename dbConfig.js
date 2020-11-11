const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017";

module.exports = {
    getUser : async (id) => {
        console.log(id)
        const client = await MongoClient.connect(url, {useUnifiedTopology : true}).catch(err => { console.log(err) });
        if (!client) return;

        try {
            const db = client.db("OIChat");
            let collectionList = await db.listCollections().toArray();
            if (users) {
                console.log("Collection List not exists");
            }

            collectionList.forEach(element => {
                console.log(element.name);
            });

            // Call Database Status
            db.stats((err, status) => {
                if (err) throw err;
            });

            var user = await db.collection("users").findOne({});
            console.log(user);

        } catch (err) {
            console.log(err);
        } finally {
            client.close();
        }
    },
    addUser : async ({data}) => {
        console.log(data);
        const client = await MongoClient.connect(url, {useUnifiedTopology : true}).catch(err => { console.log(err) });
        if (!client) return;
        try {
            const db = client.db("OIChat");
            // Database Collection List 호출
            db.listCollections().toArray().then(docs => {
                console.log("Available Collections : ");
                docs.forEach((doc) => { console.log(doc.name)});
            });

            db.stats((err, status) => {
                if (err) throw err;
                console.log(status);
            });

            db.collection("users").insertOne({})
        } catch (err) {
            console.log(err);
        } finally {
            client.close();
        }
    }
}