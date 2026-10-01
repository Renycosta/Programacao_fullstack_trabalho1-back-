import jwt from "jsonwebtoken"
import { prisma } from "../../lib/prisma"
import { Router } from "express"
import bcrypt from "bcrypt"

const router = Router()

router.post("/", async (req, res) => {
  const { Email, Senha } = req.body

  const mensaPadrao = "Login ou senha incorretos"

  if (!Email || !Senha) {
    res.status(400).json({
      erro: mensaPadrao
    })
    return
  }

  try {
    const admin = await prisma.admin.findFirst({
      where: {
        Email
      }
    })

    if (admin == null) {
      res.status(400).json({
        erro: mensaPadrao
      })
      return
    }

    if (bcrypt.compareSync(Senha, admin.Senha)) {
      const token = jwt.sign(
        {
          adminLogadoId: admin.IdAdmin,
          adminLogadoNome: admin.Nome
        },
        process.env.JWT_KEY as string,
        {
          expiresIn: "1h"
        }
      )

      res.status(200).json({
        IdAdmin: admin.IdAdmin,
        Nome: admin.Nome,
        Email: admin.Email,
        token
      })

    } else {
      res.status(400).json({
        erro: mensaPadrao
      })
    }

  } catch (error) {
    res.status(400).json(error)
  }
})

export default router