export {
	PUBLIC_RECORD_CLUSTER_TOKENS,
	PUBLIC_RECORD_DISCLAIMER,
	PUBLIC_RECORD_FAQ,
	PUBLIC_RECORD_FORBIDDEN_PHRASES,
	PUBLIC_RECORD_HERO_INTRO,
	PUBLIC_RECORD_LEAD,
	PUBLIC_RECORD_META_DESCRIPTION,
	PUBLIC_RECORD_PARAGRAPHS,
	PUBLIC_RECORD_SOURCES,
	PUBLIC_RECORD_SPEAKABLE,
	PUBLIC_RECORD_TITLE,
	assertPublicRecordCopy,
	buildPublicRecordIndexText,
	findPublicRecordGaps,
} from './public-record.mjs';

export type PublicRecordSource = {
	id: string;
	href: string;
	label: string;
	court: string;
};

export type PublicRecordFaqItem = {
	question: string;
	answer: string;
};
