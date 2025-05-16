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

export type OsSpecificContractInstructions = Record<
	'Linux' | 'MacOS' | 'Windows',
	string[]
>;

export interface DeviceTypeDownloadAlert {
	type: string;
	message: string;
}

export interface DeviceType {
	slug: string;
	name: string;
	logo?: string | null;
	contract?: Record<string, any> | null;

	/** @deprecated */
	imageDownloadAlerts?: DeviceTypeDownloadAlert[];
	instructions?: string[] | OsSpecificContractInstructions;
}
