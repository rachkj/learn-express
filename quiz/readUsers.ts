import express, { Request, Response, NextFunction } from 'express';
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

const attachUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await fsPromises.readFile(dataFile, 'utf-8');
        req.users = JSON.parse(data) as User[];
        next();
    } catch (err) {
        console.error('Error reading users file:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

router.use(attachUsers);

router.get('/usernames', (req: Request, res: Response) => {
    const usernames = req.users?.map(user => ({ id: user.id, username: user.username }));
    res.json(usernames);
});

router.get('/username/:name', (req: Request, res: Response) => {
    const username = req.params.name;
    const user = req.users?.find(u => u.username === username);
    if (user) {
        res.json({ email: user.email });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

export default router;
