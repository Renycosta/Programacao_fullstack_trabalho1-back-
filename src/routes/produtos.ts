import { prisma } from "../../lib/prisma"
import { buscarDadosComGemini } from "../../services/iaServices"
import { Router } from "express"
import { z } from "zod"

const router = Router()

const produtoSchema = z.object({

  Nome: z.string().min(2, {
    message: "Nome deve possuir, no mínimo, 2 caracteres"
  }),

  Autor: z.string().min(2, {
    message: "Autor deve possuir, no mínimo, 2 caracteres"
  }),

  Ano_public: z.number(),

  Peso: z.string().min(1, {
    message: "Peso deve ser informado"
  }),

  Descricao: z.string().min(1, {
    message: "Descrição deve ser informada"
  }).max(250, {
    message: "Descrição deve possuir, no máximo, 250 caracteres"
  }),

  Img: z.string(),

  Valor: z.number(),

  Usuario_Id: z.number(),

  Categoria_Id: z.number()

})

router.get("/", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        Usuario: {
          select: {
            IdUsuario: true,
            Nome: true,
            Email: true
          }
        },
        Categoria: true
      }
    })
    res.status(200).json(produtos)
  } catch (error) {
    res.status(500).json({
      erro: error
    })
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const produto = await prisma.produto.findUnique({
      where: {
        IdProduto: Number(id)
      },
      include: {
        Usuario: {
          select: {
            IdUsuario: true,
            Nome: true,
            Email: true
          }
        },
        Categoria: true
      }
    })

    if (!produto) {
      res.status(404).json({
        erro: "Produto não encontrado"
      })
      return
    }
    res.status(200).json(produto)
  } catch (error) {
    res.status(500).json({
      erro: error
    })
  }
})

router.post("/", async (req, res) => {
  const valida = produtoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({
      erro: valida.error
    })
    return
  }

  const {
    Nome,
    Autor,
    Ano_public,
    Peso,
    Descricao,
    Img,
    Valor,
    Usuario_Id,
    Categoria_Id
  } = valida.data

  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
        IdUsuario: Usuario_Id
      }
    })

    if (!usuario) {
      res.status(404).json({
        erro: "Usuário não encontrado"
      })
      return
    }

    const categoria = await prisma.categoria.findUnique({
      where: {
        IdCategoria: Categoria_Id
      }
    })

    if (!categoria) {
      res.status(404).json({
        erro: "Categoria não encontrada"
      })
      return
    }

    let comentarioIA = ""

    try {
      comentarioIA = await buscarDadosComGemini(
        Autor,
        Nome,
        Ano_public
      )
      console.log("Comentário gerado pela IA:", comentarioIA)
    } catch (erroIA: any) {
      console.log(
        "Falha ao consultar o Gemini:",
        erroIA.message
      )
      comentarioIA = "Não foi possível gerar o comentário através da IA."
    }
    
    comentarioIA = comentarioIA.substring(0, 250)

    const produto = await prisma.produto.create({
      data: {
        Nome,
        Autor,
        Ano_public,
        Peso,
        Descricao,
        Img,
        Valor,
        Comentario_IA: comentarioIA,
        Usuario_Id,
        Categoria_Id
      }
    })
    res.status(201).json(produto)
  } catch (error) {
    res.status(400).json({
      erro: error
    })
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const produto = await prisma.produto.delete({
      where: {
        IdProduto: Number(id)
      }
    })
    res.status(200).json(produto)
  } catch (error) {
    res.status(400).json({
      erro: error
    })
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params
  const valida = produtoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({
      erro: valida.error
    })
    return
  }

  const {
    Nome,
    Autor,
    Ano_public,
    Peso,
    Descricao,
    Img,
    Valor,
    Usuario_Id,
    Categoria_Id
  } = valida.data

  try {
    const produto = await prisma.produto.update({
      where: {
        IdProduto: Number(id)
      },
      data: {
        Nome,
        Autor,
        Ano_public,
        Peso,
        Descricao,
        Img,
        Valor,
        Usuario_Id,
        Categoria_Id
      }
    })
    res.status(200).json(produto)
  } catch (error) {
    res.status(400).json({
      erro: error
    })
  }
})

router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params
  const termoNumero = Number(termo)
  if (isNaN(termoNumero)) {
    try {
      const produtos = await prisma.produto.findMany({
        include: {
          Categoria: true,
          Usuario: {
            select: {
              IdUsuario: true,
              Nome: true,
              Email: true
            }
          }
        },
        where: {
          OR: [
            {
              Nome: {
                contains: termo
              }
            },
            {
              Autor: {
                contains: termo
              }
            },
            {
              Categoria: {
                Descricao: {
                  contains: termo
                }
              }
            }
          ]
        }
      })
      res.status(200).json(produtos)
    } catch (error) {
      res.status(500).json({
        erro: error
      })
    }
  }
  else if (termoNumero <= 3000) {
    try {
      const produtos = await prisma.produto.findMany({
        include: {
          Categoria: true
        },
        where: {
          Ano_public: termoNumero
        }
      })
      res.status(200).json(produtos)
    } catch (error) {
      res.status(500).json({
        erro: error
      })
    }
  }
  else {
    try {
      const produtos = await prisma.produto.findMany({
        include: {
          Categoria: true
        },
        where: {
          Valor: {
            lte: termoNumero
          }
        }
      })
      res.status(200).json(produtos)
    } catch (error) {
      res.status(500).json({
        erro: error
      })
    }
  }
})

export default router