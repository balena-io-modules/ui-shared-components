type MaybePromise<T> = T | Promise<T>;

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

type Subset<T> = {
	[K in keyof T]: T[K];
};

type MaybePromise<T> = T | Promise<T>;
