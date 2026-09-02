export type OfficeNap = {
	locality?: string;
	street?: string;
	phone?: string;
};

function readPublicOfficeEnv(key: string): string | undefined {
	try {
		const value = process.env[key]?.trim();
		return value || undefined;
	} catch (err) {
		console.error('[seo] readPublicOfficeEnv failed', { key, err });
		return undefined;
	}
}

/** Claimed office NAP only. Never invent street/phone/locality. */
export function readOfficeNap(): OfficeNap {
	try {
		const locality = readPublicOfficeEnv('NEXT_PUBLIC_OFFICE_LOCALITY');
		const street = readPublicOfficeEnv('NEXT_PUBLIC_OFFICE_STREET');
		const phone = readPublicOfficeEnv('NEXT_PUBLIC_OFFICE_PHONE');
		return { locality, street, phone };
	} catch (err) {
		console.error('[seo] readOfficeNap failed', { err });
		return {};
	}
}

export function hasVisibleOfficeNap(nap: OfficeNap): boolean {
	return Boolean(nap.locality || nap.street || nap.phone);
}
