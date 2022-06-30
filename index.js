const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express();


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1flcv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     console.log('Endgame DB Connected')
//     client.close();
// });

async function run() {
    try {
        await client.connect();

        const taskCollection = client.db('Endgame').collection('Endgame-Tasks');

        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        })

        app.post('/tasks', async (req, res) => {
            const newTask = req.body;
            console.log(req.body);
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        })



        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            console.log(update)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    data: update.data
                }
            };
            const result = await taskCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })


        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await taskCollection.findOne(query);
            res.send(product);
        })


    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Endgame Server')
})

app.listen(port, () => {
    console.log('Listening to port', port)
})