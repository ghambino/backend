const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
// app.use(express.json());
app.use(cors());
morgan.token('body', (req,res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


const persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-7563368"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "04-670-7563-368"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "070-75636-36888"
    },
    {
        "id": 4,
        "name": "Mary Poppendick",
        "number": "040-7563368"
    }
];

app.get('/api/persons', (request, response) => {
    response.json(persons)
    
})

app.get('/info', (request, response) =>{
    const date = new Date();
    response.send(`Phonebook has info for ${persons.length} people <br><br> ${date}`); 
})

app.get('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id);
    const trappedPerson = persons.find(person => person.id === id);
    console.log(trappedPerson)
    if(trappedPerson !== undefined){
        response.json(trappedPerson);
    } else {
        response.status(404).end();
    } 
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.filter(person => person.id !== id)
    if (person !== undefined){
        response.json(person)
    }else {
        response.status(204).end();
    }
})
const generateId = () => {
    let maxId = persons.length > 0 ? Math.max(...persons.map(person => person.id)) : 0;
    console.log(maxId);
    return maxId + 1;
}

 app.post('/api/persons', (req, res) => {
    
    const body = req.body; 
    console.log(body)
    
    if(body.name === undefined || body.number === undefined){
        res.status(404).json({error: 'content is missing'})
    } else if (persons.find(person => person.name === body.name)){
        res.status(302).json({error: 'name needs to be unique'})
    } else {

        const newContent = {
            id: generateId(),
            name: body.name,
            number: body.number
        }
    
        const currentOutput = persons.concat(newContent);
        res.json(currentOutput);
    }  
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})