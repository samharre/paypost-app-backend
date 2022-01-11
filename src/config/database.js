const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((res) => {
  console.log("MongoDB Connected...")
  // console.log('res: ', res);
}).catch(err => console.log(err))

mongoose.Promise = global.Promise;

module.exports = mongoose;