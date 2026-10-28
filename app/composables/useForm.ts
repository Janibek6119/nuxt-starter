// TYPES HEAVILY BORROWED FROM vee-validate
import Decimal from "decimal.js";
import type { ZodType } from "zod";
/* eslint-disable @typescript-eslint/no-explicit-any */
type Obj = Record<string | number, any>;
type BrowserNativeObject = Date | FileList | File;
type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type IsAny<T> = 0 extends 1 & T ? true : false;
type IsEqual<T1, T2> = T1 extends T2
  ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2
    ? true
    : false
  : false;
type IsTuple<T extends ReadonlyArray<any>> = number extends T["length"] ? false : true;
type ArrayKey = number;
type AnyIsEqual<T1, T2> = T1 extends T2 ? (IsEqual<T1, T2> extends true ? true : never) : never;
type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;
// \

type PathInternalAny = `.${string}` | `[${string}]` | `[${string}].${string}`;
type PathInternalTuple<TValue extends ReadonlyArray<any>, TraversedTypes> = {
  [Key in TupleKeys<TValue> & string]: `[${Key}]` | `[${Key}]${PathInternal<TValue[Key], TraversedTypes, false>}`;
}[TupleKeys<TValue> & string];
type PathInternalArray<TValue extends ReadonlyArray<any>, TraversedTypes> =
  | `.${ArrayKey}`
  | `.${ArrayKey}${PathInternal<TValue[ArrayKey], TraversedTypes, false>}`;
type PathInternalObject<TValue, TraversedTypes, First extends boolean> = {
  [Key in keyof TValue & string]: First extends true
    ? `${Key}` | `${Key}${PathInternal<TValue[Key], TraversedTypes, false>}`
    : `.${Key}` | `.${Key}${PathInternal<TValue[Key], TraversedTypes, false>}`;
}[keyof TValue & string];
/** Stop path recursion at class-backed leaves (see `Decimal`: huge `keyof` blows up `Path<T>` / tsserver). */
type PathInternal<TValue, TraversedTypes, First extends boolean> = TValue extends
  | Primitive
  | BrowserNativeObject
  | Decimal
  ? IsAny<TValue> extends true
    ? PathInternalAny
    : never
  : TValue extends ReadonlyArray<any>
    ? true extends AnyIsEqual<TraversedTypes, TValue>
      ? never
      : IsTuple<TValue> extends true
        ? PathInternalTuple<TValue, TraversedTypes | TValue>
        : PathInternalArray<TValue, TraversedTypes | TValue>
    : TValue extends Record<string, any>
      ? PathInternalObject<TValue, TraversedTypes | TValue, First>
      : "";
type Path<T> = "" | (PathInternal<T, T, true> & string);
type Errors<T> = Map<Path<T>, string>;
type Dirty<T> = Set<Path<T>>;

const isTraversable = (v: unknown): v is Obj =>
  typeof v === "object" && v !== null && !!Object.keys(v).length && !Decimal.isDecimal(v);

function makePathsDeep_member<T extends Obj>(target: T, acc: Path<T>[], prefix?: string): void {
  Object.entries(target).forEach(([k, v]) => {
    const path = prefix !== undefined ? `${prefix}.${k}` : k;
    acc.push(path as Path<T>);
    if (isTraversable(v)) makePathsDeep_member(v, acc, path);
  });
}
function makePathsDeep_top<T extends Obj>(target: T): Set<Path<T>> {
  const acc: Path<T>[] = [""];
  makePathsDeep_member(target, acc);
  return new Set(acc);
}
class EntityZoo {
  id = 1;
  weakMap = new WeakMap<WeakKey, number>();
  getId(obj: unknown): number | null {
    if (!isTraversable(obj)) return null;
    if (!this.weakMap.has(obj)) {
      this.weakMap.set(obj, this.id++);
    }
    return this.weakMap.get(obj)!;
  }
}

function __atPath<T extends Obj>(values: T, path: Path<T>) {
  if (path === "") return values;
  let cur = values;
  const pathParts = path.split(".");
  for (let i = 0; i < pathParts.length; i++) {
    const k = pathParts[i]!;
    if (!isTraversable(cur)) throw new Error(`[_atPath()]: Unexpected leaf before: ${path}:${k}`);
    cur = cur[k];
  }
  return cur;
}

function __watchPath<T extends Obj>(
  unwatchers: Map<Path<T>, () => void>,
  getter: (path: Path<T>) => T,
  action: (path: Path<T>) => unknown,
  path: Path<T>,
) {
  if (unwatchers.has(path)) throw new Error(`[_insertPathWatcher()]: Path watcher already exists: ${path}`);
  unwatchers.set(
    path,
    watch(
      () => getter(path),
      () => {
        action(path);
      },
    ),
  );
}

function __shapeKey<T extends Obj>(entityZoo: EntityZoo, obj: T): string {
  if (isTraversable(obj)) {
    return `{${entityZoo.getId(obj)}|${Object.entries(obj)
      .map(([k, v]) => k + __shapeKey(entityZoo, v))
      .join(",")}}`;
  }
  return "";
}

