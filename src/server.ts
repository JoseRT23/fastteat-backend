import express from 'express';
import cors from 'cors';
import { routes } from './routes/index';
import { envs } from './config/envs';
import { prisma } from './config/prisma';

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
    app.use('/api', routes())

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    const server = app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
        console.log(`📡 API available at http://localhost:${PORT}/api`);
    });

    // Maneja el cierre gracioso del servidor
    process.on('SIGINT', async () => {
        console.log('\n⛔ Shutting down gracefully...');
        server.close(async () => {
            await prisma.$disconnect();
            console.log('✅ Server closed');
            process.exit(0);
        });
    });
}

export default { start };