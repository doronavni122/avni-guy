type YmylDisclaimerProps = {
	className?: string;
};

/** Visible YMYL site-level disclaimer — not personal legal advice. */
export function YmylDisclaimer({ className }: YmylDisclaimerProps) {
	return (
		<p
			className={
				className ??
				'max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground'
			}
			data-ymyl-disclaimer="true"
		>
			הבהרה: התוכן באתר הוא מידע כללי להכנה ולהבנה — אינו ייעוץ משפטי אישי ואינו תחליף
			לייעוץ או ייצוג אחרי בירור עובדות בתיק שלכם.
		</p>
	);
}
