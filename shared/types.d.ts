import Decimal from "decimal.js";

declare global {
  interface BigInt {
    toJSON(): string;
    toDecimal(decimals: number): Decimal;
  }
  interface String {
    /**
     * @param throwOnError - if true, will throw an error if the conversion fails
     * @default true
     */
    toDecimal<Throw extends boolean = true>(throwOnError?: Throw): Throw extends false ? Decimal | null : Decimal;
    /**
     * @param n - number of digits to split by
     * @default 3,3
     */
    splitOrders(n?: number, f?: number): string;
  }
  interface Number {
    toDecimal(): Decimal;
  }
  interface Array<T> {
    upsert(item: T, cbOrKey: ((item: T) => boolean) | keyof T): number | [T];
    prependUpsert(item: T, cbOrKey: ((item: T) => boolean) | keyof T): number | [T];
  }
}

export {};
