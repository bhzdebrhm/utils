export interface Handler {
    handle: (request: any, controlFeed?: any, oldRequest?: string | number) => any;
    control?: (request: any) => Boolean;
}