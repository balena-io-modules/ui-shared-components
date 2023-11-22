export const ColorTable = ({ children }: { children: React.ReactNode }) => (
	<table style={{ width: '100%', borderCollapse: 'collapse' }}>
		<thead>
			<tr>
				<th style={{ textAlign: 'left', width: '100px' }}>Color</th>
				<th style={{ textAlign: 'left' }}>Token</th>
				<th style={{ textAlign: 'left' }}>Description</th>
				<th style={{ textAlign: 'left' }}>Variables</th>
			</tr>
		</thead>
		<tbody>{children}</tbody>
	</table>
);

export const colorRow = (
	token: { value: string; name: string },
	description: string,
) => {
	// split pascalcase into lowercase words separated with dots or dashes, and remove first separator
	const formatTokenName = (separator: '.' | '-'): string => {
		return token.name
			.replace(/([A-Z])/g, `${separator}$1`)
			.slice(1)
			.toLowerCase();
	};

	const nameSeparatedWithDots = formatTokenName('.');
	const nameSeparatedWithDashes = formatTokenName('-');

	return (
		<tr>
			<td>
				<div
					style={{
						width: '100%',
						height: '20px',
						backgroundColor: token.value,
					}}
				></div>
			</td>
			<td>
				<strong>{nameSeparatedWithDots}</strong> <br />
			</td>
			<td>{description}</td>
			<td>
				<code className="code">{nameSeparatedWithDots}.value</code> <br />{' '}
				<code className="code">var(--{nameSeparatedWithDashes})</code>
			</td>
		</tr>
	);
};
