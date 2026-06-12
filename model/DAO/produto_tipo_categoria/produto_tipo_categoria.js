/******************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela
 *           de relação entre Produto e Tipo Categoria
 * Data: 12/06/2026
 * Autor: Lucas Duarte
 * Versão: 1.0
 ******************************************************************************/

const knex       = require('knex')
const knexConfig = require('../../database_config_knex/knexFile.js')
const knexConex  = knex(knexConfig.development)

//Função para inserir uma nova relação entre produto e tipo categoria
const insertProdutoTipoCategoria = async function(produtoTipoCategoria){
    try {
        let sql = `insert into tbl_produto_tipo_categoria (
                        id_tbl_produto,
                        id_tbl_tipo_categoria,
                        preco
                    )
                    values (
                        '${produtoTipoCategoria.id_produto}',
                        '${produtoTipoCategoria.id_tipo_categoria}',
                        '${produtoTipoCategoria.preco}'
                    );`

        let result = await knexConex.raw(sql)

        if(result)
            return result[0].insertId
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

//Função para retornar todos os dados da tabela de produto_tipo_categoria
const selectAllProdutoTipoCategoria = async function(){
    try {
        let sql = `select * from tbl_produto_tipo_categoria order by id desc`

        let result = await knexConex.raw(sql)

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

//Função para retornar os dados filtrando pelo ID
const selectByIdProdutoTipoCategoria = async function(id){
    try {
        let sql = `select * from tbl_produto_tipo_categoria where id=${id}`

        let result = await knexConex.raw(sql)

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

//Função para retornar os tipos categoria filtrando pelo ID do produto
const selectTipoCategoriaByIdProduto = async function(idProduto){
    try {
        let sql = `select  tbl_tipo_categoria.id,
                           tbl_tipo_categoria.id_tipo,
                           tbl_tipo_categoria.id_categoria,
                           tbl_produto_tipo_categoria.preco
                    from tbl_produto_tipo_categoria
                        inner join tbl_tipo_categoria
                            on tbl_tipo_categoria.id = tbl_produto_tipo_categoria.id_tbl_tipo_categoria
                    where tbl_produto_tipo_categoria.id_tbl_produto = ${idProduto}`

        let result = await knexConex.raw(sql)

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

// Função para retornar os produtos filtrando pelo ID do tipo_categoria
const selectProdutoByIdTipoCategoria = async function(idTipoCategoria) {
    try {
        let sql = `
            SELECT tbl_produto.id,
                   tbl_produto.nome,
                   tbl_produto.descricao,
                   tbl_produto.foto,
                   tbl_produto.preco
            FROM tbl_produto
                INNER JOIN tbl_produto_tipo_categoria
                    ON tbl_produto.id = tbl_produto_tipo_categoria.id_tbl_produto
            WHERE tbl_produto_tipo_categoria.id_tbl_tipo_categoria = ${idTipoCategoria}
        `

        let result = await knexConex.raw(sql)

        if (Array.isArray(result)) {
            return result[0]
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

//Função para excluir uma relação pelo ID
const deleteProdutoTipoCategoria = async function(id){
    try {
        let sql = `delete from tbl_produto_tipo_categoria where id=${id}`

        await knexConex.raw(sql)

        return true

    } catch (error) {
        console.log(error)
        return false
    }
}

//Função para excluir todas as relações filtrando pelo ID do produto
//Utilizada no update do produto para limpar as relações antes de reinserir
const deleteProdutoTiposByIdProduto = async function(idProduto){
    try {
        let sql = `delete from tbl_produto_tipo_categoria where id_tbl_produto=${idProduto}`

        await knexConex.raw(sql)

        return true

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertProdutoTipoCategoria,
    selectAllProdutoTipoCategoria,
    selectByIdProdutoTipoCategoria,
    selectTipoCategoriaByIdProduto,
    selectProdutoByIdTipoCategoria,
    deleteProdutoTipoCategoria,
    deleteProdutoTiposByIdProduto
}