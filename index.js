const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.TE_USER}:${process.env.TE_USER_PASS}@cluster0.9b1wrmq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const serviceCollection = client.db('tourExpert').collection('services');

        app.get('/services',async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })

        app.get('/service',async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        })

        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
    }
    finally{

    }
}
run().catch(err=>console.error(err));


app.get('/',(req, res)=>{
    res.send('Welcome to Tour Expert Server');
});


app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
});