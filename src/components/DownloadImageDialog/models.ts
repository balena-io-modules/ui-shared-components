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

// the legacy device-type.json format
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
export interface DeviceTypeOptions {
	options: DeviceTypeOptionsGroup[];
	collapsed: boolean;
	isCollapsible: boolean;
	isGroup: boolean;
	message: string;
	name: string;
}
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
	/** @deprecated */
	instructions?:
		| string[]
		| OsSpecificDeviceTypeJsonInstructions
		| OsSpecificContractInstructions;
	/** @deprecated */
	options?: DeviceTypeOptions[];
}
