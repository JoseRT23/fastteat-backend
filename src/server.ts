import express from 'express';
import cors from 'cors';
import { routes } from './routes/index';
import { envs } from './config/envs';
import { prisma } from './config/prisma';
import { handleError } from './middlewares/error-handler.middleware';

async function start() {
    const PORT = envs.PORT || 3000;
    const app = express();
    app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api', routes());
    app.use(handleError);

    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.get('/hello', (req, res) => {
        res.json({ message: 'hello world' });
    });

    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    process.on('SIGINT', async () => {
        server.close(async () => {
            await prisma.$disconnect();
            console.log('Server closed');
            process.exit(0);
        });
    });
}

export default { start };