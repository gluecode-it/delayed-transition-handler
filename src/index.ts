import { EventEmitter } from "events";
import { Events } from "./events";
import { State } from "./state";

export class DelayedTransitionHandler {
  private delayTimeout: NodeJS.Timeout | null;

  private currentState: State = State.STATUS_A;

  constructor(
    private delayMs: number = 0,
    private emitter: EventEmitter = new EventEmitter()
  ) {
    this.delayTimeout = null;
    this.emitter.on(
      Events.TRANSITION_DONE,
      () => (this.currentState = State.STATUS_B)
    );
    //this.emitter.on(Events.TRANSITION_SCHEDULED, () => (this.currentState = State.TRANSITIONING));
    this.emitter.on(
      Events.TRANSITION_ABORT,
      () => (this.currentState = State.STATUS_A)
    );
  }

  public is(stateToCheck: State): boolean {
    return this.currentState === stateToCheck;
  }

  public getState() {
    return this.currentState;
  }

  public scheduleTransition(): boolean {
    if (!this.is(State.STATUS_A)) {
      throw new Error("currentState has to be STATUS_A");
    }

    this.delayTimeout = setTimeout(() => {
      this.delayTimeout = null;
      this.emitter.emit(Events.TRANSITION_DONE);
    }, this.delayMs);
    this.currentState = State.TRANSITIONING;
    return this.emitter.emit(Events.TRANSITION_SCHEDULED);
  }

  public abortTransition(): boolean {
    if (!this.is(State.TRANSITIONING)) {
      throw new Error("there is no transition scheduled");
    }
    clearTimeout(this.delayTimeout as NodeJS.Timeout);
    this.delayTimeout = null;

    return this.emitter.emit(Events.TRANSITION_ABORT);
  }

  public onTransitionScheduled(callback: () => void) {
    this.emitter.on(Events.TRANSITION_SCHEDULED, callback);
  }

  public onceTransitionScheduled(callback: () => void) {
    this.emitter.once(Events.TRANSITION_SCHEDULED, callback);
  }

  public onTransitionFinished(callback: () => void) {
    this.emitter.on(Events.TRANSITION_DONE, callback);
  }

  public onceTransitionFinished(callback: () => void) {
    this.emitter.once(Events.TRANSITION_DONE, callback);
  }

  public onTransitionAborted(callback: () => void) {
    this.emitter.on(Events.TRANSITION_ABORT, callback);
  }

  public onceTransitionAborted(callback: () => void) {
    this.emitter.once(Events.TRANSITION_ABORT, callback);
  }

  public reset() {
    if (!this.is(State.STATUS_B)) {
      throw new Error("could not reset, because state is not B");
    }
    this.currentState = State.STATUS_A;
  }

  public getDelay() {
    return this.delayMs;
  }

  public setDelay(delayMs: number) {
    this.delayMs = delayMs;
  }

  public async waitForTransition(timeoutInMs?: number) {
    return new Promise((resolve, reject) => {
      let handle: NodeJS.Timeout;

      const transitionHandler = () => {
        clearTimeout(handle);
        resolve(this.getState());
      };

      if (timeoutInMs) {
        handle = setTimeout(() => {
          this.emitter.removeListener(
            Events.TRANSITION_DONE,
            transitionHandler
          );
          return reject(this.getState());
        });
      }

      this.onceTransitionFinished(transitionHandler);
    });
  }

  public async waitForAbortion(timeoutInMs?: number) {
    return new Promise((resolve, reject) => {
      let handle: NodeJS.Timeout;

      const transitionHandler = () => {
        clearTimeout(handle);
        resolve(this.getState());
      };

      if (timeoutInMs) {
        handle = setTimeout(() => {
          this.emitter.removeListener(
            Events.TRANSITION_ABORT,
            transitionHandler
          );
          return reject(this.getState());
        });
      }

      this.onceTransitionAborted(transitionHandler);
    });
  }

  public waitForTransitionOrAbortion(timeoutInMs?: number) {
    return new Promise((resolve, reject) => {
      let handle: NodeJS.Timeout;

      const transitionHandler = () => {
        clearTimeout(handle);
        resolve(this.getState());
      };

      if (timeoutInMs) {
        handle = setTimeout(() => {
          this.emitter.removeListener(
            Events.TRANSITION_DONE,
            transitionHandler
          );
          this.emitter.removeListener(
            Events.TRANSITION_ABORT,
            transitionHandler
          );
          return reject(this.getState());
        });
      }

      this.onceTransitionFinished(transitionHandler);
      this.onceTransitionAborted(transitionHandler);
    });
  }
}
