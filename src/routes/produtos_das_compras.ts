import { prisma } from "../../lib/prisma"
import { Router } from "express"
import { z } from "zod"

const router = Router()

const produtosDaCompraSchema = z.object({
  Produto_Id: z.number().int().positive(),
  Compra_Id: z.number().int().positive()
})

// GET - listar todos os produtos das compras
router.get("/", async (req, res) => {
  try {
    const produtosDaCompra = await prisma.produtos_da_compra.findMany({
      include: {
        Produto: true,
        Compra: {
          include: {
            Usuario: {
              select: {
                IdUsuario: true,
                Nome: true,
                Email: true
              }
            }
          }
        }
      }
    })

    res.status(200).json(produtosDaCompra)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// GET - buscar produto da compra pelos IDs
router.get("/:Produto_Id/:Compra_Id", async (req, res) => {
  const Produto_Id = Number(req.params.Produto_Id)
  const Compra_Id = Number(req.params.Compra_Id)

  if (isNaN(Produto_Id) || isNaN(Compra_Id)) {
    res.status(400).json({ erro: "IDs inválidos" })
    return
  }

  try {
    const produtoDaCompra =
      await prisma.produtos_da_compra.findUnique({
        where: {
          Produto_Id_Compra_Id: {
            Produto_Id,
            Compra_Id
          }
        },
        include: {
          Produto: true,
          Compra: {
            include: {
              Usuario: {
                select: {
                  IdUsuario: true,
                  Nome: true,
                  Email: true
                }
              }
            }
          }
        }
      })

    if (!produtoDaCompra) {
      res.status(404).json({
        erro: "Produto da compra não encontrado"
      })
      return
    }

    res.status(200).json(produtoDaCompra)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// POST - adicionar produto a uma compra
router.post("/", async (req, res) => {
  const valida = produtosDaCompraSchema.safeParse(req.body)

  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const {
    Produto_Id,
    Compra_Id
  } = valida.data

  try {
    // Verifica se o produto existe
    const produto = await prisma.produto.findUnique({
      where: {
        IdProduto: Produto_Id
      }
    })

    if (!produto) {
      res.status(404).json({
        erro: "Produto não encontrado"
      })
      return
    }

    // Verifica se a compra existe
    const compra = await prisma.compra.findUnique({
      where: {
        IdCompra: Compra_Id
      }
    })

    if (!compra) {
      res.status(404).json({
        erro: "Compra não encontrada"
      })
      return
    }

    // Verifica se o produto já está nessa compra
    const produtoExistente =
      await prisma.produtos_da_compra.findUnique({
        where: {
          Produto_Id_Compra_Id: {
            Produto_Id,
            Compra_Id
          }
        }
      })

    if (produtoExistente) {
      res.status(400).json({
        erro: "Este produto já está associado a esta compra"
      })
      return
    }

    const produtoDaCompra =
      await prisma.produtos_da_compra.create({
        data: {
          Produto_Id,
          Compra_Id
        },
        include: {
          Produto: true,
          Compra: {
            include: {
              Usuario: {
                select: {
                  IdUsuario: true,
                  Nome: true,
                  Email: true
                }
              }
            }
          }
        }
      })

    res.status(201).json(produtoDaCompra)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// DELETE - remover produto de uma compra
router.delete("/:Produto_Id/:Compra_Id", async (req, res) => {
  const Produto_Id = Number(req.params.Produto_Id)
  const Compra_Id = Number(req.params.Compra_Id)

  if (isNaN(Produto_Id) || isNaN(Compra_Id)) {
    res.status(400).json({ erro: "IDs inválidos" })
    return
  }

  try {
    const produtoDaCompra =
      await prisma.produtos_da_compra.findUnique({
        where: {
          Produto_Id_Compra_Id: {
            Produto_Id,
            Compra_Id
          }
        }
      })

    if (!produtoDaCompra) {
      res.status(404).json({
        erro: "Produto da compra não encontrado"
      })
      return
    }

    await prisma.produtos_da_compra.delete({
      where: {
        Produto_Id_Compra_Id: {
          Produto_Id,
          Compra_Id
        }
      }
    })

    res.status(200).json({
      mensagem: "Produto removido da compra com sucesso"
    })
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// PUT - alterar o produto de uma compra
router.put("/:Produto_Id/:Compra_Id", async (req, res) => {
  const Produto_Id = Number(req.params.Produto_Id)
  const Compra_Id = Number(req.params.Compra_Id)

  if (isNaN(Produto_Id) || isNaN(Compra_Id)) {
    res.status(400).json({ erro: "IDs inválidos" })
    return
  }

  const valida = produtosDaCompraSchema.safeParse(req.body)

  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const novoProduto_Id = valida.data.Produto_Id
  const novaCompra_Id = valida.data.Compra_Id

  try {
    const produtoDaCompra =
      await prisma.produtos_da_compra.findUnique({
        where: {
          Produto_Id_Compra_Id: {
            Produto_Id,
            Compra_Id
          }
        }
      })

    if (!produtoDaCompra) {
      res.status(404).json({
        erro: "Produto da compra não encontrado"
      })
      return
    }

    const produto = await prisma.produto.findUnique({
      where: {
        IdProduto: novoProduto_Id
      }
    })

    if (!produto) {
      res.status(404).json({
        erro: "Produto não encontrado"
      })
      return
    }

    const compra = await prisma.compra.findUnique({
      where: {
        IdCompra: novaCompra_Id
      }
    })

    if (!compra) {
      res.status(404).json({
        erro: "Compra não encontrada"
      })
      return
    }

    const atualizado =
      await prisma.produtos_da_compra.update({
        where: {
          Produto_Id_Compra_Id: {
            Produto_Id,
            Compra_Id
          }
        },
        data: {
          Produto_Id: novoProduto_Id,
          Compra_Id: novaCompra_Id
        },
        include: {
          Produto: true,
          Compra: true
        }
      })

    res.status(200).json(atualizado)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

export default router