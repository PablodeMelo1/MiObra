import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

// Importar rutas
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

const app = express();

app.use(express.json());

// Healthcheck / root
app.get('/', (req, res) => {
	res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

// Rutas API v1
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/material-requests', materialRequestRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/project-members', projectMemberRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/pendings', pendingRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/auth', publicRoutes);

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
}

export default app;
