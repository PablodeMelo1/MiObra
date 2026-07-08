import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import { connectMongo } from './config/mongo-config.mjs';

import express from 'express';
import cookieParser from 'cookie-parser';

import taskRoutes from './routes/v1/task.mjs';
import commentRoutes from './routes/v1/comment.mjs';
import materialRequestRoutes from './routes/v1/materialRequest.mjs';
import projectRoutes from './routes/v1/project.mjs';
import projectMemberRoutes from './routes/v1/projectMember.mjs';
import supplierRoutes from './routes/v1/supplier.mjs';
import userRoutes from './routes/v1/user.mjs';
import pendingRoutes from './routes/v1/pending.mjs';
import groupRoutes from './routes/v1/group.mjs';
import publicRoutes from './routes/v1/public.mjs';
import itemRoutes from './routes/v1/item.mjs';
import zoneRoutes from './routes/v1/zone.mjs';
import companyRoutes from './routes/v1/company.mjs';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
	origin: process.env.CLIENT_URL || 'http://localhost:5173',
	credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
	res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

app.use('/api/v1', async (req, res, next) => {
	try {
		await connectMongo();
		next();
	} catch (error) {
		next(error);
	}
});

app.use('/api/v1/auth', publicRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/material-requests', materialRequestRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/project-members', projectMemberRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/pendings', pendingRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/zones', zoneRoutes);
app.use('/api/v1/companies', companyRoutes);

app.use((err, req, res, next) => {
	console.error(err);
	const status = err && err.statusCode ? err.statusCode : 500;
	res.status(status).json({ message: err && err.message ? err.message : 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
}

export default app;
