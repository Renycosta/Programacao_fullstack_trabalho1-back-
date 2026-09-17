import { prisma } from "../lib/prisma";
import { type Prisma } from "../generated/prisma/client"
import bcrypt from "bcrypt"

const admins: Prisma.AdminCreateInput[] = [
    {
        "Nome": "Reny Brito da Costa",
        "Telefone": "(53) 1234-5678",
        "Email": "reny@gmail.com",
        "Senha": bcrypt.hashSync("Reny2006!", 12) // Dica: Já salvar a senha com hash!
    },
    {
        "Nome": "Alessandre Oliveira Pereira",
        "Telefone": "(53) 1234-5678",
        "Email": "ales@gmail.com",
        "Senha": bcrypt.hashSync("ales2000!", 12) 
    },
]

const categorias: Prisma.CategoriaCreateManyInput[] = [
    { "Descricao": "HQ", "Admin_Id": 1 },
    { "Descricao": "Livro", "Admin_Id": 2 },
]

const usuarios: Prisma.UsuarioCreateManyInput[] = [
    {
        "Nome": "Carlos Eduardo Lima",
        "Telefone": "(53) 9876-1234",
        "Email": "carlosedu@gmail.com",
        "CPF": "23456789012",
        "Data_nasc": new Date("1998-04-15T00:00:00.000Z"), // Convertido para Date
        "Senha": bcrypt.hashSync("Edu1998*", 12)
    },
    {
        "Nome": "Juliana Mendes Silva",
        "Telefone": "(53) 9123-8765",
        "Email": "juliana.mendes@gmail.com",
        "CPF": "34567890123",
        "Data_nasc": new Date("2000-11-22T00:00:00.000Z"),
        "Senha": bcrypt.hashSync("Juli2000#", 12)
    },
    {
        "Nome": "Marcos Vinicius Santos",
        "Telefone": "(53) 9988-2233",
        "Email": "marcosvini@outlook.com",
        "CPF": "45678901234",
        "Data_nasc": new Date("1995-07-09T00:00:00.000Z"),
        "Senha": bcrypt.hashSync("Marcos1995!", 12)
    },
    {
        "Nome": "Beatriz Rocha Antunes",
        "Telefone": "(53) 9777-4455",
        "Email": "bia.rocha@yahoo.com",
        "CPF": "56789012345",
        "Data_nasc": new Date("2002-01-30T00:00:00.000Z"),
        "Senha": bcrypt.hashSync("Bia2002&", 12)
    },
    {
        "Nome": "Lucas Gabriel Farias",
        "Telefone": "(53) 9666-3322",
        "Email": "lucas.farias@gmail.com",
        "CPF": "67890123456",
        "Data_nasc": new Date("1992-09-18T00:00:00.000Z"),
        "Senha": bcrypt.hashSync("Lucas1992$", 12)
    },
    {
        "Nome": "Camila Duarte Ribeiro",
        "Telefone": "(53) 9555-1199",
        "Email": "camiladuarte@hotmail.com",
        "CPF": "78901234567",
        "Data_nasc": new Date("1999-06-05T00:00:00.000Z"),
        "Senha": bcrypt.hashSync("Cami1999@", 12)
    },
    {
        "Nome": "Gabriel Martins Souza",
        "Telefone": "(53) 9444-5566",
        "Email": "gabriel.martins@gmail.com",
        "CPF": "89012345678",
        "Data_nasc": new Date("2004-12-14T00:00:00.000Z"),
        "Senha": bcrypt.hashSync("Gabe2004!", 12)
    },
    {
        "Nome": "Larissa Correa Pires",
        "Telefone": "(53) 9333-7788",
        "Email": "larissapires@outlook.com",
        "CPF": "90123456789",
        "Data_nasc": new Date("1997-03-25T00:00:00.000Z"),
        "Senha": bcrypt.hashSync("Lari1997#", 12)
    },
    {
        "Nome": "Matheus Henrique Nogueira",
        "Telefone": "(53) 9222-8899",
        "Email": "matheus.nogueira@gmail.com",
        "CPF": "01234567890",
        "Data_nasc": new Date("2001-08-11T00:00:00.000Z"),
        "Senha": bcrypt.hashSync("Math2001%", 12)
    },
    {
        "Nome": "Fernanda Becker Soares",
        "Telefone": "(53) 9111-0011",
        "Email": "fe.becker@gmail.com",
        "CPF": "11223344556",
        "Data_nasc": new Date("1994-10-02T00:00:00.000Z"),
        "Senha": bcrypt.hashSync("Fefe1994*", 12)
    }
]

