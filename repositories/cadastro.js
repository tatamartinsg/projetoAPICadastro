const query = require('../infrastructure/queries')

class Cadastro{
    selecionaUsuarios(){
        const sql = 'SELECT * FROM cadastro_usuario;'
        return query(sql)
    }
    selecionaUsuariosPorId(id_usuario){
        const sql = `SELECT * FROM cadastro_usuario WHERE id = '${id_usuario}';`
        return query(sql,id_usuario)

    }
    addCadastro(body){
        const sql = `INSERT INTO cadastro_usuario SET ?;`
        return query(sql,body)
    }
}

module.exports = new Cadastro