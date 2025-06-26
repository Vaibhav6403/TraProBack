const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
console.log("inside controller")
const register = async (req,res)=>{
    try{
    const {username,password,role='user',firstname,lastname,email} = req.body;

    let userExists = await User.findOne({username});
    if(userExists) return res.status(400).json({message:"User already Exists"});

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashedPassword,firstname,lastname,email });

    res.status(201).json({message:"User created successfully"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"the error occured is",error})
    }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {register,login}