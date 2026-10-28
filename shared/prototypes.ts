import Decimal from "decimal.js";
/**
 * 12345678 into 123 456 78
 */
const splitOrders_straight = (str: string, n = 3) => {
  const result = [];
  for (let i = 0; i < str.length; i += n) result.push(str.slice(i, i + n));
  return result.join(" ");
};

/**
 * 12345678 into 12 345 678
 */
const splitOrders_reverse = (str: string, n = 3) => {
  const result = [];
  for (let i = str.length - n; i > -n; i -= n) result.unshift(str.slice(Math.max(0, i), i + n));
  return result.join(" ");
};

const splitOrders = (str: string, n = 3, f = n) => {
  // eslint-disable-next-line prefer-const
  let [integer, fraction, excess] = str.split(".");
  if (excess) return str;
  if (integer === undefined && fraction === undefined) return str;
  if (integer === undefined && fraction !== undefined) return splitOrders_straight(fraction, f);
  if (integer !== undefined && fraction === undefined) return splitOrders_reverse(integer, n);
  if (integer !== undefined && fraction !== undefined)
    return `${splitOrders_reverse(integer, n)}.${splitOrders_straight(fraction, f)}`;
};

export const extendPrototypes = () => {
  if (typeof BigInt.prototype.toJSON !== "function")
    Object.defineProperty(BigInt.prototype, "toJSON", {
      value(this: bigint) {
        return this.toString();
      },
      configurable: true,
      writable: true,
    });
  if (typeof BigInt.prototype.toDecimal !== "function")
    Object.defineProperty(BigInt.prototype, "toDecimal", {
      value(this: bigint, decimals: number) {
        return new Decimal(this).div(10 ** decimals);
      },
      configurable: true,
      writable: true,
    });
  if (typeof String.prototype.toDecimal !== "function")
    Object.defineProperty(String.prototype, "toDecimal", {
      value(this: string, throwOnError: boolean = true) {
        try {
          return new Decimal(this);
        } catch (e) {
          if (throwOnError) throw e;
          return null;
        }
      },
      configurable: true,
      writable: true,
    });
  if (typeof String.prototype.splitOrders !== "function")
    Object.defineProperty(String.prototype, "splitOrders", {
      value(this: string, n = 3, f = n) {
        return splitOrders(this, n, f);
      },
      configurable: true,
      writable: true,
    });
  if (typeof Number.prototype.toDecimal !== "function")
    Object.defineProperty(Number.prototype, "toDecimal", {
      value(this: number) {
        return new Decimal(this);
      },
      configurable: true,
      writable: true,
    });
  if (typeof Array.prototype.upsert !== "function")
    Object.defineProperty(Array.prototype, "upsert", {
      value<T>(this: T[], item: T, cbOrKey: ((item: T) => boolean) | keyof T) {
        if (typeof cbOrKey === "function") {
          const index = this.findIndex(cbOrKey);
          if (index === -1) return this.push(item);
          else return this.splice(index, 1, item);
        }
        if (typeof cbOrKey === "string" || typeof cbOrKey === "number" || typeof cbOrKey === "symbol") {
          const index = this.findIndex((el) => el[cbOrKey] === item[cbOrKey]);
          if (index === -1) return this.push(item);
          else return this.splice(index, 1, item);
        }
        throw new Error("INVALID_CB_OR_KEY");
      },
      configurable: true,
      writable: true,
    });
  if (typeof Array.prototype.prependUpsert !== "function")
    Object.defineProperty(Array.prototype, "prependUpsert", {
      value<T>(this: T[], item: T, cbOrKey: ((item: T) => boolean) | keyof T) {
        if (typeof cbOrKey === "function") {
          const index = this.findIndex(cbOrKey);
          if (index === -1) return this.unshift(item);
          else return this.splice(index, 1, item);
        }
        if (typeof cbOrKey === "string" || typeof cbOrKey === "number" || typeof cbOrKey === "symbol") {
          const index = this.findIndex((el) => el[cbOrKey] === item[cbOrKey]);
          if (index === -1) return this.unshift(item);
          else return this.splice(index, 1, item);
        }
        throw new Error("INVALID_CB_OR_KEY");
      },
      configurable: true,
      writable: true,
    });
};
