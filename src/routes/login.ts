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
    const usuario = await prisma.usuario.findUnique({
      where: {
        Email
      }
    })

    if (usuario == null) {
      res.status(400).json({
        erro: mensaPadrao
      })
      return
    }

    if (bcrypt.compareSync(Senha, usuario.Senha)) {

      const token = jwt.sign(
        {
          usuarioLogadoId: usuario.IdUsuario,
          usuarioLogadoNome: usuario.Nome
        },
        process.env.JWT_KEY as string,
        {
          expiresIn: "1h"
        }
      )

      res.status(200).json({
        IdUsuario: usuario.IdUsuario,
        Nome: usuario.Nome,
        Email: usuario.Email,
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