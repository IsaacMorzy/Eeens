export type MailtoField = readonly [label: string, value: string | null | undefined];

export const createMailtoHref = (
	recipient: string,
	subject: string,
	fields: readonly MailtoField[],
): string => {
	const body = fields
		.filter(([, value]) => value)
		.map(([label, value]) => `${label}: ${value}`)
		.join('\n\n');
	return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
