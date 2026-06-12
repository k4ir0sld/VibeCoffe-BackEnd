# Permite criar um database
create database db_vibe_coffee;

use db_vibe_coffee;

# criar tabela usuario
create table tbl_usuario (
    id        int          not null primary key auto_increment,
    nome      varchar(100) not null,
    usuario   varchar(100) not null,
    senha     varchar(514) not null
);

# criar tabela produto
create table tbl_produto (
    id        int          not null primary key auto_increment,
    nome      varchar(50)  not null,
    descricao text         not null,
    foto      varchar(254) not null,
    status    boolean      not null
    );

# criar tabela categoria
create table tbl_categoria (
    id        int          not null primary key auto_increment,
    categoria varchar(100) not null
);

# criar tabela tipo
create table tbl_tipo (
    id        int          not null primary key auto_increment,
    tipo      varchar(45)  not null
);

# ALTERADA: criar tabela tipo_categoria
create table tbl_tipo_categoria (
    id           int not null primary key auto_increment,
    id_tipo      int not null,  -- Nome ajustado para o seu SELECT
    id_categoria int not null,  -- Nome ajustado para o seu SELECT

    ## fazer relacao entre duas tabelas
    constraint FK_TIPO_TIPOCATEGORIA
    foreign key (id_tipo)
    references tbl_tipo(id),

    constraint FK_CATEGORIA_TIPOCATEGORIA
    foreign key (id_categoria)
    references tbl_categoria(id)
);

# criar tabela produto_tipo_categoria
create table tbl_produto_tipo_categoria (
    id                    int          not null primary key auto_increment,
    id_tbl_produto        int          not null,
    id_tbl_tipo_categoria int          not null,
    preco                 decimal(6,2) not null,

    ## fazer relacao entre duas tabelas
    constraint FK_PRODUTO_PRODUTO_TIPO_CATEGORIA
    foreign key (id_tbl_produto)
    references tbl_produto(id),

    constraint FK_TIPO_CATEGORIA_PRODUTO_TIPO_CATEGORIA
    foreign key (id_tbl_tipo_categoria)
    references tbl_tipo_categoria(id)
);