const mongoose = require('mongoose')

const dbConnect = () => {
try{
const conn = mongoose.connect('mongodb+srv://juleeperween34:juleePER@cluster0.zyxi7u0.mongodb.net/comm')
console.log('Database Connected Successfully');
}catch(error){
    console.log('db error');
}

}
module.exports = dbConnect