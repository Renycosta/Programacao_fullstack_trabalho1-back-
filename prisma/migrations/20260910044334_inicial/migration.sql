/*
  Warnings:

  - You are about to drop the `carros` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clientes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `marcas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `propostas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "carros" DROP CONSTRAINT "carros_marcaId_fkey";

-- DropForeignKey
ALTER TABLE "propostas" DROP CONSTRAINT "propostas_carroId_fkey";

-- DropForeignKey
ALTER TABLE "propostas" DROP CONSTRAINT "propostas_clienteId_fkey";

-- DropTable
DROP TABLE "carros";

-- DropTable
DROP TABLE "clientes";

-- DropTable
DROP TABLE "marcas";

-- DropTable
DROP TABLE "propostas";

-- DropEnum
DROP TYPE "Combustiveis";

-- CreateTable
CREATE TABLE "usuarios" (
    "IdUsuario" SERIAL NOT NULL,
    "Nome" VARCHAR(45) NOT NULL,
    "Telefone" VARCHAR(45) NOT NULL,
    "Email" VARCHAR(45) NOT NULL,
    "CPF" VARCHAR(11) NOT NULL,
    "Data_nasc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Senha" VARCHAR(100) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("IdUsuario")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "IdEndereco" SERIAL NOT NULL,
    "CEP" VARCHAR(9) NOT NULL,
    "Estado" VARCHAR(45) NOT NULL,
    "Cidade" VARCHAR(45) NOT NULL,
    "Bairro" VARCHAR(45) NOT NULL,
    "Rua" VARCHAR(45) NOT NULL,
    "Numero" SMALLINT NOT NULL,
    "Complemento" VARCHAR(100),
    "Usuario_Id" INTEGER NOT NULL,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("IdEndereco")
);

-- CreateTable
CREATE TABLE "produtos" (
    "IdProduto" SERIAL NOT NULL,
    "Nome" VARCHAR(45) NOT NULL,
    "Autor" VARCHAR(45) NOT NULL,
    "Ano_public" SMALLINT NOT NULL,
    "Peso" VARCHAR(10) NOT NULL,
    "Descricao" VARCHAR(250) NOT NULL,
    "Img" VARCHAR(45) NOT NULL,
    "Valor" DECIMAL(10,2) NOT NULL,
    "Comentario_IA" VARCHAR(250) NOT NULL,
    "Data_inclusao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Data_atualiza" TIMESTAMP(3) NOT NULL,
    "Usuario_Id" INTEGER NOT NULL,
    "Categoria_Id" INTEGER NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("IdProduto")
);

-- CreateTable
CREATE TABLE "compras" (
    "IdCompra" SERIAL NOT NULL,
    "Data_venda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Valor_total" DECIMAL(10,2) NOT NULL,
    "Usuario_Id" INTEGER NOT NULL,

    CONSTRAINT "compras_pkey" PRIMARY KEY ("IdCompra")
);

-- CreateTable
CREATE TABLE "produtos_das_compras" (
    "Produto_Id" INTEGER NOT NULL,
    "Compra_Id" INTEGER NOT NULL,

    CONSTRAINT "produtos_das_compras_pkey" PRIMARY KEY ("Produto_Id","Compra_Id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "IdCategoria" SERIAL NOT NULL,
    "Descricao" VARCHAR(250) NOT NULL,
    "Admin_Id" INTEGER NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("IdCategoria")
);

-- CreateTable
CREATE TABLE "admins" (
    "IdAdmin" SERIAL NOT NULL,
    "Nome" VARCHAR(45) NOT NULL,
    "Telefone" VARCHAR(45) NOT NULL,
    "Email" VARCHAR(45) NOT NULL,
    "Senha" VARCHAR(100) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("IdAdmin")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_Email_key" ON "usuarios"("Email");

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_Usuario_Id_fkey" FOREIGN KEY ("Usuario_Id") REFERENCES "usuarios"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_Usuario_Id_fkey" FOREIGN KEY ("Usuario_Id") REFERENCES "usuarios"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_Categoria_Id_fkey" FOREIGN KEY ("Categoria_Id") REFERENCES "categorias"("IdCategoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_Usuario_Id_fkey" FOREIGN KEY ("Usuario_Id") REFERENCES "usuarios"("IdUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos_das_compras" ADD CONSTRAINT "produtos_das_compras_Produto_Id_fkey" FOREIGN KEY ("Produto_Id") REFERENCES "produtos"("IdProduto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos_das_compras" ADD CONSTRAINT "produtos_das_compras_Compra_Id_fkey" FOREIGN KEY ("Compra_Id") REFERENCES "compras"("IdCompra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_Admin_Id_fkey" FOREIGN KEY ("Admin_Id") REFERENCES "admins"("IdAdmin") ON DELETE RESTRICT ON UPDATE CASCADE;
