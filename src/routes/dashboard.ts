import { Router } from "express"
import { prisma } from "../../lib/prisma"

const router = Router()

router.get("/produtos-categoria", async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      select: {
        Descricao: true,
        _count: {
          select: {
            Produtos: true
          }
        }
      }
    })

    const resultado = categorias.map((categoria) => ({
      categoria: categoria.Descricao,
      quantidade: categoria._count.Produtos
    }))

    res.status(200).json(resultado)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      erro: "Erro ao buscar produtos por categoria"
    })
  }
})

router.get("/autores", async (req, res) => {
  try {
    const autores = await prisma.produto.groupBy({
      by: ["Autor"],
      _count: {
        IdProduto: true
      },
      orderBy: {
        _count: {
          IdProduto: "desc"
        }
      }
    })

    const resultado = autores
      .filter((autor) => autor._count.IdProduto > 1)
      .map((autor) => ({
        autor: autor.Autor,
        quantidade: autor._count.IdProduto
      }))

    res.status(200).json(resultado)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      erro: "Erro ao buscar autores"
    })
  }
})

router.get("/mais-caros", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: {
        Valor: "desc"
      },
      take: 5,
      select: {
        IdProduto: true,
        Nome: true,
        Autor: true,
        Valor: true
      }
    })

    res.status(200).json(produtos)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      erro: "Erro ao buscar produtos"
    })
  }
})

router.get("/mais-recentes", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: {
        Data_inclusao: "desc"
      },
      take: 5,
      select: {
        IdProduto: true,
        Nome: true,
        Autor: true,
        Data_inclusao: true
      }
    })

    res.status(200).json(produtos)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      erro: "Erro ao buscar produtos recentes"
    })
  }
})

router.get("/resumo", async (req, res) => {
  try {
    const quantidadeProdutos = await prisma.produto.count()
    const quantidadeCategorias = await prisma.categoria.count()
    const quantidadeUsuarios = await prisma.usuario.count()
    const quantidadeCompras = await prisma.compra.count()

    res.status(200).json({
      produtos: quantidadeProdutos,
      categorias: quantidadeCategorias,
      usuarios: quantidadeUsuarios,
      compras: quantidadeCompras
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      erro: "Erro ao buscar resumo"
    })
  }
})

export default router