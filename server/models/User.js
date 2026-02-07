import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
// bcrypt → used for secure password comparison

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true },
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
}, {timestamps: true })
// whenever a new user is created, we add timeStamp also with it 

UserSchema.methods.comparePassword = function (password){
    return bcrypt.compareSync(password, this.password)
    // this.password is the hashed password stored in MongoDB and this represent the current user  
}
// This adds a custom method to every User document.
// /What it does: Takes a plain text password (from login form)
// Compares it with the hashed password stored in DB
// Returns: true → password matches or false → password is wrong

const User = mongoose.model("User", UserSchema)

export default User;


// this shold the scheme for user,i.e for each user we will store all these things 