export function useForm<T extends Obj>(config: {
  initial: T;
  schema: ZodType<unknown, T>;
  submit: (values: T) => Promise<void> | void;
  options?: {
    /** @default true */
    autoDirty?: boolean;
    /** @default true */
    allDirtyOnSubmitAttempt?: boolean;
    /**
     * If the nested object is recreated, should the dirty state be reset to "clean" or "dirty"?
     * - null or undefined: leave as-is
     * @default null
     */
    whenRecreatingNested?: "dirty" | "clean" | null | undefined;
    /** @default true */
    resetOnSubmitSuccess?: boolean;
    /**
     * If true, on submit success keep isSubmitting=true
     * @default false
     */
    openEnded?: boolean;
  };
}) {
  const { initial, schema, submit, options = {} } = config;

  options.autoDirty ??= true;
  options.allDirtyOnSubmitAttempt ??= true;
  options.whenRecreatingNested ??= null;
  options.resetOnSubmitSuccess ??= true;
  options.openEnded ??= false;

  const values = reactive(structuredClone(initial)) as T;
  const _atPath = (path: Path<T>) => __atPath(values, path);
  const _entityZoo = new EntityZoo();
  const _shapeKey = (obj: T) => __shapeKey(_entityZoo, obj);
  const _entityId = (path: Path<T>) => _entityZoo.getId(_atPath(path));
  const _initial = structuredClone(initial);
  const dirty = reactive(new Set<Path<T>>()) as Dirty<T>;
  const touch = (path: Path<T>) => {
    dirty.add("");
    const wholeStack = path.split(".");
    for (let i = 0; i < wholeStack.length; i++) {
      dirty.add(wholeStack.slice(0, i + 1).join(".") as Path<T>);
    }
  };
  const _pathWatchers_closers = new Map<Path<T>, () => void>();
  const _paths = new Map<Path<T>, number | null>();
  makePathsDeep_top(values).forEach((p) => _paths.set(p, _entityId(p)));
  const _watchPath = (path: Path<T>) => __watchPath(_pathWatchers_closers, _atPath, touch, path);
  const isSubmitting = ref(false);

  if (options.autoDirty) _paths.forEach((_, p) => _watchPath(p));
  watch(
    () => _shapeKey(values),
    () => {
      const _new = makePathsDeep_top(values);
      const _removed = _paths
        .keys()
        .filter((p) => !_new.has(p))
        .toArray();
      const _added = _new.difference(_paths);
      _removed.forEach((p) => _paths.delete(p) && dirty.delete(p));
      _added.forEach((p) => _paths.set(p, _entityId(p)));

      // entries() were buggy for some reason here. Switched to forEach()
      const _recreatedPaths: Path<T>[] = [];
      _paths.forEach((entityId, path) => {
        const recreatedEntityId = _entityId(path);
        _paths.set(path, recreatedEntityId);
        if (options.whenRecreatingNested) {
          if (!entityId) return;
          if (!recreatedEntityId) return;
          if (recreatedEntityId === entityId) return;
          _recreatedPaths.push(path);
          const obj = _atPath(path);
          if (isTraversable(obj)) makePathsDeep_member(obj, _recreatedPaths, path);
        }
      });
      if (_recreatedPaths.length)
        nextTick(() => {
          _recreatedPaths.forEach((p) => {
            if (options.whenRecreatingNested === "clean") dirty.delete(p);
            else if (options.whenRecreatingNested === "dirty") dirty.add(p);
          });
        });
      if (options.autoDirty) {
        _removed.forEach((path) => {
          _pathWatchers_closers.get(path)!();
          _pathWatchers_closers.delete(path);
        });
        _added.forEach(_watchPath);
      }
    },
    { flush: "sync" }, // To make this watcher run before those other watchers that it must delete
  );

  const _safeParsed = computed(() => schema.safeParse(values));
  const isValid = computed(() => _safeParsed.value.success);
  const validated = computed<T | null>(() => (isValid.value ? values : null));
  const errorsAll = computed<Errors<T>>(() => {
    const r = _safeParsed.value;
    const _result = new Map<Path<T>, string>();
    if (!r.success)
      r.error.issues.forEach((e) => {
        _result.set(e.path.join(".") as Path<T>, e.message);
      });
    return _result;
  });
  const errors = computed<Errors<T>>(() => new Map(errorsAll.value.entries().filter(([k]) => dirty.has(k))));

  const reset = () => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    for (const k in values) delete values[k];
    Object.assign(values, structuredClone(_initial));
    dirty.clear();
  };

  const onSubmit = async () => {
    if (isSubmitting.value) return;
    if (options.allDirtyOnSubmitAttempt) _paths.keys().forEach((path) => dirty.add(path));
    if (!validated.value) return;
    isSubmitting.value = true;
    try {
      await submit(validated.value);
      if (!options.openEnded) isSubmitting.value = false;
      if (options.resetOnSubmitSuccess) reset();
    } catch (e) {
      isSubmitting.value = false;
      console.log("useForm.onSubmit() ERROR:");
      console.error(e);
      throw e;
    }
  };

  return {
    values,
    errors,
    errorsAll,
    dirty,
    isValid,
    validated,
    reset,
    touch,
    isSubmitting,
    onSubmit,
    _paths,
  };
}
