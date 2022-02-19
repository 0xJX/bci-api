const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
{
  username: { type: String, minlength: 2, unique: true },
  name: { type: String, minlength: 4, require: true },
  phonenumber: { type: String, minlength: 4, require: true },
  email: { type: String, require: true },
  passwordHash: {type: String },
  listings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing'
    }
  ],
})

userSchema.set('toJSON', 
{
  transform: (_document, returnedObject) => 
  {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User