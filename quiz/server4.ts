import express from 'express';
import cors from 'cors';
import readUsersRouter from './readUsers';
import writeUsersRouter from './writeUsers';


const app = express();
const port = 8000;
app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/read', readUsersRouter);
app.use('/write', writeUsersRouter);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