const enderecos: Prisma.EnderecoCreateManyInput[] = [
    { 
        "CEP": "96010-000", 
        "Estado": "Rio Grande do Sul", 
        "Cidade": "Pelotas", 
        "Bairro": "Centro", 
        "Rua": "Rua 15 de Novembro", "Numero": 120, "Complemento": "Apto 201", "Usuario_Id": 1 },
    { "CEP": "96020-210", "Estado": "Rio Grande do Sul", "Cidade": "Pelotas", "Bairro": "Três Vendas", "Rua": "Avenida Dom Joaquim", "Numero": 1450, "Complemento": "Casa", "Usuario_Id": 2 },
    { "CEP": "96015-500", "Estado": "Rio Grande do Sul", "Cidade": "Pelotas", "Bairro": "Fragata", "Rua": "Avenida Duque de Caxias", "Numero": 850, "Complemento": "Bloco B, Apto 104", "Usuario_Id": 3 },
    { "CEP": "96055-630", "Estado": "Rio Grande do Sul", "Cidade": "Pelotas", "Bairro": "Areal", "Rua": "Rua Barão de Amazonas", "Numero": 320, "Complemento": null, "Usuario_Id": 4 },
    { "CEP": "96010-440", "Estado": "Rio Grande do Sul", "Cidade": "Pelotas", "Bairro": "Centro", "Rua": "Rua Sete de Setembro", "Numero": 512, "Complemento": "Sala 3", "Usuario_Id": 5 },
    { "CEP": "96020-380", "Estado": "Rio Grande do Sul", "Cidade": "Pelotas", "Bairro": "Três Vendas", "Rua": "Rua Fernando Osório", "Numero": 2300, "Complemento": "Fundos", "Usuario_Id": 6 },
    { "CEP": "96075-100", "Estado": "Rio Grande do Sul", "Cidade": "Pelotas", "Bairro": "Laranjal", "Rua": "Avenida Doutor Antonio D. de Souza", "Numero": 90, "Complemento": "Casa de Praia", "Usuario_Id": 7 },
    { "CEP": "96010-610", "Estado": "Rio Grande do Sul", "Cidade": "Pelotas", "Bairro": "Centro", "Rua": "Rua Anchieta", "Numero": 415, "Complemento": "Apto 402", "Usuario_Id": 8 },
    { "CEP": "96045-000", "Estado": "Rio Grande do Sul", "Cidade": "Pelotas", "Bairro": "Porto", "Rua": "Rua Conde de Porto Alegre", "Numero": 710, "Complemento": null, "Usuario_Id": 9 },
    { "CEP": "96015-120", "Estado": "Rio Grande do Sul", "Cidade": "Pelotas", "Bairro": "Fragata", "Rua": "Rua Almirante Barroso", "Numero": 1605, "Complemento": "Casa 2", "Usuario_Id": 10 }
]

