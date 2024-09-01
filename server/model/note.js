const en=require('dotenv');
en.config();
const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
const url=process.env.MONGODB_URI;
console.log('connecting to',url)
mongoose.connect(url)
.then(result=>{
    console.log('connected successfully')
})
.catch(error=>{
    console.log('error connecting',error.message)
})

const schema=new mongoose.Schema({
    content:{
        type:String,
        minlength:5,
        required:true},
    important:Boolean,
})

schema.set('toJSON',{
    transform:(document,returnedObject)=>{
       returnedObject.id=returnedObject._id.toString()
       delete returnedObject._id
       delete returnedObject.__v
    }

})

module.exports=mongoose.model('Note',schema)


