export {};

declare global {
	// This needs to be a separate interface instead of directly on Window.engagement so that it could merge with whatever the user adds to Window.engagement in their package
	interface Engagement {
		gs: {
			list: () => undefined | Record<string, unknown>;
		};
	}

	interface Window {
		engagement: Engagement;
	}
}
