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
const atlasDatabase = MONGO_ATLAS_DB || MONGO_DB;
const atlasAppName = MONGO_ATLAS_APP_NAME || appName;

const normalizeAtlasHost = (host) => {
	if (!host) return '';
	return host
		.replace(/^mongodb(\+srv)?:\/\//, '')
		.replace(/\/.*$/, '');
};

const withAtlasDefaults = (uri) => {
	const parsed = new URL(uri);

	if (!parsed.pathname || parsed.pathname === '/') {
		parsed.pathname = `/${atlasDatabase}`;
	}

	if (!parsed.searchParams.has('retryWrites')) {
		parsed.searchParams.set('retryWrites', 'true');
	}

	if (!parsed.searchParams.has('w')) {
		parsed.searchParams.set('w', 'majority');
	}

	if (atlasAppName && !parsed.searchParams.has('appName')) {
		parsed.searchParams.set('appName', atlasAppName);
	}

	return parsed.toString();
};

const getMongoInfo = (uri) => {
	try {
		const parsed = new URL(uri);
		return {
			host: parsed.host,
			database: parsed.pathname.replace(/^\//, '') || '(sin base)',
			protocol: parsed.protocol.replace(':', ''),
		};
	} catch {
		return {
			host: '(uri invalida)',
			database: '(desconocida)',
			protocol: '(desconocido)',
		};
	}
};

const buildAtlasUri = () => {
	if (MONGO_ATLAS_URI) return withAtlasDefaults(MONGO_ATLAS_URI.trim());
	if (!isAtlasEnabled || !MONGO_ATLAS) return null;

	if (MONGO_ATLAS.startsWith('mongodb://') || MONGO_ATLAS.startsWith('mongodb+srv://')) {
		return withAtlasDefaults(MONGO_ATLAS.trim());
	}

	const host = normalizeAtlasHost(MONGO_ATLAS);
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

	return `mongodb+srv://${credentials}${host}/${atlasDatabase}?${params.toString()}`;
};

const buildMongoUri = () => {
	const atlasUri = buildAtlasUri();
	if (atlasUri) return atlasUri;

	return `mongodb://${MONGO_URL}:${MONGO_PORT}/${MONGO_DB}`;
};

const mongoUri = buildMongoUri();
const mongoInfo = getMongoInfo(mongoUri);

export const connectMongo = async () => {
	try {
		console.log(`Conectando Mongo (${mongoInfo.protocol}) host=${mongoInfo.host} db=${mongoInfo.database}`);
		await mongoose.connect(mongoUri, {
			serverSelectionTimeoutMS: 5000,
		});
		console.log(`Mongo conectado (${mongoInfo.host})`);
	} catch (err) {
		console.error('Hubo un error en la conexion de mongo:', err.message);
		console.error(`Mongo intentado: host=${mongoInfo.host} db=${mongoInfo.database}`);
		process.exit(1);
	}
};

connectMongo();
