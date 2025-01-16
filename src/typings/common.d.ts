type MaybePromise<T> = T | Promise<T>;

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
interface Dictionary<T> {
	[key: string]: T;
}

type Subset<T> = {
	[K in keyof T]: T[K];
};

type MaybePromise<T> = T | Promise<T>;
