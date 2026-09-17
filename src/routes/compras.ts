import { prisma } from "../../lib/prisma"
import { Router } from "express"
import { z } from "zod"

const router = Router()

const compraSchema = z.object({
  Valor_total: z.number().positive(),
  Usuario_Id: z.number().int().positive()
})

router.get("/", async (req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      include: {
        Usuario: {
          select: {
            IdUsuario: true,
            Nome: true,
            Email: true
          }
        },
        PdC: true
      }
    })
    res.status(200).json(compras)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id)

  if (isNaN(id)) {
    res.status(400).json({ erro: "ID inválido" })
    return
  }

  try {
    const compra = await prisma.compra.findUnique({
      where: {
        IdCompra: id
      },
      include: {
        Usuario: {
          select: {
            IdUsuario: true,
            Nome: true,
            Email: true
          }
        },
        PdC: true
      }
    })

    if (!compra) {
      res.status(404).json({ erro: "Compra não encontrada" })
      return
    }
    res.status(200).json(compra)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.post("/", async (req, res) => {
  const valida = compraSchema.safeParse(req.body)

  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const {
    Valor_total,
    Usuario_Id
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

    const compra = await prisma.compra.create({
      data: {
        Valor_total,
        Usuario_Id
      },
      include: {
        Usuario: {
          select: {
            IdUsuario: true,
            Nome: true,
            Email: true
          }
        }
      }
    })

    res.status(201).json(compra)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id)

  if (isNaN(id)) {
    res.status(400).json({ erro: "ID inválido" })
    return
  }

  try {
    const compra = await prisma.compra.findUnique({
      where: {
        IdCompra: id
      }
    })

    if (!compra) {
      res.status(404).json({
        erro: "Compra não encontrada"
      })
      return
    }

    await prisma.compra.delete({
      where: {
        IdCompra: id
      }
    })

    res.status(200).json({
      mensagem: "Compra excluída com sucesso"
    })
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id)

  if (isNaN(id)) {
    res.status(400).json({ erro: "ID inválido" })
    return
  }

  const valida = compraSchema.safeParse(req.body)

  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const {
    Valor_total,
    Usuario_Id
  } = valida.data

  try {
    const compra = await prisma.compra.findUnique({
      where: {
        IdCompra: id
      }
    })

    if (!compra) {
      res.status(404).json({
        erro: "Compra não encontrada"
      })
      return
    }

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

    const compraAtualizada = await prisma.compra.update({
      where: {
        IdCompra: id
      },
      data: {
        Valor_total,
        Usuario_Id
      },
      include: {
        Usuario: {
          select: {
            IdUsuario: true,
            Nome: true,
            Email: true
          }
        }
      }
    })

    res.status(200).json(compraAtualizada)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

export default router