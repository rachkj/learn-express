import { promises as fsPromises } from 'fs';
import path from 'path';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

/**
 * A type that represents a user object
 */
interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

/**
 * A type that represents the request received by the server
 */
interface UserRequest extends Request {
  users?: User[];
}

const app: Express = express();
const port: number = 8000;
const dataFile = '../data/users.json';

let users: User[];
async function readUsersFile() {
  try {
    console.log('reading file ... ');
    const data = await fsPromises.readFile(path.resolve(__dirname, dataFile));
    users = JSON.parse(data.toString());
    console.log('File read successfully');
  } catch (err) {
    console.error('Error reading file:', err);
    throw err;
  }
}

readUsersFile();
const addMsgToRequest = (req: UserRequest, res: Response, next: NextFunction) => {
  if (users) {
    req.users = users;
    next();
  } else {
    return res.json({
      error: { message: 'users not found', status: 404 }
    });
  }
};

app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/read/usernames', addMsgToRequest);

app.get('/read/usernames', (req: UserRequest, res: Response) => {
  let usernames = req.users?.map((user) => {
    return { id: user.id, username: user.username };
  });
  res.send(usernames);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/write/adduser', addMsgToRequest);
app.post('/write/adduser', async (req: UserRequest, res: Response) => {
  try {
    let newuser = req.body as User;
    users.push(newuser);

    await fsPromises.writeFile(
      path.resolve(__dirname, dataFile),
      JSON.stringify(users)
    );

    console.log('User Saved');
    res.send('done');
  } catch (err) {
    console.log('Failed to write:', err);
    res.status(500).send('Error saving user');
  }
});

app.get('/read/username/:name', (req: UserRequest, res: Response) => {
  const username = req.params.name;
  const user = req.users?.find((u) => u.username === username);

  if (user) {
    res.json({ email: user.email });
  } else {
    res.status(404).json({ error: { message: 'User not found', status: 404 } });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});