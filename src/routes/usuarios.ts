import { prisma } from "../../lib/prisma"
import { Router } from "express"
import bcrypt from "bcrypt"
import { z } from "zod"
import jwt from "jsonwebtoken"

const router = Router()

const usuarioSchema = z.object({
  Nome: z.string().min(10, {
    message: "Nome do usuário deve possuir, no mínimo, 10 caracteres"
  }),

  Telefone: z.string(),

  Email: z.string().email({
    message: "Informe um e-mail válido"
  }),

  CPF: z.string().length(11, {
    message: "CPF deve possuir 11 caracteres"
  }),

  Data_nasc: z.coerce.date(),

  Senha: z.string()
})

function validaSenha(senha: string) {
  const mensa: string[] = []

  if (senha.length < 8) {
    mensa.push(
      "Erro... senha deve possuir, no mínimo, 8 caracteres"
    )
  }

  let pequenas = 0
  let grandes = 0
  let numeros = 0
  let simbolos = 0

  for (const letra of senha) {
    if (/[a-z]/.test(letra)) {
      pequenas++
    } else if (/[A-Z]/.test(letra)) {
      grandes++
    } else if (/[0-9]/.test(letra)) {
      numeros++
    } else {
      simbolos++
    }
  }

  if (pequenas == 0) {
    mensa.push(
      "Erro... senha deve possuir letra(s) minúscula(s)"
    )
  }

  if (grandes == 0) {
    mensa.push(
      "Erro... senha deve possuir letra(s) maiúscula(s)"
    )
  }

  if (numeros == 0) {
    mensa.push(
      "Erro... senha deve possuir número(s)"
    )
  }

  if (simbolos == 0) {
    mensa.push(
      "Erro... senha deve possuir símbolo(s)"
    )
  }

  return mensa
}

router.get("/", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        IdUsuario: true,
        Nome: true,
        Telefone: true,
        Email: true,
        CPF: true,
        Data_nasc: true
      }
    })

    res.status(200).json(usuarios)

  } catch (error) {
    console.error(error)

    res.status(400).json({
      erro: "Erro ao buscar usuários"
    })
  }
})

router.post("/", async (req, res) => {
  const valida = usuarioSchema.safeParse(req.body)

  if (!valida.success) {
    res.status(400).json({
      erro: valida.error
    })

    return
  }

  const verificaUsuario = await prisma.usuario.findUnique({
    where: {
      Email: valida.data.Email
    }
  })

  if (verificaUsuario) {
    res.status(400).json({
      erro: "E-mail já cadastrado"
    })

    return
  }

  const verificaCPF = await prisma.usuario.findFirst({
    where: {
      CPF: valida.data.CPF
    }
  })

  if (verificaCPF) {
    res.status(400).json({
      erro: "CPF já cadastrado"
    })

    return
  }

  const erros = validaSenha(valida.data.Senha)

  if (erros.length > 0) {
    res.status(400).json({
      erro: erros.join("; ")
    })

    return
  }

  const salt = bcrypt.genSaltSync(12)
  const hash = bcrypt.hashSync(
    valida.data.Senha,
    salt
  )

  const {
    Nome,
    Telefone,
    Email,
    CPF,
    Data_nasc
  } = valida.data

  try {

    const usuario = await prisma.usuario.create({
      data: {
        Nome,
        Telefone,
        Email,
        CPF,
        Data_nasc,
        Senha: hash
      },

      select: {
        IdUsuario: true,
        Nome: true,
        Telefone: true,
        Email: true,
        CPF: true,
        Data_nasc: true
      }
    })

    res.status(201).json({
      usuario
    })

  } catch (error) {
    console.error(error)

    res.status(400).json({
      erro: "Erro ao cadastrar usuário"
    })
  }
})

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id)

  if (isNaN(id)) {
    res.status(400).json({
      erro: "ID do usuário inválido"
    })
    return
  }

  try {

    const usuario = await prisma.usuario.findUnique({
      where: {
        IdUsuario: id
      },

      select: {
        IdUsuario: true,
        Nome: true,
        Telefone: true,
        Email: true,
        CPF: true,
        Data_nasc: true
      }
    })

    if (!usuario) {
      res.status(404).json({
        erro: "Usuário não encontrado"
      })
      return
    }

    res.status(200).json(usuario)

  } catch (error) {
    console.error(error)
    res.status(400).json({
      erro: "Erro ao buscar usuário"
    })
  }
})

router.post("/login", async (req, res) => {
  const { Email, Senha } = req.body

  if (!Email || !Senha) {
    res.status(400).json({
      erro: "Informe o e-mail e a senha"
    })
    return
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
        Email
      }
    })

    if (!usuario) {
      res.status(400).json({
        erro: "Login ou senha incorretos"
      })
      return
    }

    const senhaCorreta = await bcrypt.compare(
      Senha,
      usuario.Senha
    )

    if (!senhaCorreta) {
      res.status(400).json({
        erro: "Login ou senha incorretos"
      })
      return
    }

    const token = jwt.sign(
      {
        usuarioLogadoId: usuario.IdUsuario,
        usuarioLogadoNome: usuario.Nome
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d"
      }
    )

    res.status(200).json({
      IdUsuario: usuario.IdUsuario,
      Nome: usuario.Nome,
      Email: usuario.Email,
      token
    })

  } catch (error) {
    console.error("ERRO NO LOGIN:", error)

    res.status(500).json({
      erro: "Erro ao realizar login"
    })
  }
})

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id)

  if (isNaN(id)) {
    res.status(400).json({
      erro: "ID do usuário inválido"
    })
    return
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
        IdUsuario: id
      }
    })

    if (!usuario) {
      res.status(404).json({
        erro: "Usuário não encontrado"
      })
      return
    }

    await prisma.usuario.delete({
      where: {
        IdUsuario: id
      }
    })
    res.status(200).json({
      mensagem: "Usuário excluído com sucesso"
    })
  } catch (error) {
    console.error(error)
    res.status(400).json({
      erro: error
    })
  }
})

export default router