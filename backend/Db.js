const mongoose=require('mongoose');
const url="mongodb+srv://ghoshjeet04:YFV8PdjqGXBXjhLY@cluster0.geoc1vi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

module.exports.connect=()=>{
    mongoose.connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log('MongoDb connected successfully !!!');
    })
    .catch((error)=>console.log("Error: ",error))
};
