import fs from 'node:fs';
import path from 'node:path';

const SECRET_VALUE_RE =
	/\b(Bearer\s+)[A-Za-z0-9._\-+/=]+/gi;

/**
 * Strip credential material from log strings.
 * @param {unknown} value
 * @returns {string}
 */
export function redact(value) {
	try {
		let s = typeof value === 'string' ? value : JSON.stringify(value);
		s = s.replace(SECRET_VALUE_RE, '$1[REDACTED]');
		s = s.replace(
			/("?(?:access_token|refresh_token|client_secret|authorization)"?\s*[:=]\s*"?)[^"&\s]+/gi,
			'$1[REDACTED]',
		);
		return s;
	} catch (err) {
		console.error('[social-posts:redact]', { err: String(err) });
		return '[redact-failed]';
	}
}

/**
 * @param {string} logPath
 */
export function createLogger(logPath) {
	fs.mkdirSync(path.dirname(logPath), { recursive: true });

	/**
	 * @param {'info'|'error'} level
	 * @param {string} step
	 * @param {string|null|undefined} network
	 * @param {string} msg
	 */
	function logStep(level, step, network, msg) {
		try {
			const line = JSON.stringify({
				ts: new Date().toISOString(),
				level,
				step,
				network: network || null,
				msg: redact(String(msg)),
			});
			fs.appendFileSync(logPath, `${line}\n`, 'utf8');
			console.error(line);
		} catch (err) {
			console.error('[social-posts:logStep]', { step, err: String(err) });
		}
	}

	return {
		logPath,
		logStep,
		failNet(step, network, msg) {
			logStep('error', step, network, msg);
			return { ok: false, network, method: null, result: 'error', url: null, msg: redact(String(msg)) };
		},
	};
}
