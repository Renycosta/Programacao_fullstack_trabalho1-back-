import jwt from "jsonwebtoken"
import { prisma } from "../../lib/prisma"
import { Router } from "express"
import bcrypt from "bcrypt"

const router = Router()

router.post("/login", async (req, res) => {
  const { Email, Senha } = req.body

  console.log("LOGIN RECEBIDO:")
  console.log("Email:", Email)
  console.log("Senha:", Senha)

  try {
    // =========================
    // LOGIN DE USUÁRIO
    // =========================

    const usuario = await prisma.usuario.findUnique({
      where: {
        Email
      }
    })

    console.log("USUÁRIO ENCONTRADO:", usuario)

    if (usuario) {
      const senhaCorreta = await bcrypt.compare(
        Senha,
        usuario.Senha
      )

      console.log("SENHA DO USUÁRIO CORRETA:", senhaCorreta)

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

    // =========================
    // LOGIN DE ADMINISTRADOR
    // =========================

    console.log(
      "Usuário não encontrado. Procurando administrador..."
    )

    const admin = await prisma.admin.findFirst({
      where: {
        Email
      }
    })

    console.log("ADMIN ENCONTRADO:", admin)

    if (admin) {
      const senhaCorreta = await bcrypt.compare(
        Senha,
        admin.Senha
      )

      console.log(
        "SENHA DO ADMINISTRADOR CORRETA:",
        senhaCorreta
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

    // =========================
    // NENHUMA CONTA ENCONTRADA
    // =========================

    console.log("USUÁRIO/ADMIN NÃO ENCONTRADO")

    res.status(401).json({
      erro: "Login ou senha incorretos"
    })

  } catch (error) {
    console.error("ERRO NO LOGIN:", error)

    res.status(500).json({
      erro: "Erro interno do servidor"
    })
  }
})

export default router