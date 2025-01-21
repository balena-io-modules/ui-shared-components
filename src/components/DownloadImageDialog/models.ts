export interface Dictionary<T> {
	[key: string]: T;
}

export type KeysOfUnion<T> = T extends T ? keyof T : never;

export interface WithId {
	id: number;
}

export interface PineDeferred {
	__id: number;
}

export type NavigationResource<T = WithId> = [T] | PineDeferred;
export type OptionalNavigationResource<T = WithId> =
	| []
	| [T]
	| PineDeferred
	| null;

export enum OsTypesEnum {
	DEFAULT = 'default',
	ESR = 'esr',
}

export declare type OsLines =
	| 'next'
	| 'current'
	| 'sunset'
	| 'outdated'
	| undefined;
export interface OsVersion {
	id: number;
	raw_version: string;
	strippedVersion: string;
	basedOnVersion?: string;
	osType: string;
	line?: OsLines;
	variant: string;
	isRecommended?: boolean;
	known_issue_list: string | null;
}
export interface OsVersionsByDeviceType {
	[deviceTypeSlug: string]: OsVersion[];
}

/** @deprecated the legacy device-type.json format */
// TODO: Drop me in the next major
export interface OsSpecificDeviceTypeJsonInstructions {
	linux: string[];
	osx: string[];
	windows: string[];
}

export type OsSpecificContractInstructions = Record<
	'Linux' | 'MacOS' | 'Windows',
	string[]
>;

export interface DeviceTypeDownloadAlert {
	type: string;
	message: string;
}
// TODO: Drop me in the next major
/** @deprecated */
export interface DeviceTypeOptions {
	options: DeviceTypeOptionsGroup[];
	collapsed: boolean;
	isCollapsible: boolean;
	isGroup: boolean;
	message: string;
	name: string;
}
// TODO: Drop me in the next major
/** @deprecated */
export interface DeviceTypeOptionsGroup {
	default: number | string;
	message: string;
	name: string;
	type: string;
	min?: number;
	max?: number;
	docs?: string;
	hidden?: boolean;
	when?: Dictionary<number | string | boolean>;
	choices?: string[] | number[];
	choicesLabels?: Dictionary<string>;
}
export interface DeviceType {
	slug: string;
	name: string;
	logo?: string | null;
	contract?: Record<string, any> | null;

	/** @deprecated */
	imageDownloadAlerts?: DeviceTypeDownloadAlert[];
	instructions?:
		| string[]
		// TODO: Drop me in the next major
		| OsSpecificDeviceTypeJsonInstructions
		| OsSpecificContractInstructions;
	// TODO: Drop me in the next major
	/** @deprecated */
	options?: DeviceTypeOptions[];
}
