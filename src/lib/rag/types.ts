export type VectorChunk = {
	id: string;
	text: string;
	url: string;
	title: string;
	source?: string;
	embedding: number[];
};

export type VectorIndex = {
	version: number;
	builtAt: string;
	model: string;
	dimensions: number;
	chunks: VectorChunk[];
};

export type SearchResult = {
	id: string;
	url: string;
	title: string;
	snippet: string;
	score: number;
};

export type ChatCitation = {
	url: string;
	title: string;
};

export type ChatHistoryMessage = {
	role: 'user' | 'assistant';
	content: string;
};
