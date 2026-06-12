/******************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela
 *           de relação entre Tipo e Categoria
 * Data: 11/06/2026
 * Autor: Lucas Duarte
 * Versão: 1.0
 ******************************************************************************/

//Import da bibliioteca para gerenciar o banco de dados Mysql no node.JS
const knex = require('knex')

//Import do arquivo de configuração para conexão com o BD Mysql
const knexConfig = require('../../database_config_knex/knexFile.js')

//Criar a conexão com o BD Mysql
const knexConex = knex(knexConfig.development)

//Função para inserir um novo tipo que se relaciona com uma categoria
const insertTipoCategoria = async function(tipoCategoria){
    try {

        let sql = `insert into tbl_tipo_categoria (
                            id_tipo,
                            id_categoria
                            )
                    values (
                            '${tipoCategoria.id_tipo}',
                            '${tipoCategoria.id_categoria}'
                            );`

        //Executar o ScriptSQL no banco de dados                        
        let result = await knexConex.raw(sql)
    

        if(result)
            return result[0].insertId //Retorno o ID gerado no BD
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

//Função para atualizar uma relacao entre tipo e categoria existente na tabela
const updateTipoCategoria = async function(tipoCategoria){
    try {
        //Script para atualizar os dados no BD
        let sql = `update tbl_tipo_categoria set 
                        id_tipo =  ${tipoCategoria.id_tipo},                    
                        id_categoria = ${tipoCategoria.id_categoria}

                    where id = ${tipoCategoria.id}`

        //Executa o script SQL no BD
        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Função para retornar todos os dados da tabela de tipo_categoria
const selectAllTipoCategoria = async function(){
    try {
        //Script para retornar todos os dados da tabela de tipo_categoria
        let sql = `select * from tbl_tipo_categoria order by id desc`

        //Executa no banco de dados o script SQL para retornar os tipos e categorias
        let result = await knexConex.raw(sql)
        
        //Validação para verificar se o retorno no BD é um Array
        //Se o scriptSQL der erro, o banco não devolve um array
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

//Função para retornar os dados do tipo e categoria filtrando pelo ID
const selectByIdTipoCategoria = async function(id){
    try {
        let sql = `select * from tbl_tipo_categoria where id=${id}`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Função para retornar os dados as categorias filtrando pelo ID do tipo
//A pessoa solicita o tipo e eu devolvo os dados da categoria
const selectCategoriaByIdTipo = async function(idTipo){
    try {
        let sql = `select tbl_categoria.*
                        from tbl_categoria
                            inner join tbl_tipo_categoria 
                                on tbl_categoria.id = tbl_tipo_categoria.id_categoria
                            inner join tbl_tipo
                                on tbl_tipo.id = tbl_tipo_categoria.id_tipo
                    where tbl_tipo.id=${idTipo}`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Função para retornar os dados dos tipos filtrando pelo ID da categoria
//A pessoa solicita o categoria e eu devolvo os dados do tipo
const selectTipoByIdCategoria = async function(idCategoria){
    try {
        let sql = `select tbl_tipo.*
                        from tbl_categoria
                            inner join tbl_tipo_categoria 
                                on tbl_categoria.id = tbl_tipo_categoria.id_categoria
                            inner join tbl_tipo
                                on tbl_tipo.id = tbl_tipo_categoria.id_tipo
                    where tbl_categoria.id=${idCategoria}`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}


//Função para excluir uma relacao entre tipo e categoria filtrando pelo ID
const deleteTipoCategoria = async function(id){
    try {
        let sql = `delete from tbl_tipo_categoria where id=${id}`

        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Função para excluir os Tipos filtrando pelo ID da categoria
//Essa função será utilizada no Update da categoria, pois precisa apagar todos os tipos
//relacionados com a categoria para inserir as novas relações
// model/DAO/tipo_categoria/tipo_categoria.js

const deleteTiposByIdCategoria = async function(idCategoria) {
    try {
        let sql = `delete from tbl_tipo_categoria where id_categoria=${idCategoria}`
        await knexConex.raw(sql)

        return true // se não jogou exception, funcionou

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertTipoCategoria,
    updateTipoCategoria,
    selectAllTipoCategoria,
    selectByIdTipoCategoria,
    selectCategoriaByIdTipo,
    selectTipoByIdCategoria,
    deleteTipoCategoria,
    deleteTiposByIdCategoria
}