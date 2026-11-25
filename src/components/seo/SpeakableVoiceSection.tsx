import { SPEAKABLE_VOICE_CLASS } from '@/lib/seo/speakable';
import type { SpeakableVoiceBlock } from '@/lib/seo/speakable-voice-blocks';

type SpeakableVoiceSectionProps = {
	blocks: SpeakableVoiceBlock[];
	className?: string;
};

/** Visible voice-answer blocks that must match SpeakableSpecification cssSelector. */
export function SpeakableVoiceSection({ blocks, className }: SpeakableVoiceSectionProps) {
	if (!blocks.length) {
		console.error('[SpeakableVoiceSection] empty blocks');
		return null;
	}
	return (
		<div
			id="speakable"
			className={className ?? 'mt-8 flex max-w-3xl flex-col gap-4'}
			aria-label="תשובות קוליות קצרות"
		>
			{blocks.map(({ id, question, answer }) => (
				<div key={id} id={`speakable-${id}`}>
					<p className="text-sm font-semibold text-foreground">{question}</p>
					<p
						className={`${SPEAKABLE_VOICE_CLASS} mt-1 text-pretty text-sm leading-relaxed text-muted-foreground`}
					>
						{answer}
					</p>
				</div>
			))}
		</div>
	);
}
