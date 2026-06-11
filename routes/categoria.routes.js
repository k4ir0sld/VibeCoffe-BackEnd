// importe do express
const controlerCategoria = require("../controller/categoria/controler_categoria.js")

const express = require("express")

//cria objeto de rota para o arquivo
const router = express.Router()


//  Importa o body-parser 
const bodyParser = require("body-parser")
//  Cria a função que processa o JSON 
const boddyParserJSON = bodyParser.json()


//////////////////////////////////////////////////////////////////////////
// CATEGORIA
//////////////////////////////////////////////////////////////////////////

// Inserir categoria
router.post("/", boddyParserJSON, async function(request,response){

    let dados = request.body
    let conteType = request.headers['content-type']

    let result = await controlerCategoria.inserirNovaCategoria(dados, conteType)

    response.status(result.status_code)
    response.json(result)

})

// Buscar categoria
router.get("/:id", async function(request,response){

    let id = request.params.id

    let result = await controlerCategoria.buscarCategoria(id)

    response.status(result.status_code)
    response.json(result)

})

// Listar categorias
router.get("/", async function(request,response){

    let result = await controlerCategoria.listarCategoria()

    response.status(result.status_code)
    response.json(result)

})

// Atualizar categoria
router.put("/:id", boddyParserJSON, async function(request,response){

    let contentType = request.headers['content-type']
    let id = request.params.id
    let dados = request.body

    let result = await controlerCategoria.atualizarCategoria(
        dados,
        id,
        contentType
    )

    response.status(result.status_code)
    response.json(result)

})

// Deletar categoria
router.delete("/:id", async function(request,response){

    let id = request.params.id

    let result = await controlerCategoria.apagarCategoria(id)

    response.status(result.status_code)
    response.json(result)

})

//exporte pro app ter acessoas rota do genero
module.exports = router