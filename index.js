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
        const reviewCollection = client.db('tourExpert').collection('review');
        const blogCollection = client.db('tourExpert').collection('blogs');

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

        // Add services api
        app.post('/service',async(req,res)=>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })
        
        app.get('/service/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // review api
        app.get('/review',async(req,res)=>{
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            if(req.query.service){
                query = {
                    service: req.query.service
                }
            }

            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.post('/review', async(req, res) =>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.patch('/review/:id', async(req, res) =>{
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id)}
            const updateDoc = {
                $set:{
                    status:  status
                }
            }
            const result = await reviewCollection.updateOne(query, updateDoc);
            res.send(result);
        })

        // Review Update api
        app.get('/review/:id',async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const review = await reviewCollection.findOne(query);
            res.send(review);
        })

        // Replace Update value
        app.put('/review/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id)};
            const user = req.body;
            const option ={upsert: true};
            const updatedUser = {
                $set: {
                    username : user.name,
                    email : user.email,
                    message : user.message
                }
            }
            console.log(updatedUser);
            const result = await reviewCollection.updateOne(filter, updatedUser, option);
            res.send(result);
        })

        app.delete('/review/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        // blog api
        app.get('/blogs',async(req,res)=>{
            const query = {};
            const cursor = blogCollection.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs);
        })

        app.get('/blogs/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const blogs = await blogCollection.findOne(query);
            res.send(blogs);
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