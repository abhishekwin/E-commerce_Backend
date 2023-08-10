const User = require("../src/models/user.model")
const bcrypt = require("bcrypt")

const config = process.env
const jwt = require("jsonwebtoken")
const { use } = require("../src/routers/user.routers")
const secretKey = process.env.JWT_SECRET_KEY

exports.initializeAdmin = async () => {
    try {
        const admin = await User.findOne({ where: { email: config.AdminEmail } })
        if (!admin) {
            const payload = { username: config.AdminName, email: config.AdminEmail, roll: config.AdminRoll}
            const hashedPassword = await bcrypt.hash(`${config.AdminPassword}`, 10)
            const user = await User.create({ ...payload, password: hashedPassword });
            const token = jwt.sign({ userId: user.id,role:user.role }, secretKey)
            await User.update(  { token: token },
                {
                  where: {
                    id: user.id,
                  },
                })
            console.log('Admin user created successfully.');
        }
    } catch (error) {
        console.error('Error initializing admin user:', error);
    }
}