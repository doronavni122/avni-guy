type FormattedDateProps = {
	date: Date;
};

export function FormattedDate({ date }: FormattedDateProps) {
	try {
		return (
			<time dateTime={date.toISOString()}>
				{date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}
			</time>
		);
	} catch (err) {
		console.error('[FormattedDate] format failed', { date, err });
		return <span>{date.toISOString()}</span>;
	}
}
