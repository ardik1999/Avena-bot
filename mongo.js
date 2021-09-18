const mongoose = require("mongoose");
const mongoPath  = "mongodb+srv://ardik712:ardik712@cluster0.sn2jy.mongodb.net/<dbname>?retryWrites=true&w=majority"

module.exports = async () => {
    await mongoose.connect(mongoPath, {

    });
    return mongoose;
}
