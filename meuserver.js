import express from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma/index.js'
const prisma = new PrismaClient()

const app = express();
app.use(express.json());
app.use(cors('http://localhost:5173'));

const users = [];

app.post('/users', async (req, res) => {
    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })
})

app.get('/users', async (req, res) => {
    let users = []
    if(req.query){
        users = await prisma.user.findMany({
            where: {
                name: req.query.name, 
                email: req.query.email, 
                age: req.query.age
            }
        })
    } else {
        users = await prisma.user.findMany() 
    } //Isso é como um filtro para que o get retorne apenas os usuários que correspondem ao nome, email e idadefornecidos na query

    res.status(200).json(users)
}) //função de listar usuários

app.put('/users/:id', async (req, res) => {
    const id = req.params.id;
    const {email, name, age} = req.body;

    const users = await prisma.user.update({
        where: { id: String(id) }, //Quem eu vou atualizar??
        data: { email, name, age }
    })

    res.status(200).json({user: users, message: "Usuário atualizado com sucesso!"})
})

app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    const users = await prisma.user.delete({
        where: { id: String(id) }
    })

    res.status(200).json({user: users.name, message: "Usuário deletado com sucesso!"})
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}`)
})
/**
 * Criar nossa  API de usuários
 *  - Criar um usuário
 *  - Listar todos os usuários
 *  - Editar um usuário
 *  - Deletar um usuário
 *
 * 
 * 
 */