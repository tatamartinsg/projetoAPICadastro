const query = require('../infrastructure/queries')

class CreateTable{
    init(conexao){
        console.log('Tabelas foram chamadas!')
        this.conexao = conexao
        this.createTableDB()
        this.createTableProducts()
        this.createTablePedidos()
    }
    createTableDB(){
        const sql = 'CREATE TABLE IF NOT EXISTS cadastro_usuario (id int NOT NULL AUTO_INCREMENT, name varchar(255), email varchar(255) NOT NULL, password varchar(255) NOT NULL, PRIMARY KEY(id));'
        return query(sql)
    }
    createTableProducts(){
        const sql = 'CREATE TABLE IF NOT EXISTS produtos (id_produto int NOT NULL AUTO_INCREMENT, nomeProduto varchar(60) NOT NULL, preco FLOAT, PRIMARY KEY(id_produto));'
        return query(sql)
    }
    createTablePedidos(){
        const sql = 'CREATE TABLE IF NOT EXISTS pedidos (id_pedido int NOT NULL AUTO_INCREMENT, quantidade SMALLINT, produtos_id_produto int NOT NULL, PRIMARY KEY (id_pedido), FOREIGN KEY(produtos_id_produto) REFERENCES produtos(id_produto));'
        return query(sql)
    }
}

module.exports = new CreateTable