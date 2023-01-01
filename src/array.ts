export function getLastItem<T>(array: T[]): T | undefined {
  const length = array == null ? 0 : array.length
  return length ? array[length - 1] : undefined
}


interface eventExistsArgs {
  event: Record<string, unknown>,
  events?: Array<any>,
  key: string,
  onExist?: (event: any) => void,
  onNotExist?: (event: any) => void
}


export const eventExists = (
  args: eventExistsArgs
) => {
  if (!args?.events) return args.event;
  const exist = args?.events.some((e) => e?.[args?.key] === args?.event?.[args?.key]);
  if (exist) {
    args?.onExist && args?.onExist(args?.event)
  } else {
   return args?.onNotExist && args?.onNotExist(args?.event)
  };
  if (exist) {
    return args?.event
  }
}



export const symmetricDifference = (array1: any, array2: any) => {
  return array1
    .filter((x: any) => !array2.includes(x))
    .concat(array2.filter((x: any) => !array1.includes(x)));
}