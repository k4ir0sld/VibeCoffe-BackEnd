/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e 
 *      manipulação de dados para a tabela de tipo_categoria
 * Data: 22/05/2026
 * Autor: Lucas Duarte
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//Import do arquivo DAO para fazer o CRUD do tipo_categoria no banco de dados
const tipoCategoriaDAO = require('../../model/DAO/tipo_categoria/tipo_categoria.js')

//Função para inserir um novo tipo de categoria
const inserirNovoTipoCategoria = async function (tipoCategoria) {

    let message = JSON.parse(JSON.stringify(config_message))

    try{
        let validar = await validarDadosTipoCategoria(tipoCategoria)

         if (validar) {
             return validar //400

        }else{
            let result = await tipoCategoriaDAO.insertTipoCategoria(tipoCategoria)

            if (result) {
                tipoCategoria.id = result //result[0].insertId - Desta vez nao entrando dentro do Array pois ja foi feito isso no DAO

                message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                message.DEFAULT_MESSAGE.response = tipoCategoria
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
            }
            return message.DEFAULT_MESSAGE
            }   

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Função para atualizar um tipo de categoria
const atualizarTipoCategoria = async function(tipoCategoria, id) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        let resultBuscarID = await buscarTipoCategoria(id)
        if(resultBuscarID.status){
            let validar = await validarDadosTipoCategoria(tipoCategoria)
            
            if(!validar){
                generoFilme.id = id

                let result = await generoFilmeDAO.updateGeneroFilme(generoFilme)
                    
                if(result){
                    message.DEFAULT_MESSAGE.status      = message.SUCCESS_UPDATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message     = message.SUCCESS_UPDATED_ITEM.message
                    message.DEFAULT_MESSAGE.message     = generoFilme

                    return message.DEFAULT_MESSAGE //200 (Atualizado)

                }else{
                    return message.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return validar //400
            }
        }else{
            return resultBuscarID //400 ou 404 ou 500 - Pq esta função já tem a validação 
        }                           // e a resposta com as respectivas menssagens
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500 (Controller)
    }
}

//Função para retornar TODOS os generos
const listarGeneroFilme = async function(){
    let message = JSON.parse(JSON.stringify(config_message))
    
        try {
            let result = await generoFilmeDAO.selectAllGeneroFilme()    
    
            //Valida se o DAO conseguiu processar os dados
            if(result){
                //Validação para verificar se existe conteúdo no array
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.count = result.length
                    message.DEFAULT_MESSAGE.response.genero_filme = result
    
                    return message.DEFAULT_MESSAGE //200 (Dados do Filme)
                }else{
                    return message.ERROR_NOT_FOUND
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
            }
    
        } catch (error) {
            return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
        }
}

//Função para buscar um tipo categoria pelo ID
const buscarTipoCategoria = async function(id){
let message = JSON.parse(JSON.stringify(config_message))

    try {
        if(id == undefined || id == '' || id == null || isNaN(id)){
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST //400
        }else{
            let result = await tipoCategoriaDAO.selectByIdTipoCategoria(id)

            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.tipo_categoria = result

                    return message.DEFAULT_MESSAGE //200
                }else{
                    return message.ERROR_NOT_FOUND //404
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para buscar uma categoria pelo ID do tipo
const buscarCategoriaIdTipo = async function(idTipo){
    let message = JSON.parse(JSON.stringify(config_message))
    
        try {
            if(idTipo == undefined || idTipo == '' || idTipo == null || isNaN(idTipo)){
                message.ERROR_BAD_REQUEST.field = '[ID_TIPO] INVÁLIDO'
                return message.ERROR_BAD_REQUEST //400
            }else{
                let result = await tipoCategoriaDAO.selectCategoriaByIdTipo(idTipo)
    
                if(result){
                    if(result.length > 0){
                        message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                        message.DEFAULT_MESSAGE.response.tipo_categoria = result
    
                        return message.DEFAULT_MESSAGE //200
                    }else{
                        return message.ERROR_NOT_FOUND //404
                    }
                }else{
                    return message.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
                }
            }
        } catch (error) {
            return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
        }
}

//Função para buscar um tipo pelo ID da categoria
const buscarTipoIdCategoria = async function(idCategoria){
    let message = JSON.parse(JSON.stringify(config_message))
    
        try {
            if(idCategoria == undefined || idCategoria == '' || idCategoria == null || isNaN(idCategoria)){
                message.ERROR_BAD_REQUEST.field = '[ID_CATEGORIA] INVÁLIDO'
                return message.ERROR_BAD_REQUEST //400
            }else{
                let result = await tipoCategoriaDAO.selectTipoByIdCategoria(idCategoria)
    
                if(result){
                    if(result.length > 0){
                        message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                        message.DEFAULT_MESSAGE.response.tipo_categoria = result
    
                        return message.DEFAULT_MESSAGE //200
                    }else{
                        return message.ERROR_NOT_FOUND //404
                    }
                }else{
                    return message.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
                }
            }
        } catch (error) {
            return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
        }
}

//Função para excluir um tipo categoria pelo ID
const excluirTipoCategoria = async function(id){
    let message = JSON.parse(JSON.stringify(config_message))
    try {

        let resultBuscarID = await buscarTipoCategoria(id)

        if(resultBuscarID.status){
            let result = await tipoCategoriaDAO.deleteTipoCategoria(id)

            if(result){
                message.DEFAULT_MESSAGE.status = message.SUCCESS_DELETED_ITEM.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_DELETED_ITEM.status_code
                message.DEFAULT_MESSAGE.message = message.SUCCESS_DELETED_ITEM.message
            
                return message.DEFAULT_MESSAGE //200
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
            }
        }else{
            return resultBuscarID //400 ou 404
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (Controller)
    }
}

//Função para excluir os tipos relacionados com o categoria
const excluirTipoIdCategoria = async function(idCategoria){
    let message = JSON.parse(JSON.stringify(config_message))
    try{
        let result = await tipoCategoriaDAO.deleteTiposByIdCategoria(idCategoria)

        // true = deletou ou não tinha nada pra deletar, ambos são sucesso
        if(result){
            message.DEFAULT_MESSAGE.status      = message.SUCCESS_DELETE_ITEM.status
            message.DEFAULT_MESSAGE.status_code = message.SUCCESS_DELETE_ITEM.status_code
            message.DEFAULT_MESSAGE.message     = message.SUCCESS_DELETE_ITEM.message
            
            return message.DEFAULT_MESSAGE
        }else{
            return message.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


//Função para validar todos os dados do tipo e categoria
// (Obrigatórios, qtde de caracteres, etc)
const validarDadosTipoCategoria = async function(tipoCategoria){
    let message = JSON.parse(JSON.stringify(config_message))
    
    //Validação de dados para os atrinutos do tipo (Status 400)
     if(tipoCategoria.id_tipo == undefined || tipoCategoria.id_tipo == '' || tipoCategoria.id_tipo == null || isNaN(tipoCategoria.id_tipo)){
        message.ERROR_BAD_REQUEST.field = '[ID_TIPO] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
    }else if(tipoCategoria.id_categoria == undefined || tipoCategoria.id_categoria == '' || tipoCategoria.id_categoria == null || isNaN(tipoCategoria.id_categoria)){
        message.ERROR_BAD_REQUEST.field = '[ID_CATEGORIA] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
    }else{
        return false
    }
}

module.exports = {
    inserirNovoTipoCategoria,
    atualizarTipoCategoria,
    listarGeneroFilme,
    buscarTipoCategoria,
    buscarCategoriaIdTipo,
    buscarTipoIdCategoria,
    excluirTipoCategoria,
    excluirTipoIdCategoria
}