const jwt = require('jsonwebtoken')

module.exports = async function verifyJWT(req,res,next){
        console.log("entrou verify")
        console.log(req.headers)
        if(req.headers.authorization){
            const token = req.headers.authorization.split(' ')[1].toString()
            console.log(token)
            const tokenKEY = 'JWT_KEY-SECRET-KEY-07022002'
            console.log(tokenKEY)

            await jwt.verify(token,tokenKEY,(err,decoded)=>{
                if(err){
                    console.log('token invalido')
                    return res.status(401).end()
                }
                else{ 
                    console.log(decoded)
                    next()
                }
            })
        }
        else{
            res.status(401).json({auth:false, message: 'No token provided'})
        }
            
}
    