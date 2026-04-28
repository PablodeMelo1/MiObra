import mongoose from 'mongoose';
import 'dotenv/config';

const {
	MONGO_BD_IN_USE,
	MONGO_URL = 'localhost',
	MONGO_PORT = '27017',
	MONGO_DB = 'miobra_db',
	MONGO_ATLAS_URI,
	MONGO_ATLAS,
	MONGO_ATLAS_USER,
	MONGO_ATLAS_PASS,
	MONGO_ATLAS_DB,
	MONGO_ATLAS_APP_NAME,
	appName,
} = process.env;

const isAtlasEnabled = String(MONGO_BD_IN_USE || '').toLowerCase() === 'atlas';

const normalizeAtlasHost = (host) => {
	if (!host) return '';
	return host
		.replace(/^mongodb(\+srv)?:\/\//, '')
		.replace(/\/.*$/, '');
};

const buildAtlasUri = () => {
	if (MONGO_ATLAS_URI) return MONGO_ATLAS_URI;
	if (!isAtlasEnabled || !MONGO_ATLAS) return null;

	if (MONGO_ATLAS.startsWith('mongodb://') || MONGO_ATLAS.startsWith('mongodb+srv://')) {
		return MONGO_ATLAS;
	}

	const host = normalizeAtlasHost(MONGO_ATLAS);
	const database = MONGO_ATLAS_DB || MONGO_DB;
	const atlasAppName = MONGO_ATLAS_APP_NAME || appName;
	const credentials = MONGO_ATLAS_USER && MONGO_ATLAS_PASS
		? `${encodeURIComponent(MONGO_ATLAS_USER)}:${encodeURIComponent(MONGO_ATLAS_PASS)}@`
		: '';
	const params = new URLSearchParams({
		retryWrites: 'true',
		w: 'majority',
	});

	if (atlasAppName) {
		params.set('appName', atlasAppName);
	}

	return `mongodb+srv://${credentials}${host}/${database}?${params.toString()}`;
};

const buildMongoUri = () => {
	const atlasUri = buildAtlasUri();
	if (atlasUri) return atlasUri;

	return `mongodb://${MONGO_URL}:${MONGO_PORT}/${MONGO_DB}`;
};

const mongoUri = buildMongoUri();

export const connectMongo = async () => {
	try {
		await mongoose.connect(mongoUri, {
			serverSelectionTimeoutMS: 5000,
		});
		console.log(`Mongo conectado (${isAtlasEnabled ? 'Atlas' : 'local'})`);
	} catch (err) {
		console.error('Hubo un error en la conexion de mongo:', err.message);
		process.exit(1);
	}
};

connectMongo();
