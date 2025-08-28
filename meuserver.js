import express from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma/index.js'
const prisma = new PrismaClient()

const app = express();
app.use(express.json());
app.use(cors());

// Criar usuário
app.post('/users', async (req, res) => {
    try {
        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                age: req.body.age
            }
        })
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// Listar usuários
app.get('/users', async (req, res) => {
    try {
        let users = []
        if(Object.keys(req.query).length > 0){
            users = await prisma.user.findMany({
                where: {
                    ...req.query
                }
            })
        } else {
            users = await prisma.user.findMany()
        }
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// Atualizar usuário
app.put('/users/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const {email, name, age} = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { email, name, age: Number(age) }
        })

        res.status(200).json({user, message: "Usuário atualizado com sucesso!"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// Deletar usuário
app.delete('/users/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user = await prisma.user.delete({
            where: { id }
        })
        res.status(200).json({user: user.name, message: "Usuário deletado com sucesso!"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}`)
})
