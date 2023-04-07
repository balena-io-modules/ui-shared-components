import { Helmet } from 'react-helmet';

export interface CustomHelmetProps {
	title?: string;
	description?: string;
	properties?: { [key: string]: string };
}

export const CustomHelmet = ({
	title,
	description,
	properties,
}: CustomHelmetProps) => {
	return (
		<Helmet>
			{title && <title>{title}</title>}
			{description && <meta name="description" content={description} />}
			{properties &&
				Object.entries(properties).map(([propertyKey, propertyValue]) => (
					<meta
						key={propertyKey}
						property={propertyKey}
						content={propertyValue}
					/>
				))}
		</Helmet>
	);
};
