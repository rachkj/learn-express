import express, { Request, Response } from 'express';
import { promises as fsPromises } from 'fs';
import path from 'path';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
}

const router = express.Router();

const dataFile = path.resolve(__dirname, '../data/users.json');

router.use(express.json());

router.post('/adduser', async (req: Request, res: Response) => {
    try {
        const newUser = req.body as User;

        const data = await fsPromises.readFile(dataFile, 'utf-8');
        const users = JSON.parse(data) as User[];

        users.push(newUser);
        await fsPromises.writeFile(dataFile, JSON.stringify(users, null, 2));

        console.log('User added successfully');
        res.status(201).json({ message: 'User added successfully' });
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
