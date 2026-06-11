// importe do express
const controlerProduto = require("../controller/produto/controler_produto.js")

const express = require("express")

//cria objeto de rota para o arquivo
const router = express.Router()


//  Importa o body-parser 
const bodyParser = require("body-parser")
//  Cria a função que processa o JSON 
const boddyParserJSON = bodyParser.json()


//////////////////////////////////////////////////////////////////////////
// PRODUTO
//////////////////////////////////////////////////////////////////////////

// Inserir produto
router.post("/", boddyParserJSON, async function(request,response){

    let dados = request.body
    let conteType = request.headers['content-type']

    let result = await controlerProduto.inserirNovoProduto(dados, conteType)

    response.status(result.status_code)
    response.json(result)

})

// Buscar produto
router.get("/:id", async function(request,response){

    let id = request.params.id

    let result = await controlerProduto.buscarProduto(id)

    response.status(result.status_code)
    response.json(result)

})

// Listar produtos
router.get("/", async function(request,response){

    let result = await controlerProduto.listarProdutos()

    response.status(result.status_code)
    response.json(result)

})

// Atualizar produto
router.put("/:id", boddyParserJSON, async function(request,response){

    let contentType = request.headers['content-type']
    let id = request.params.id
    let dados = request.body

    let result = await controlerProduto.atualizarProduto(
        dados,
        id,
        contentType
    )

    response.status(result.status_code)
    response.json(result)

})

// Deletar produto
router.delete("/:id", async function(request,response){

    let id = request.params.id

    let result = await controlerProduto.apagarProduto(id)

    response.status(result.status_code)
    response.json(result)

})


//exporte pro app ter acessoas rota do genero
module.exports = router