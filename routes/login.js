const SelectDB = require('../models/selectDB')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Cadastro = require('../models/cadastroBD')
const verifyJWT = require('../middleware/login')

module.exports = app => {

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
    
                        return res.status(401).send({message: 'Falha na autenticação da password', message:'pass'})
                    
                    })
                }
                else{
                    return res.status(401).send({message: 'Falha na autenticação do email', message: "invalid email"})
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
        console.log('entrou')
        console.log(req._idUser)
        console.log(req)
        res.status(200).json({id: req._idUser, message: 'ok'})
    })

    app.post('/logout', (req,res) => {
        res.json({auth:false, token: null})
    })

}