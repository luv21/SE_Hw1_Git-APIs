const express = require('express')
const app = express()
const port = 3000

// express configuration
app.use(express.json({ type: '*/*' }));

// Set your routes
app.get('/', (req, res) => res.send('Hello World!'))
app.post('/', function (req, res) {

    res.send(`Received object. ${JSON.stringify(req.body)}`);

});

let store = {}
app.get('/:id', (req, res) => { 
    let response
    let id = req.params.id
    if(store[id]!==undefined){
        response = store[id]
        delete store[id]
    }
    else
        response = {"success":false,"error":404,"message":"Not Found"} 
    res.send(JSON.stringify(response)) 
})
app.post('/share', function (req, res) {
    let id = Math.random()
    let response = {"success":true,"link":"http://localhost:3000/"+id}
    store[id] = req.body
    res.send(`Received object. ${JSON.stringify(response)}`);

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))