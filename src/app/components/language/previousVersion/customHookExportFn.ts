// NOT USED FOR NOW

export function exportCustomHook<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HookReturnType extends Record<string, any>,
  S extends string,
  P,
>(originHook: (props: P) => HookReturnType, hookId: S) {
  return (props: P) => {
    type UpdatedHookReturnType = {
      [K in keyof HookReturnType as `${typeof hookId}${string & K}`]: HookReturnType[K];
    };

    const originHookReturnValues = originHook(props);

    return Object.fromEntries(
      Object.entries(originHookReturnValues).map(([key, value]) => [
        typeof key === 'string' ? key + hookId : key,
        value,
      ])
    ) as UpdatedHookReturnType;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function transformHookKeys<T extends Record<string, any>>(obj: T, prefix: string) {
  type UpdatedHookReturnType = {
    [K in keyof T as `${typeof prefix}${string & K}`]: T[K];
  };
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [`${prefix}${key}`, value])
  ) as UpdatedHookReturnType;
}
