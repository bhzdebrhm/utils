import { Handler } from './interfaces';

export class HandleRoundNumber implements Handler {
    public next: Handler | undefined;
    public control?: ((request: any) => Boolean) | undefined;

    constructor(control: ((request: any) => Boolean) | undefined, next?: Handler,) {
        this.next = next;
        this.control = control;
    };


    setNext = (next: Handler) => {
        this.next = next;
    }

    handle = (request: string | number, controlFeed?: any, oldRequest?: any) => {
        oldRequest = oldRequest ? oldRequest : request;
        let handleReturn = request;
        if (this.control && this.control(controlFeed)) {
            handleReturn = Math.round(Number(request));
        };
        if (this.next) {
            return this.next.handle(handleReturn, controlFeed, oldRequest);
        } else {
            return handleReturn
        }
    }
}