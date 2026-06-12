/* 
* objetivo: arquivo responsavel pelo CRUD no banco de dados MySQL na tabela categoria
* Data:       10/06/2026
* Autor :     cosme
* Versao:     1.0  

*/

//import da biblioteca para gerenciar o banco de dados mysql no node.js
const knex          = require('knex')
//importe do arquivo de configuração para conexao com o banco de dados mysql 
const knexConfig    = require('../../database_config_knex/knexFile.js')
//cria a conexao com o banco de dados
const knexConex     = knex(knexConfig.development)

//funcao para inserir dados na tabela de categoria 
async function insertCategoria(categoria){

    try {
        //script pra inserir produto no banco de dados
        let sql = `insert into tbl_categoria(
                            categoria
                        )
                    values(
                            '${categoria.categoria}'
                            ); `
        
        //executa o scriptSQL no banco de dados
        let result = await knexConex.raw(sql)
        //console.log(result[0].insertId)
        if(result){
            return result[0].insertId// retorna o id 
        }else{return false}
    } catch (error) {
        //console.log(error)//erro 500 descomentar essa linha
        return false
    }

}





//função para atualiza uma  categoria existente na tabela
async function updateCategoria(categoria) {


    try {
        //script para atualizar dados no BD
        let sql =`update tbl_categoria set

            categoria        =  '${categoria.categoria}'
           
            where id = ${categoria.id}`

        //executa o script acima de
        let result = await knexConex.raw(sql)
        
        if (result) {
            return true
        }else{return false}
        
    } catch (error) {
        console.log(error)
        return false
    }


    
}

//funcao para retornar todos os dados da tabela de categoria
async function selectAllCategoria() {
    try {
        //script select pra ver todos os categoria
        let sql = `select * from tbl_categoria order by id desc`

        // executa o script no banco
        let result = await knexConex.raw(sql)

        // verifica se o script retornou um array
        if (Array.isArray(result)) {
            return result[0] 
        }else{
            return false
        }

    } catch (error) {
        //console.log(error)
        return false 
        
    }

}


//função para retornar os dados da categoria filtrando pelo id
async function selectByIdCategoria(id) {
    try {
        // faz busca no banco de dados pelo id 
        let sql = `select * from tbl_categoria where id=${id}`

        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }
    
}

//funcao pra excluir uma categoria pelo id
async function deleteCategoria(id) {
    try {
        let sql = `DELETE FROM tbl_categoria 
                            WHERE id = ${id};`

        let result = await knexConex.raw(sql)
        if(result){
            return true 
        }else{return false}

    } catch (error) {
        console.log(error)

        return false
    }
    
} 

module.exports = {
    insertCategoria,
    updateCategoria,
    selectAllCategoria,
    selectByIdCategoria,
    deleteCategoria

}