const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    apikey : {
        type : String,
        required : true
    },
    gitusername : {
        type : String,
        required : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        required : true
    }
});

module.exports = mongoose.model('gitmaster',noteSchema);
