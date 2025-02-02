const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/userModel');
class AuthController {

    static login = async (req, res) => {

        console.log(req.body)
        try {

            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(401).json({ message: "Please Enter Username and Password!" });
            }

            //Find user by email
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid User Email!' });
            }

            // Compare passwords
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid Password!' });
            }

            // Generate JWT token
            const privateKey = process.env.JWT_SECRET_KEY;
            const token = await jwt.sign({ 
                userid: user._id,
                email: user.email 
            }, privateKey, { expiresIn: '1h' });
            return res.status(200).json({ token: token, message: 'Login Success' });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error, please try again later.' });
        }
    }

    static createUser = async (req,res) => {
        
        try {
    
            const salt = await bcrypt.genSalt(10);
            const user =  new User({
                name:req.body.name,
                email:req.body.email,
                password:await bcrypt.hash(req.body.password, salt),
                phonenumber:req.body.phonenumber,
                address:req.body.address,
            });
            
            await user.save().then(() => {
                console.log('User saved');
                return res.json({message: "User created!"})
            })
            .catch(err => {

                if (err.code === 11000) { // MongoDB duplicate key error code
                    return res.status(401).json({message: "User already Exists!"})
                } else {
                    return res.status(401).json({message: err.message})
                }
                
            });
            
        } catch (error) {
    
            return res.json({message: "User not created!"})
            console.log("Error")
            
        }
    
    
    }

}

module.exports = AuthController;
