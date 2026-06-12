/*****************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e manipulação dos dados para o CRUD de categorias.
 * Data: 10/06/2025
 * Autor: Cosme Ribeiro
 * Versão: 1.1
 *****************************************************************************************/

// Import da configuração de mensagens
const configMessage = require("../modulo/configMessages.js")

// Import do DAO  responsavel por fazer o o crud no banco de dados
const CategoriaDAO = require("../../model/DAO/categoria/categoria.js")

//Import de arquivos de Controller
const controller_tipo_categoria = require('./controller_tipo_categoria.js')

/*****************************************************************************************
 * Inserir nova categoria
 *****************************************************************************************/
async function inserirNovaCategoria(categoria, contentType) {

    // Cria uma cópia do objeto de mensagens para evitar alterações no original
    let message = JSON.parse(JSON.stringify(configMessage))
    
    try {
    
        if (String(contentType).toLocaleLowerCase() == 'application/json') {
            
            let validar = await validarDados(categoria)
    
            //se validar retornanr algo significa que é json de ero e ja sera retornado 
            if(validar){
                return validar
            }else{
                // Encaminha os dados da categoria para o DAO
                let result = await CategoriaDAO.insertCategoria(categoria)
    
                if (result) {
                    categoria.id = result// coloca o id ao cargo apos ele ser inserido no banco 

                    for(let tipo of categoria.tipo){

                        let categoriaTipo = {   "id_categoria": categoria.id,
                                                "id_tipo": tipo.id
                                            }

                        let resultInsertTipo = await controller_tipo_categoria.inserirNovoTipoCategoria(categoriaTipo)    
                        
                        if(!resultInsertTipo.status){
                            return message.SUCCESS_CREATED_ITEM_WARNING
                        }
                    }
                    message.DEFAULT_MESSAGE.status      = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message     = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response    = categoria
                            
                }else{
                    return message.ERROR_INTERNAL_SERVER_MODEL//erro 500
                        
                }
                 return message.DEFAULT_MESSAGE
            }
        }else{return message.ERROR_CONTENT_TYPE}//415
                
    } catch (error) {
        console.error(error)

        return message.ERROR_INTERNAL_SERVER_CONTROLLER//500
    }
        
}

/*****************************************************************************************
 * Buscar categoria por ID
 *****************************************************************************************/
async function buscarCategoria(id) {
        // 200 achou
        // 404 nao achou
        // 500 erro na model
        let message = JSON.parse(JSON.stringify(configMessage))
    
        try {
            // Validação para garantir que o ID seja válido
            if (id == undefined || id == "" || id == null ||  isNaN(id) ) {
                message.ERROR_BAD_REQUEST.field = "[ID] invalido"
                return message.ERROR_BAD_REQUEST // 400
            }else{
                
                let result = await CategoriaDAO.selectByIdCategoria(id)

                if (result) {
                    if (result.length>0) {
                        for(let categoria of result){
        
                            let resultTipo = await controller_tipo_categoria.buscarTipoIdCategoria(categoria.id)
                            if (resultTipo.status) {
                                categoria.tipo = resultTipo.response.tipo_categoria
                            } else {
                                categoria.tipo = []
                            }
                        }
                        message.DEFAULT_MESSAGE.status                  = message.SUCCESS_RESPONSE.status
                        message.DEFAULT_MESSAGE.status_code             = message.SUCCESS_RESPONSE.status_code
                        message.DEFAULT_MESSAGE.response.categoria      = result
                        
                        return message.DEFAULT_MESSAGE               //200 sucesso
                    }else{
                        return message.ERROR_NOT_FOUND              //404
                    }
                }else{
                    return message.ERROR_INTERNAL_SERVER_MODEL      //erro 500 model
                }
            }
    
        } catch (error) {
            console.error(error)

            return message.ERROR_INTERNAL_SERVER_CONTROLLER//500
        }
        
}

/*****************************************************************************************
 * Listar todas as categorias
 *****************************************************************************************/
