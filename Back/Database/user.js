const mongoose = require('mongoose');
const URI = process.env.DATABASE_URI;

mongoose.connect(URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const schema=mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    pass:{type:String,require:true},
    role:{type:String,require:true},
    isAccept:{type:String,require:true,default:false},
    newUser:{type:Boolean,default:true,require:true}
})

module.exports= mongoose.model('user',schema)