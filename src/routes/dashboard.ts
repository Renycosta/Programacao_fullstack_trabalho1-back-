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

export default router