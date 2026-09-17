import { prisma } from "../../lib/prisma"
import { Router } from "express"
import { z } from "zod"

const router = Router()

const enderecoSchema = z.object({
  CEP: z.string().min(8, {
    message: "CEP deve ser informado corretamente"
  }).max(9, {
    message: "CEP deve possuir, no máximo, 9 caracteres"
  }),

  Estado: z.string().min(1, {
    message: "Estado deve ser informado"
  }).max(45, {
    message: "Estado deve possuir, no máximo, 45 caracteres"
  }),

  Cidade: z.string().min(1, {
    message: "Cidade deve ser informada"
  }).max(45, {
    message: "Cidade deve possuir, no máximo, 45 caracteres"
  }),

  Bairro: z.string().min(1, {
    message: "Bairro deve ser informado"
  }).max(45, {
    message: "Bairro deve possuir, no máximo, 45 caracteres"
  }),

  Rua: z.string().min(1, {
    message: "Rua deve ser informada"
  }).max(45, {
    message: "Rua deve possuir, no máximo, 45 caracteres"
  }),

  Numero: z.number().int({
    message: "Número deve ser um número inteiro"
  }),

  Complemento: z.string().max(100, {
    message: "Complemento deve possuir, no máximo, 100 caracteres"
  }).optional(),

  Usuario_Id: z.number().int({
    message: "ID do usuário deve ser um número inteiro"
  })
})

router.get("/", async (req, res) => {
  try {
    const enderecos = await prisma.endereco.findMany({
      include: {
        Usuario: {
          select: {
            IdUsuario: true,
            Nome: true,
            Email: true,
            Telefone: true
          }
        }
      }
    })
    res.status(200).json(enderecos)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post("/", async (req, res) => {
  const valida = enderecoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({
      erro: valida.error
    })
    return
  }

  const {
    CEP,
    Estado,
    Cidade,
    Bairro,
    Rua,
    Numero,
    Complemento,
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

    const endereco = await prisma.endereco.create({
      data: {
        CEP,
        Estado,
        Cidade,
        Bairro,
        Rua,
        Numero,
        Complemento,
        Usuario_Id
      }
    })
    res.status(201).json(endereco)
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
      erro: "ID do endereço inválido"
    })
    return
  }
  try {
    const endereco = await prisma.endereco.findUnique({
      where: {
        IdEndereco: id
      },
      include: {
        Usuario: {
          select: {
            IdUsuario: true,
            Nome: true,
            Email: true,
            Telefone: true
          }
        }
      }
    })

    if (!endereco) {
      res.status(404).json({
        erro: "Endereço não encontrado"
      })
      return
    }
    res.status(200).json(endereco)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router