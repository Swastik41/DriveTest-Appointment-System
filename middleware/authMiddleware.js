const DriveTest = require('../models/DriveTest')

module.exports = async (req,res,next)=>{
    try{
    const user = await DriveTest.findById(req.session.userId)
        if (!user) {
            return res.redirect('/auth/login')
        }
        next()
    }
    catch(error){
    console.log(error)
}
}
