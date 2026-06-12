/******************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e
 *           manipulação de dados para o CRUD de produto_tipo_categoria
 * Data: 12/06/2026
 * Autor: Lucas Duarte
 * Versão: 1.0
 ******************************************************************************/

const config_message         = require('../modulo/configMessages.js')
const produtoTipoCategoriaDAO = require('../../model/DAO/produto_tipo_categoria/produto_tipo_categoria.js')

/*****************************************************************************************
 * Inserir nova relação produto_tipo_categoria
 *****************************************************************************************/
const inserirNovoProdutoTipoCategoria = async function(produtoTipoCategoria){
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        let validar = await validarDados(produtoTipoCategoria)

        if(validar){
            return validar // 400
        }else{
            let result = await produtoTipoCategoriaDAO.insertProdutoTipoCategoria(produtoTipoCategoria)

            if(result){
                produtoTipoCategoria.id = result

                message.DEFAULT_MESSAGE.status      = message.SUCCESS_CREATED_ITEM.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                message.DEFAULT_MESSAGE.message     = message.SUCCESS_CREATED_ITEM.message
                message.DEFAULT_MESSAGE.response    = produtoTipoCategoria

                return message.DEFAULT_MESSAGE // 201
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

/*****************************************************************************************
 * Buscar relação produto_tipo_categoria por ID
 *****************************************************************************************/
const buscarProdutoTipoCategoria = async function(id){
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        if(id == undefined || id == '' || id == null || isNaN(id)){
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST // 400
        }else{
            let result = await produtoTipoCategoriaDAO.selectByIdProdutoTipoCategoria(id)

            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status                          = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code                     = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.produto_tipo_categoria = result

                    return message.DEFAULT_MESSAGE // 200
                }else{
                    return message.ERROR_NOT_FOUND // 404
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

/*****************************************************************************************
 * Buscar tipos categoria filtrando pelo ID do produto
 * Utilizada dentro da controller de produto para montar o objeto completo
 *****************************************************************************************/
const buscarTipoCategoriaIdProduto = async function(idProduto){
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        if(idProduto == undefined || idProduto == '' || idProduto == null || isNaN(idProduto)){
            message.ERROR_BAD_REQUEST.field = '[ID_PRODUTO] INVÁLIDO'
            return message.ERROR_BAD_REQUEST // 400
        }else{
            let result = await produtoTipoCategoriaDAO.selectTipoCategoriaByIdProduto(idProduto)

            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status                          = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code                     = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.produto_tipo_categoria = result

                    return message.DEFAULT_MESSAGE // 200
                }else{
                    return message.ERROR_NOT_FOUND // 404
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

/*****************************************************************************************
 * Listar todas as relações produto_tipo_categoria
 *****************************************************************************************/
const listarProdutoTipoCategoria = async function(){
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        let result = await produtoTipoCategoriaDAO.selectAllProdutoTipoCategoria()

        if(result){
            if(result.length > 0){
                message.DEFAULT_MESSAGE.status                          = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code                     = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count                  = result.length
                message.DEFAULT_MESSAGE.response.produto_tipo_categoria = result

                return message.DEFAULT_MESSAGE // 200
            }else{
                return message.ERROR_NOT_FOUND // 404
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_MODEL // 500
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

/*****************************************************************************************
 * Excluir relação produto_tipo_categoria por ID
 *****************************************************************************************/
const excluirProdutoTipoCategoria = async function(id){
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        let resultBuscarID = await buscarProdutoTipoCategoria(id)

        if(resultBuscarID.status){
            let result = await produtoTipoCategoriaDAO.deleteProdutoTipoCategoria(id)

            if(result){
                message.DEFAULT_MESSAGE.status      = message.SUCCESS_DELETE_ITEM.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_DELETE_ITEM.status_code
                message.DEFAULT_MESSAGE.message     = message.SUCCESS_DELETE_ITEM.message

                return message.DEFAULT_MESSAGE // 200
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        }else{
            return resultBuscarID // 400 ou 404 ou 500
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

/*****************************************************************************************
 * Excluir todas as relações filtrando pelo ID do produto
 * Utilizada no update do produto para limpar as relações antes de reinserir
 *****************************************************************************************/
const excluirProdutoTiposByIdProduto = async function(idProduto){
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        let result = await produtoTipoCategoriaDAO.deleteProdutoTiposByIdProduto(idProduto)

        if(result){
            message.DEFAULT_MESSAGE.status      = message.SUCCESS_DELETE_ITEM.status
            message.DEFAULT_MESSAGE.status_code = message.SUCCESS_DELETE_ITEM.status_code
            message.DEFAULT_MESSAGE.message     = message.SUCCESS_DELETE_ITEM.message

            return message.DEFAULT_MESSAGE // 200
        }else{
            return message.ERROR_INTERNAL_SERVER_MODEL // 500
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

/*****************************************************************************************
 * Validação dos dados de produto_tipo_categoria
 *****************************************************************************************/
const validarDados = async function(produtoTipoCategoria){
    let message = JSON.parse(JSON.stringify(config_message))

    if(
        produtoTipoCategoria.id_produto          == undefined ||
        produtoTipoCategoria.id_produto          == null      ||
        produtoTipoCategoria.id_produto          == ''        ||
        isNaN(produtoTipoCategoria.id_produto)
    ){
        message.ERROR_BAD_REQUEST.field = '[ID_PRODUTO] INVÁLIDO'
        return message.ERROR_BAD_REQUEST // 400

    }else if(
        produtoTipoCategoria.id_tipo_categoria   == undefined ||
        produtoTipoCategoria.id_tipo_categoria   == null      ||
        produtoTipoCategoria.id_tipo_categoria   == ''        ||
        isNaN(produtoTipoCategoria.id_tipo_categoria)
    ){
        message.ERROR_BAD_REQUEST.field = '[ID_TIPO_CATEGORIA] INVÁLIDO'
        return message.ERROR_BAD_REQUEST // 400

    }else if(
        produtoTipoCategoria.preco               == undefined ||
        produtoTipoCategoria.preco               == null      ||
        produtoTipoCategoria.preco               == ''        ||
        isNaN(produtoTipoCategoria.preco)         ||
        parseFloat(produtoTipoCategoria.preco) <= 0
    ){
        message.ERROR_BAD_REQUEST.field = '[PRECO] INVÁLIDO'
        return message.ERROR_BAD_REQUEST // 400

    }else{
        return false
    }
}

/*****************************************************************************************
 * Export das funções
 *****************************************************************************************/
module.exports = {
    inserirNovoProdutoTipoCategoria,
    buscarProdutoTipoCategoria,
    buscarTipoCategoriaIdProduto,
    listarProdutoTipoCategoria,
    excluirProdutoTipoCategoria,
    excluirProdutoTiposByIdProduto
}