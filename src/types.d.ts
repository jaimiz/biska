export type Maybe<T> = NonNullable<T> | undefined;
export type Optional<T> = T extends null ? never : T | undefined;
export type Some<T> = T extends null ? never : NonNullable<T>;