async function listarCategoria() {
    
    let message = JSON.parse(JSON.stringify(configMessage))
        
    try {
            
        let result = await CategoriaDAO.selectAllCategoria()

    
        //valida se  DAO conseguiu processar os dados
        if (result) {
            // valida se a array de retorno do DAO tem algo dentro
            if (result.length>0) {

                for(let categoria of result){
                    let resultTipo = await controller_tipo_categoria.buscarTipoIdCategoria(categoria.id)
                    if (resultTipo.status) {
                        categoria.tipo = resultTipo.response.tipo_categoria
                    } else {
                        categoria.tipo = [] 
                    }
                }
                    
                message.DEFAULT_MESSAGE.status              = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code         = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count      = result.length
                message.DEFAULT_MESSAGE.response.categoria  = result
                    
                // retorna tudo
                return message.DEFAULT_MESSAGE // 200 dados da categoria
            }else{
                return message.ERROR_NOT_FOUND//404
            }
                
        }else{
            return message.ERROR_INTERNAL_SERVER_MODEL// 500 model
        }
    
    } catch (error) {
        console.error(error)

        return message.ERROR_INTERNAL_SERVER_CONTROLLER//erro 500 controller
    }
}

/*****************************************************************************************
 * Atualizar categoria
 *****************************************************************************************/
async function atualizarCategoria(categoria, id, contentType) {
    const message = JSON.parse(JSON.stringify(configMessage))

    try {
        if (String(contentType).toLocaleLowerCase() == 'application/json') {

            let resultBuscarId = await buscarCategoria(id)

            if (resultBuscarId.status) {
                let validar = await validarDados(categoria)

                if (!validar) {
                    categoria.id = id

                    let result = await CategoriaDAO.updateCategoria(categoria)

                    if (result) {
                        let resultDeleteTipo = await controller_tipo_categoria.excluirTipoIdCategoria(categoria.id)

                        if (resultDeleteTipo.status) {
                            for (let tipo of categoria.tipo) {
                                let categoriaTipo = {
                                    "id_categoria": categoria.id,
                                    "id_tipo": tipo.id
                                }
                                let resultInsertTipo = await controller_tipo_categoria.inserirNovoTipoCategoria(categoriaTipo)

                                if (!resultInsertTipo.status) {
                                    return message.SUCCESS_CREATED_ITEM_WARNING
                                }
                            }
                        } else {
                            return message.ERROR_INTERNAL_SERVER_MODEL
                        }

                        message.DEFAULT_MESSAGE.status      = message.SUCCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message     = message.SUCCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response    = categoria

                        return message.DEFAULT_MESSAGE // 200

                    } else {
                        return message.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return validar
                }
            } else {
                return resultBuscarId
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}
        
/*****************************************************************************************
 * Excluir categoria
 *****************************************************************************************/
async function apagarCategoria(id) {

    const message = JSON.parse(JSON.stringify(configMessage))

    try {

        // Verifica se a categoria existe antes de remover
        const resultBuscarId = await buscarCategoria(id)

        if (resultBuscarId.status) {
             // Solicita ao DAO a exclusão da categoria
            const result = await CategoriaDAO.deleteCategoria(id)

            if (result) {
                message.DEFAULT_MESSAGE.status      = message.SUCCESS_DELETE_ITEM.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_DELETE_ITEM.status_code
                message.DEFAULT_MESSAGE.message     = message.SUCCESS_DELETE_ITEM.message

                return message.DEFAULT_MESSAGE
                
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
            
        }else{
            return resultBuscarId
        }

    } catch (error) {
        console.error(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

/*****************************************************************************************
 * Validação dos dados da categoria
 *****************************************************************************************/
async function validarDados(categoria) {

    const message = JSON.parse(JSON.stringify(configMessage))

    if (
        //!categoria ||
        categoria.categoria         == undefined ||
        categoria.categoria         == null      ||
        categoria.categoria.trim()  == ""        || // trim() remove espaços em branco do início e do final da string
        categoria.categoria.length  > 100
    ) {
        message.ERROR_BAD_REQUEST.field = "[categoria] inválida"
        return message.ERROR_BAD_REQUEST
    }else{return false }
}
   
/*****************************************************************************************
 * Export das funções
 *****************************************************************************************/
module.exports = {
    inserirNovaCategoria,
    buscarCategoria,
    listarCategoria,
    atualizarCategoria,
    apagarCategoria
}