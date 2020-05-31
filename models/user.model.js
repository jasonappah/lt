const mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    name: String,
    password: String,
    email: {
        type: String,
        required: true,
        unique: true
    }

});

UserSchema.plugin(require('mongoose-unique-validator'))
mongoose.model("users", UserSchema)