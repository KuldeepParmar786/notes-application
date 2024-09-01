const express=require('express')
const Person=require('./models/phone')
const app=express()
const morgan=require('morgan')
const cors=require('cors')
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan('data'))
morgan.token('data',(req,res)=>{return req.body})
let persons=[]
const md=(request,response,next)=>{
   console.log('Method:',request.method)
   console.log('Path:',request.path)
   console.log('Body:',request.body)
   next()
}
 app.use(md)
app.get('/phonebook/persons',(request,response)=>{
   Person.find({}).then(persons=>{
      response.json(persons)
   })
})
app.get('/phonebook/persons/info',(request,response)=>{
    let lengt=persons.length;
    const time=new Date().toLocaleString('en-US',{
    weekday: 'long',      
    year: 'numeric',      
    month: 'long',        
    day: 'numeric',       
    hour: 'numeric',      
    minute: 'numeric',    
    second: 'numeric',
    timeZoneName: 'short' 
    })
    const resmessage=`<p>Phonebook has info for ${lengt} people
    <p>${time}</p>`
    response.send(resmessage)
})

app.get('/phonebook/persons/:id',(request,response,next)=>{
   const id=request.params.id
   Person.findById(id)
   .then(result=>{
      if(result){
         response.json(result)
        }
        else{
          response.status(404).end()
        }
   })
   .catch(error=>next(error))
   
})
app.delete('/phonebook/persons/:id',(request,response,next)=>{
    Person.findByIdAndDelete(request.params.id)
    .then(result=>{response.status(204).end()})
    .catch(error=>next(error))
})

app.post('/phonebook/persons/',(request,response)=>{
    const body=request.body
    if(!body.name || !body.number){
       response.status(400).send({error:'Name and number are required'})
    }
   
    const person=new Person({
       name:body.name,
       number:body.number,
    })

    person.save().then(result=>{
      response.json(result)
    })
   //  const per=persons.find(per=>per.name===newPerson.name)
   //  if(per){
   //     return response.status(409).send({error:'name must be unique'})
   //  }
   //  persons=persons.concat(newPerson)
   //  response.json(newPerson)
})
const errorhandler=(request,response,error,next)=>{
    console.log(error.message)
    if(error.name==='CastError'){
      return response.status(400).send({error:'malformatted ID'})
    }
    next(error)
}
app.use(errorhandler)
const PORT=process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server Running at Port ${PORT}`)
})
