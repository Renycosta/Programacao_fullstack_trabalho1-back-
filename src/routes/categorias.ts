import { prisma } from "../../lib/prisma"
import { Router } from "express"
import { z } from "zod"

const router = Router()

const categoriaSchema = z.object({
  Descricao: z.string().min(1, {
    message: "Descrição da categoria deve ser informada"
  }).max(250, {
    message: "Descrição da categoria deve possuir, no máximo, 250 caracteres"
  }),
  Admin_Id: z.number().int({message: "ID do administrador deve ser um número inteiro"})
})

router.get("/", async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {Admin: true}
    })
    res.status(200).json(categorias)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post("/", async (req, res) => {
  const valida = categoriaSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({
      erro: valida.error
    })
    return
  }

  const {Descricao, Admin_Id} = valida.data

  try {
    const admin = await prisma.admin.findUnique({
      where: {
        IdAdmin: Admin_Id
      }
    })

    if (!admin) {
      res.status(404).json({
        erro: "Administrador não encontrado"
      })
      return
    }

    const categoria = await prisma.categoria.create({
      data: {Descricao, Admin_Id}
    })
    res.status(201).json(categoria)
  } catch (error) {
    res.status(400).json({
      erro: error
    })
  }
})

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    res.status(400).json({
      erro: "ID da categoria inválido"
    })
    return
  }
  try {
    const categoria = await prisma.categoria.findUnique({
      where: {IdCategoria: id},
      include: {Admin: true}
    })

    if (!categoria) {
      res.status(404).json({
        erro: "Categoria não encontrada"
      })
      return
    }
    res.status(200).json(categoria)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router