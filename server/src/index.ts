import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';


const app: Express = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'HOYODB API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// API 路由
app.use('/api', routes);

// 404 处理
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: '路由不存在' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  console.log(`📚[docs]: API documentation will be available soon`);
});

