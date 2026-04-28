export interface Usuario {
    id: number,
    nome: string,
    email: string,
    cargo: Cargo
}

export interface Categoria {
    id: number,
    nome: string,
    descricao: string
}

export interface Chamado {
    id: number,
    titulo: string,
    descricao: string,
    dataCriacao: string,
    dataResolvido?: string,
    categoria: Categoria,
    status: Status,
    cliente: Usuario,
    tecnico?: Usuario
}

export interface Mensagem {
    id: number,
    mensagem: string,
    data: string,
    usuario: Usuario,
    chamado: Chamado
}

export interface Avaliacao {
    id: number,
    nota: number,
    mensagem?: string,
    usuario: Usuario,
    chamado: Chamado
}

export enum Cargo {
    CLIENTE = 'CLIENTE',
    SUPORTE = 'SUPORTE',
    ADMIN = 'ADMIN'
}

export enum Status {
    EM_ABERTO = 'EM_ABERTO',
    EM_ANDAMENTO = 'EM_ANDAMENTO',
    AGUARDANDO_SUPORTE = 'AGUARDANDO_SUPORTE',
    AGUARDANDO_CLIENTE = 'AGUARDANDO_CLIENTE',
    FINALIZADO = 'FINALIZADO'
}