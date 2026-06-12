/*****************************************************************************************
 * Objetivo:    Arquivo responsável pela validação, tratamento e manipulação dos dados para o CRUD de produtos.
 * Data:        10/06/2026
 * Autor:       Cosme Ribeiro
 * Versão:      2.0
 *****************************************************************************************/

// Import do arquivo de padronização de mensagens
const config_message = require("../modulo/configMessages.js")

// Import do DAO de produto
const ProdutoDAO = require("../../model/DAO/produto/produto.js")

// Import da controller de produto_tipo_categoria
const controller_produto_tipo_categoria = require('./controller_produto_tipo_categoria.js')

/*****************************************************************************************
 * Função responsável por inserir um novo produto
 *****************************************************************************************/
async function inserirNovoProduto(produto, contentType) {

    let message = JSON.parse(JSON.stringify(config_message))

    try {

        if (String(contentType).toLocaleLowerCase() == 'application/json') {
            
            let validar = await validarDados(produto)

            if (validar) {
                return validar
            } else {
                let result = await ProdutoDAO.insertProduto(produto)

                if (result) {

                    produto.id = result

                    // Insere as relações de tipo_categoria e preço do produto
                    for (let tipo_categoria of produto.tipo_categoria) {
                        let produtoTipoCategoria = {
                            "id_produto":        produto.id,
                            "id_tipo_categoria": tipo_categoria.id_tipo_categoria,
                            "preco":             tipo_categoria.preco
                        }

                        let resultInsert = await controller_produto_tipo_categoria.inserirNovoProdutoTipoCategoria(produtoTipoCategoria)

                        if (!resultInsert.status) {
                            return message.SUCCESS_CREATED_ITEM_WARNING
                        }
                    }

                    message.DEFAULT_MESSAGE.status      = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message     = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response    = produto

                } else {
                    return message.ERROR_INTERNAL_SERVER_MODEL
                }

                return message.DEFAULT_MESSAGE
            }
        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }
            
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

/*****************************************************************************************
 * Função responsável por listar todos os produtos cadastrados
 *****************************************************************************************/
async function listarProdutos() {

    let message = JSON.parse(JSON.stringify(config_message))

    try {
        let result = await ProdutoDAO.selectAllProduto()

        if (result) {
            if (result.length > 0) {

                // Para cada produto, busca os tipos categoria e preços relacionados
                for (let produto of result) {
                    let resultTipoCategoria = await controller_produto_tipo_categoria.buscarTipoCategoriaIdProduto(produto.id)
                    if (resultTipoCategoria.status) {
                        produto.tipo_categoria = resultTipoCategoria.response.produto_tipo_categoria
                    } else {
                        produto.tipo_categoria = [] 
                    }
                }

                message.DEFAULT_MESSAGE.status              = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code         = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count      = result.length
                message.DEFAULT_MESSAGE.response.produto    = result

                return message.DEFAULT_MESSAGE
            } else {
                return message.ERROR_NOT_FOUND // 404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL // 500
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

/*****************************************************************************************
 * Função responsável por buscar um produto através do ID
 *****************************************************************************************/
async function buscarProduto(id) {

    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
        if (id == undefined || id == "" || id == null || isNaN(id)) {
            message.ERROR_BAD_REQUEST.field = "[ID] invalido"
            return message.ERROR_BAD_REQUEST
        } else {
            let result = await ProdutoDAO.selectByIdProduto(id)

            if (result) {
                if (result.length > 0) {

                    // Para cada produto, busca os tipos categoria e preços relacionados
                    for (let produto of result) {
                        let resultTipoCategoria = await controller_produto_tipo_categoria.buscarTipoCategoriaIdProduto(produto.id)
                        if (resultTipoCategoria.status) {
                            produto.tipo_categoria = resultTipoCategoria.response.produto_tipo_categoria
                        } else {
                            produto.tipo_categoria = [] 
                        }
                    }

                    message.DEFAULT_MESSAGE.status              = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code         = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.produto    = result

                    return message.DEFAULT_MESSAGE
                } else {
                    return message.ERROR_NOT_FOUND // 404
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

/*****************************************************************************************
 * Função responsável por atualizar um produto existente
 *****************************************************************************************/
async function atualizarProduto(produto, id, contentType) {

    let message = JSON.parse(JSON.stringify(config_message))

    try {
        if (String(contentType).toLocaleLowerCase() == 'application/json') {

            let resultBuscarId = await buscarProduto(id)

            if (resultBuscarId.status) {

                let validar = await validarDados(produto)

                if (!validar) {
                    
                    produto.id = id

                    let result = await ProdutoDAO.updateProduto(produto)

                    if (result) {

                        // Apaga todas as relações antigas antes de reinserir
                        let resultDelete = await controller_produto_tipo_categoria.excluirProdutoTiposByIdProduto(produto.id)

                        if (resultDelete.status) {

                            // Reinsere as novas relações de tipo_categoria e preço
                            for (let tipo_categoria of produto.tipo_categoria) {
                                let produtoTipoCategoria = {
                                    "id_produto":        produto.id,
                                    "id_tipo_categoria": tipo_categoria.id_tipo_categoria,
                                    "preco":             tipo_categoria.preco
                                }

                                let resultInsert = await controller_produto_tipo_categoria.inserirNovoProdutoTipoCategoria(produtoTipoCategoria)

                                if (!resultInsert.status) {
                                    return message.SUCCESS_CREATED_ITEM_WARNING
                                }
                            }
                        } else {
                            return message.ERROR_INTERNAL_SERVER_MODEL
                        }

                        message.DEFAULT_MESSAGE.status      = message.SUCCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message     = message.SUCCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response    = produto

                        return message.DEFAULT_MESSAGE

                    } else {
                        return message.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return validar
                }
            } else {
                return resultBuscarId // 400 ou 404 ou 500
            }
        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

/*****************************************************************************************
 * Função responsável por excluir um produto
 *****************************************************************************************/
async function apagarProduto(id) {

    let message = JSON.parse(JSON.stringify(config_message))

    try {

        let resultBuscarId = await buscarProduto(id)

        if (resultBuscarId.status) {

            // Apaga primeiro as relações de tipo_categoria para não violar FK
            let resultDelete = await controller_produto_tipo_categoria.excluirProdutoTiposByIdProduto(id)

            if (resultDelete.status) {

                let result = await ProdutoDAO.deleteProduto(id)

                if (result) {
                    message.DEFAULT_MESSAGE.status      = message.SUCCESS_DELETE_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_DELETE_ITEM.status_code
                    message.DEFAULT_MESSAGE.message     = message.SUCCESS_DELETE_ITEM.message

                    return message.DEFAULT_MESSAGE
                } else {
                    return message.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return resultBuscarId
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

/*****************************************************************************************
 * Função responsável por validar os dados do produto
 *****************************************************************************************/
async function validarDados(produto) {

    let message = JSON.parse(JSON.stringify(config_message))

    if (
        produto.nome        == undefined ||
        produto.nome        == ""        ||
        produto.nome        == null      ||
        produto.nome.length >  50
    ) {
        message.ERROR_BAD_REQUEST.field = "[NOME] invalido"
        return message.ERROR_BAD_REQUEST

    } else if (
        produto.descricao == undefined ||
        produto.descricao == ""        ||
        produto.descricao == null
    ) {
        message.ERROR_BAD_REQUEST.field = "[DESCRICAO] invalida"
        return message.ERROR_BAD_REQUEST

    } else if (
        produto.foto        == undefined ||
        produto.foto        == ""        ||
        produto.foto        == null      ||
        produto.foto.length > 254
    ) {
        message.ERROR_BAD_REQUEST.field = "[FOTO] invalida"
        return message.ERROR_BAD_REQUEST

    } else if (
        produto.status == undefined ||
        produto.status == null
    ) {
        message.ERROR_BAD_REQUEST.field = "[STATUS] invalido"
        return message.ERROR_BAD_REQUEST

    } else if (
        !produto.tipo_categoria          ||
        !Array.isArray(produto.tipo_categoria) ||
        produto.tipo_categoria.length == 0
    ) {
        message.ERROR_BAD_REQUEST.field = "[TIPO_CATEGORIA] invalido"
        return message.ERROR_BAD_REQUEST

    } else {
        return false
    }
}

/*****************************************************************************************
 * Exportação das funções da controller
 *****************************************************************************************/
module.exports = {
    inserirNovoProduto,
    listarProdutos,
    buscarProduto,
    atualizarProduto,
    apagarProduto
}