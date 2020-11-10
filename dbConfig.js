const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017";

module.exports = {
    getUser : async (id) => {
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
            })
        } catch (err) {

        }
    }
}