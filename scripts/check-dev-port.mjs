/**
 * Warn when port 3000 is in use so developers do not open the wrong Next.js app.
 */
import http from 'node:http';

const AVNI_GUY_PORT = 3001;
const COMMON_CONFLICT_PORT = 3000;

function logStep(msg) {
	console.log(`[check-dev-port] ${msg}`);
}

function logErr(msg, extra) {
	console.error(`[check-dev-port] ERROR ${msg}`, extra ?? '');
}

function probePort(port) {
	return new Promise((resolve) => {
		const req = http.get(`http://127.0.0.1:${port}/`, { timeout: 2000 }, (res) => {
			res.resume();
			resolve({ port, reachable: true, statusCode: res.statusCode ?? 0 });
		});
		req.on('error', () => resolve({ port, reachable: false, statusCode: 0 }));
		req.on('timeout', () => {
			req.destroy();
			resolve({ port, reachable: false, statusCode: 0 });
		});
	});
}

async function main() {
	logStep(`step 0: avni-guy dev server uses port ${AVNI_GUY_PORT}`);
	const conflict = await probePort(COMMON_CONFLICT_PORT);
	if (conflict.reachable) {
		logStep(
			`step 1: port ${COMMON_CONFLICT_PORT} is in use (HTTP ${conflict.statusCode}). Open http://localhost:${AVNI_GUY_PORT}/ for avni-guy, not :${COMMON_CONFLICT_PORT}.`,
		);
		return;
	}
	logStep(`step 1: port ${COMMON_CONFLICT_PORT} is free`);
}

main().catch((err) => {
	logErr('main failed', err);
	process.exit(1);
});
