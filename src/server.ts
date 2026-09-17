import express from 'express'
import cors from 'cors'

import routesAdmins from './routes/admins'
import routesCategorias from './routes/categorias'
import routesCompras from './routes/compras'
import routesEnderecos from './routes/enderecos'
import routesLogin from './routes/login'
import routesLoginAdmins from './routes/loginAdmins'
import routesProdutos_das_compras from './routes/produtos_das_compras'
import routesProdutos from './routes/produtos'
import routesUsuarios from './routes/usuarios'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use("/admins", routesAdmins)
app.use("/categorias", routesCategorias)
app.use("/compras", routesCompras)
app.use("/enderecos", routesEnderecos)
app.use("/usuarios/login", routesLogin)
app.use("/admins/login", routesLoginAdmins)
app.use("/produtos_das_compras", routesProdutos_das_compras)
app.use("/produtos", routesProdutos)
app.use("/usuarios", routesUsuarios)

app.get('/', (req, res) => {
  res.send('API: Livraria gato preto')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})