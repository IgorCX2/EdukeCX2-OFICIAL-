const diaAtual = new Date();
export const Envs = {
    CHAVE_CODIFICADORA: process.env.NEXT_PUBLIC_CHAVE_CODIFICADORA.split(',')[diaAtual.getDate()],
    API_LOCAL: process.env.NEXT_PUBLIC_API_LOCAL,
}