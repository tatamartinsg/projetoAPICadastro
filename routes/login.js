const SelectDB = require('../models/selectDB')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Cadastro = require('../models/cadastroBD')

module.exports = app => {
    // const authMiddleware = async (req,res,next) => {
    //     try{
    //         // console.log(req)
    //         const token = req.headers.authorization.split(' ')[1].toString()
    //         const tokenKEY = this.toString(process.env.JWT_KEY)
    //         const payload = await jwt.verify(token, tokenKEY)
    //         // console.log('payload:',payload)

    //         await Cadastro.selecionaUsuariosPorId(payload._idUser)
    //         .then (resultados_select => {
    //             //  res.status(200).json({token:token})
    //             console.log(req)
    //             req.auth = resultados_select
    //             next()
    //         })
    //         .catch(erro_select => {
    //             res.status(400).send('Usuarios não encontrados')
    //         })

    //         // console.log(payload)
           
    //     } catch(error){
    //         res.status(401).send(error)
    //     }
    // }

    async function verifyJWT(req,res,next){
        console.log("entrou verify")
        console.log(req.headers)
        const token = req.headers.authorization.split(' ')[1].toString()
        console.log(token)
        const tokenKEY = 'JWT_KEY-SECRET-KEY-07022002'
        console.log(tokenKEY)

        await jwt.verify(token,tokenKEY,(err,decoded)=>{
            if(err){
                return res.status(401).end()
            }
            else{ 
                Cadastro.selecionaUsuariosPorId(decoded._idUser)
                    .then (resultados_select => {
                        //  res.status(200).json({token:token})
                        req._idUser = decoded._idUser
                        req.auth = resultados_select
                        next()
                    })
            }
        })
            
        }

    app.get('/login', (req,res)=>{
        res.send('Entrou na rota login')
    })

    app.post('/login', (req,res) => {
        console.log("entrou login")
        console.log(req)
        // const a = req.headers
        // console.log(a)
        // console.log(req)
        const body = {
            email: req.body.email,
            password: req.body.password
        }
        // console.log(req)
        console.log(body)
        SelectDB.selecionaEmail(body)
            .then(resultados => {
                if (resultados.length > 0){
                    bcrypt.compare(body.password, resultados[0].password,(error,result)=> {
                        if(error){
                            return res.status(401).send({message: 'Falha na autenticação'})
                        }
                        if(result){
                            const tokenKEY = (process.env.JWT_KEY)
                            console.log(tokenKEY)
                            const token = jwt.sign({
                                    name: resultados[0].name,
                                    email: resultados[0].email,
                                    _idUser: resultados[0].id
                                },tokenKEY,{
                                    expiresIn: "1000000"
                                })
                            return res.status(200).send({message: 'Autenticado com sucesso!',auth:true,token:token})
                        }
    
                        return res.status(401).send({message: 'Falha na autenticação da password', pass:false})
                    
                    })
                }
                else{
                    return res.status(401).send({message: 'Falha na autenticação do email', mail: false})
                }

            })
    })

    app.get('/users', async (req,res) => {
        try{
            await Cadastro.selecionaUsuarios()
                .then(response => {
                    res.send(response)
                })
                .catch(erro => {
                    res.send(erro)
                })
        }
        catch(error){
            res.send(error)
        }
    }) 

    app.get('/me', async(req,res) => {
        console.log(req.auth)
        res.send(req.auth)
    })

    app.get('/clientes', verifyJWT, async(req,res) => {
        console.log(req._idUser)
        console.log(req)
        res.status(200).json({id: req._idUser, message: 'ok'})
    })

    app.get('http://127.0.0.1:5500/clientes.html', (req,res) => {
        console.log("Entrou get")
        res.send("Entrou get")
    })
}