// @flow
export function createEnumValidator<T: {}>(
  enumObj: T
): (val: string) => ?$Keys<T> {
  const enumValues: $ReadOnlyArray<$Keys<T>> = Object.keys(enumObj);
  return function validateEnum(val: string): ?$Keys<T> {
    return enumValues.find(enumValue => val === enumValue);
  };
}

export function validateEnum<T: {}>(enumObj: T, val: string): ?$Keys<T> {
  const enumValues: $ReadOnlyArray<$Keys<T>> = Object.keys(enumObj);
  return enumValues.find(enumValue => val === enumValue);
}
