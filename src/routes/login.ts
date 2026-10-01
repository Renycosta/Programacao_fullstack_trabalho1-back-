import jwt from "jsonwebtoken"
import { prisma } from "../../lib/prisma"
import { Router } from "express"
import bcrypt from "bcrypt"

const router = Router()

router.post("/", async (req, res) => {
    const { Email, Senha } = req.body

    console.log("Email recebido:", Email)
    console.log("Senha recebida:", Senha)

    const mensaPadrao = "Login ou senha incorretos"

    if (!Email || !Senha) {
        console.log("Email ou senha não foram enviados")
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

        console.log("Usuário encontrado:", usuario)

        if (usuario == null) {
            console.log("USUÁRIO NÃO ENCONTRADO")
            res.status(400).json({
                erro: mensaPadrao
            })
            return
        }

        const senhaCorreta = bcrypt.compareSync(
            Senha,
            usuario.Senha
        )

        console.log("Senha correta:", senhaCorreta)

        if (senhaCorreta) {
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
            console.log("SENHA INCORRETA")
            res.status(400).json({
                erro: mensaPadrao
            })
        }

    } catch (error) {
        console.error("ERRO:", error)
        res.status(400).json({
            erro: mensaPadrao
        })
    }
})

export default router