const produtos: Prisma.ProdutoCreateManyInput[] = [
    { "Nome": "O Eternauta", "Autor": "Héctor Oesterheld", "Ano_public": 1957, "Peso": "450g", "Descricao": "Clássico dos quadrinhos de ficção científica sobre uma invasão alienígena em Buenos Aires.", "Img": "o_eternauta.jpg", "Valor": 89.90, "Comentario_IA": "Obra-prima da ficção científica, \"O Eternauta\" usa uma mortal neve tóxica para criar um tenso thriller sobre resistência coletiva. Um clássico dos quadrinhos impressionante, humano e atemporal.", "Usuario_Id": 1, "Categoria_Id": 1 },
    { "Nome": "Homem de Ferro: O Demônio na Garrafa", "Autor": "David Michelinie", "Ano_public": 1979, "Peso": "300g", "Descricao": "História...", "Img": "homem_de_ferro.jpg", "Valor": 59.90, "Comentario_IA": "Lançado...", "Usuario_Id": 2, "Categoria_Id": 1 },
    { "Nome": "Batman Ano Um", "Autor": "Frank Miller", "Ano_public": 1987, "Peso": "350g", "Descricao": "A aclamada...", "Img": "batman_ano_um.jpg", "Valor": 79.90, "Comentario_IA": "Obra-prima...", "Usuario_Id": 3, "Categoria_Id": 1 },
    { "Nome": "Demolidor por Frank Miller & Klaus Janson", "Autor": "Frank Miller", "Ano_public": 1981, "Peso": "500g", "Descricao": "Fase definitiva...", "Img": "demolidor_miller.jpg", "Valor": 119.90, "Comentario_IA": "Frank Miller...", "Usuario_Id": 4, "Categoria_Id": 1 },
    { "Nome": "Sombras da Morte", "Autor": "Jim Starlin", "Ano_public": 1988, "Peso": "280g", "Descricao": "Graphic novel...", "Img": "sombras_da_morte.jpg", "Valor": 49.90, "Comentario_IA": "Visceral...", "Usuario_Id": 5, "Categoria_Id": 1 },
    { "Nome": "Lanterna Verde e Arqueiro Verde – Edição Absoluta", "Autor": "Denny O'Neil", "Ano_public": 1970, "Peso": "800g", "Descricao": "A jornada...", "Img": "lanterna_arqueiro.jpg", "Valor": 149.90, "Comentario_IA": "Em 1970...", "Usuario_Id": 6, "Categoria_Id": 1 },
    { "Nome": "Etrigan O Demônio", "Autor": "Jack Kirby", "Ano_public": 1972, "Peso": "320g", "Descricao": "Criação fantástica...", "Img": "etrigan.jpg", "Valor": 69.90, "Comentario_IA": "Jack Kirby...", "Usuario_Id": 7, "Categoria_Id": 1 },
    { "Nome": "Hellblazer Edição De Luxo 1", "Autor": "Jamie Delano", "Ano_public": 1988, "Peso": "600g", "Descricao": "As primeiras...", "Img": "hellblazer_luxo.jpg", "Valor": 129.90, "Comentario_IA": "O início...", "Usuario_Id": 8, "Categoria_Id": 1 },
    { "Nome": "Supergirl Mulher do Amanhã", "Autor": "Tom King", "Ano_public": 2021, "Peso": "380g", "Descricao": "Uma aventura...", "Img": "supergirl_amanha.jpg", "Valor": 84.90, "Comentario_IA": "Um faroeste...", "Usuario_Id": 9, "Categoria_Id": 1 },
    { "Nome": "Wolverine Arma X", "Autor": "Barry Windsor-Smith", "Ano_public": 1991, "Peso": "400g", "Descricao": "A revelação...", "Img": "wolverine_arma_x.jpg", "Valor": 74.90, "Comentario_IA": "Visceral...", "Usuario_Id": 10, "Categoria_Id": 1 },
    { "Nome": "Capitães da Areia", "Autor": "Jorge Amado", "Ano_public": 1937, "Peso": "310g", "Descricao": "Retrato...", "Img": "capitaes_da_areia.jpg", "Valor": 45.00, "Comentario_IA": "Visceral...", "Usuario_Id": 1, "Categoria_Id": 2 },
    { "Nome": "Drácula - Dark Edition", "Autor": "Bram Stoker", "Ano_public": 1897, "Peso": "550g", "Descricao": "Edição especial...", "Img": "dracula_dark.jpg", "Valor": 89.90, "Comentario_IA": "A Dark Edition...", "Usuario_Id": 2, "Categoria_Id": 2 },
    { "Nome": "Moby Dick", "Autor": "Herman Melville", "Ano_public": 1851, "Peso": "700g", "Descricao": "A obsessiva...", "Img": "moby_dick.jpg", "Valor": 69.90, "Comentario_IA": "Muito além...", "Usuario_Id": 3, "Categoria_Id": 2 },
    { "Nome": "1984", "Autor": "George Orwell", "Ano_public": 1949, "Peso": "340g", "Descricao": "Distopia...", "Img": "1984_orwell.jpg", "Valor": 49.90, "Comentario_IA": "Atemporal...", "Usuario_Id": 4, "Categoria_Id": 2 },
    { "Nome": "O Grande Gatsby", "Autor": "F. Scott Fitzgerald", "Ano_public": 1925, "Peso": "250g", "Descricao": "Retrato...", "Img": "grande_gatsby.jpg", "Valor": 39.90, "Comentario_IA": "Não foi possível...", "Usuario_Id": 5, "Categoria_Id": 2 },
    { "Nome": "Odisseia", "Autor": "Homero", "Ano_public": -750, "Peso": "480g", "Descricao": "O épico...", "Img": "odisseia.jpg", "Valor": 59.90, "Comentario_IA": "Não foi possível...", "Usuario_Id": 6, "Categoria_Id": 2 },
    { "Nome": "O Médico e o Monstro", "Autor": "Robert Louis Stevenson", "Ano_public": 1886, "Peso": "200g", "Descricao": "Investigação...", "Img": "medico_monstro.jpg", "Valor": 34.90, "Comentario_IA": "Não foi possível...", "Usuario_Id": 7, "Categoria_Id": 2 },
    { "Nome": "Hamlet", "Autor": "William Shakespeare", "Ano_public": 1603, "Peso": "270g", "Descricao": "A trágica...", "Img": "hamlet.jpg", "Valor": 39.90, "Comentario_IA": "Não foi possível...", "Usuario_Id": 8, "Categoria_Id": 2 },
    { "Nome": "Vinte Mil Léguas Submarinas", "Autor": "Júlio Verne", "Ano_public": 1870, "Peso": "450g", "Descricao": "A fantástica...", "Img": "vinte_mil_leguas.jpg", "Valor": 55.00, "Comentario_IA": "Não foi possível...", "Usuario_Id": 9, "Categoria_Id": 2 },
    { "Nome": "Box Sherlock Holmes", "Autor": "Arthur Conan Doyle", "Ano_public": 1892, "Peso": "1200g", "Descricao": "Coleção...", "Img": "box_sherlock.jpg", "Valor": 119.90, "Comentario_IA": "Não foi possível...", "Usuario_Id": 10, "Categoria_Id": 2 }
]

