import jwt from "jsonwebtoken"
import { prisma } from "../../lib/prisma"
import { Router } from "express"
import bcrypt from "bcrypt"

const router = Router()

router.post("/login", async (req, res) => {
  const { Email, Senha } = req.body

  console.log("Email recebido:", Email)
  console.log("Senha recebida:", Senha)

  try {
    // Primeiro procura um usuário
    const usuario = await prisma.usuario.findUnique({
      where: {
        Email
      }
    })

    if (usuario) {
      console.log("Usuário encontrado:", usuario)

      const senhaCorreta = await bcrypt.compare(
        Senha,
        usuario.Senha
      )

      if (!senhaCorreta) {
        res.status(401).json({
          erro: "Login ou senha incorretos"
        })
        return
      }

      const token = jwt.sign(
        {
          usuarioLogadoId: usuario.IdUsuario,
          usuarioLogadoNome: usuario.Nome,
          tipo: "usuario"
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
        tipo: "usuario",
        token
      })

      return
    }

    // Se não encontrou usuário, procura administrador
    const admin = await prisma.admin.findFirst({
      where: {
        Email
      }
    })

    if (admin) {
      console.log("Administrador encontrado:", admin)

      const senhaCorreta = await bcrypt.compare(
        Senha,
        admin.Senha
      )

      if (!senhaCorreta) {
        res.status(401).json({
          erro: "Login ou senha incorretos"
        })
        return
      }

      const token = jwt.sign(
        {
          adminLogadoId: admin.IdAdmin,
          adminLogadoNome: admin.Nome,
          tipo: "admin"
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
        tipo: "admin",
        token
      })

      return
    }

    console.log("USUÁRIO/ADMIN NÃO ENCONTRADO")

    res.status(401).json({
      erro: "Login ou senha incorretos"
    })

  } catch (error) {
    console.error("ERRO:", error)

    res.status(500).json({
      erro: "Erro interno do servidor"
    })
  }
})

export default router