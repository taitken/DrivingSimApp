import { Subscription } from "./subscription";

export class EventEmitter<T> {
    constructor(initialVal: T) {
        this.storedVal = initialVal;
        this.subscribers = [];
    }

    private storedVal: T;
    private subscribers: ((newState: T) => void)[];

    public getValue(): T
    {
        return this.storedVal;
    }

    /**
     * Updates the stored value of the EventEmitter, and notifys all listeners by executing their provided callback functions.
     * @param newValue New value to provide to the listeners.
     */
    public update(newValue: T) {
        this.storedVal = newValue;
        this.subscribers.forEach(sub => sub(this.storedVal));
    }

    /**
     *  Listens to updates to the event emitter's value via the Update() method, and executes the provided callback function.
     *  @param func Callback function to execute on value update.
     *  @returns Subscription object that lets the listener unsubscribe to the event emitter. 
     */
    public listenForUpdates(func: (newState: T) => void): Subscription {
        this.subscribers.push(func);
        return new Subscription(func, this.subscribers);
    }

    /**
     * Listens to updates to the event emitter's value via the Update() method, and executes the provided callback function.
     * Executes the provided function with the event emitters stored value immediately.
     * @param func Callback function to execute on value update.
     * @returns Subscription object that lets the listener unsubscribe to the event emitter. 
     */
    public listenForUpdateAndExecuteImmediately(func: (newState: T) => void): Subscription {
        func(this.storedVal);
        return this.listenForUpdates(func);
    }
}