var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BearSchema = new Schema({ name: String });

// create table Bears (複數型參數)
module.exports = mongoose.model('Bear', BearSchema);