const compras: Prisma.CompraCreateManyInput[] = [
    { "Data_venda": new Date("2026-06-01T14:30:00Z"), "Valor_total": 134.80, "Usuario_Id": 1 },
    { "Data_venda": new Date("2026-06-02T16:15:00Z"), "Valor_total": 149.80, "Usuario_Id": 2 },
    { "Data_venda": new Date("2026-06-03T10:00:00Z"), "Valor_total": 148.80, "Usuario_Id": 3 },
    { "Data_venda": new Date("2026-06-04T18:45:00Z"), "Valor_total": 169.80, "Usuario_Id": 4 },
    { "Data_venda": new Date("2026-06-05T11:20:00Z"), "Valor_total": 89.80, "Usuario_Id": 5 },
    { "Data_venda": new Date("2026-06-06T09:10:00Z"), "Valor_total": 209.80, "Usuario_Id": 6 },
    { "Data_venda": new Date("2026-06-07T15:50:00Z"), "Valor_total": 104.80, "Usuario_Id": 7 },
    { "Data_venda": new Date("2026-06-08T13:25:00Z"), "Valor_total": 169.80, "Usuario_Id": 8 },
    { "Data_venda": new Date("2026-06-09T17:05:00Z"), "Valor_total": 139.90, "Usuario_Id": 9 },
    { "Data_venda": new Date("2026-06-10T12:00:00Z"), "Valor_total": 194.80, "Usuario_Id": 10 }
]

const produtos_das_compras: Prisma.Produtos_da_compraCreateManyInput[] = [
    { "Produto_Id": 1, "Compra_Id": 1 },
    { "Produto_Id": 2, "Compra_Id": 1 },
    { "Produto_Id": 3, "Compra_Id": 2 },
    { "Produto_Id": 4, "Compra_Id": 2 },
    { "Produto_Id": 11, "Compra_Id": 3 },
    { "Produto_Id": 12, "Compra_Id": 3 },
    { "Produto_Id": 5, "Compra_Id": 4 },
    { "Produto_Id": 13, "Compra_Id": 4 },
    { "Produto_Id": 14, "Compra_Id": 5 },
    { "Produto_Id": 6, "Compra_Id": 6 },
    { "Produto_Id": 15, "Compra_Id": 6 },
    { "Produto_Id": 7, "Compra_Id": 7 },
    { "Produto_Id": 8, "Compra_Id": 8 },
    { "Produto_Id": 16, "Compra_Id": 8 },
    { "Produto_Id": 17, "Compra_Id": 9 },
    { "Produto_Id": 9, "Compra_Id": 10 },
    { "Produto_Id": 18, "Compra_Id": 10 }
]

async function main() {
    try {
        console.log("Limpando dados antigos do banco...")
        // Limpa na ordem inversa para não violar chaves estrangeiras
        await prisma.produtos_da_compra.deleteMany()
        await prisma.compra.deleteMany()
        await prisma.produto.deleteMany()
        await prisma.endereco.deleteMany()
        await prisma.categoria.deleteMany()
        await prisma.usuario.deleteMany()
        await prisma.admin.deleteMany()

        console.log("Inserindo novos dados...")

        await prisma.admin.createMany({ data: admins })
        console.log(`${admins.length} Admins Cadastradas...`)

        await prisma.categoria.createMany({ data: categorias })
        console.log(`${categorias.length} Categorias Cadastradas...`)
        
        await prisma.usuario.createMany({ data: usuarios })
        console.log(`${usuarios.length} Usuários Cadastradas...`)

        await prisma.endereco.createMany({ data: enderecos })
        console.log(`${enderecos.length} Endereços Cadastradas...`)
        
        await prisma.produto.createMany({ data: produtos })
        console.log(`${produtos.length} Produtos Cadastradas...`)

        await prisma.compra.createMany({ data: compras })
        console.log(`${compras.length} Compras Cadastradas...`)

        await prisma.produtos_da_compra.createMany({ data: produtos_das_compras })
        console.log(`${produtos_das_compras.length} Produtos_das_compras Cadastradas...`)

        console.log("Seed finalizado com sucesso!")
    } catch (error) {
        console.error("Erro nas Inclusões (Seeds):", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

await main()