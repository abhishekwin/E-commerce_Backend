const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secretKey = process.env.JWT_SECRET_KEY
const adminEmail = process.env.AdminEmail;
exports.create = async (req, res) => {
    try {
       
        const { username, email, password, role } = req.body
        if (!(username && email && role)) {
            res.status(400).send("All input is required");
        }
        const oldUser = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }
        const payload = { username, email, role }
        let verified = null
        if(role == 'Seller'){
            verified = false
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ ...payload,isVerified : verified, password: hashedPassword });
        const jwtToken = jwt.sign({ userId: user.id }, secretKey)
        await User.update(  { token: jwtToken },
            {
              where: {
                id: user.id,
              },
            })
        res.send({ "message": "data save sucessfully", result: user,password:password,token: jwtToken })
    } catch(err) {
        console.log("rrr", err)
        res.status(500).json({ error: 'Error registering user' });
    }
}

exports.login = async (req, res) => {
    try {
        console.log(req.body);
        const {email, password } = req.body
        if ( !email) {
            res.status(400).json({ msg: "Username and Email is required." })
        }
        const user = await User.findOne({ where: { email } })
        if (!user) {
            res.status(401).json({ error: "Unauthorized User" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid Password"})
        }
        res.json({ token: user,password:password});

    } catch (error) {
        res.status(500).json({ error: 'Error logging in user' });
    }
}

exports.get_users = async (req, res) => {
    try {
        const result = await User.findAll()
        res.send({ msg: "data fetched!!", count: result.length, result })
    } catch {
        res.status(500).json({ error: error.message });
    }
}

exports.verifySeller = async(req,res)=>{
    try {
        console.log(req.query.id,"<><><><><><><><><");
        
        const seller = await User.findOne({where:{id:req.query.id}})
        console.log(seller.isVerified,",.,.,");
        if(seller.isVerified==true){
            return res.status(404).json({ message: 'You are already a verified seller' });

        }
        if(adminEmail==req.query.email){
            seller.isVerified=true;
            await seller.save()
            res.send({msg: "Seller verified succesfuly",seller})
        }else{

            return res.status(404).json({ message: 'You are not admin' });
        }


    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }

}