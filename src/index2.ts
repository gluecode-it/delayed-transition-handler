import { EventEmitter } from "events";
import { Events } from "./events";

enum State {
  OFF = "off",
  ON = "on",
  SWITCHING = "switching",
}

enum Event {
  SWITCHING_ON = 'SWITCHING_ON',
  SWITCHING_OFF = 'SWITCHING_OFF'
}

export class DelayedSwitch {
  private emitter: EventEmitter;
  private state: string;
  private delayTimeout:

  constructor(
    private delayMs: number = 0,
  ) {
    this.emitter = new EventEmitter();
    this.state = initState;

    this.onSwitching(() => {
      this.state = State.SWITCHING
    });

    this.on

    this.emitter.on(, () => (this.state = State.STARTED));
    this.emitter.on(Events.STOP, () => (this.state = State.STOPPED));
    this.emitter.on(
      Events.START_SCHEDULED,
      () => (this.state = State.STARTING)
    );
    this.emitter.on(Events.STOP_SCHEDULED, () => (this.state = State.STOPPING));
    this.emitter.on(Events.START_ABORT, () => (this.state = State.STOPPED));
    this.emitter.on(Events.STOP_ABORT, () => (this.state = State.STARTED));
  }

  switch() {
    this.delayTimeout = setTimeout(() => {
      this.startupDelayTimeout = null;
      this.emitter.emit(Events.START);
    }, startDelayMs || this.startDelayMs);

    this.emitter.emit(Event.SWITCHING_ON, this.offState, this.switchingState, this.onState);
  }

  switchOff() {
    this.emitter.emit(Event.SWITCHING_OFF, this.onState, this.switchingState, this.offState);
  }

  onSwitchingStart(callback: (beforeState: string, currentState: string, targetState: string) => void) {
    this.emitter.on(Event.SWITCHING_ON, () => callback);
    this.emitter.on(Event.SWITCHING_OFF, () => callback);
  }

  onSwitchingStart(callback: (beforeState: string, currentState: string, targetState: string) => void) {
    this.emitter.on(Event.SWITCHING_ON, () => callback);
    this.emitter.on(Event.SWITCHING_OFF, () => callback);
  }

  onSwitchingOff(callback: (beforeState: OnState, currentState: SwitchingState, targetState: OffState) => void) {
    this.emitter.on(Event.SWITCHING_OFF, callback)
  }

  
  onSwitched() {}
  onOnState() {}
  onOffState() {}

  abort() {}

  private is(state: State) {
    return this.state === state;
  }

  public getState() {
    return this.state;
  }

  public scheduleStart(startDelayMs?: number): boolean {
    if (!this.is(State.STOPPED)) {
      throw new Error("has to be stopped to be started");
    }

    this.startupDelayTimeout = setTimeout(() => {
      this.startupDelayTimeout = null;
      this.emitter.emit(Events.START);
    }, startDelayMs || this.startDelayMs);
    return this.emitter.emit(Events.START_SCHEDULED);
  }

  public abortStart(): boolean {
    if (!this.is(State.STARTING)) {
      throw new Error("there is no startup scheduled");
    }
    clearTimeout(this.startupDelayTimeout as NodeJS.Timeout);
    this.startupDelayTimeout = null;
    return this.emitter.emit(Events.START_ABORT);
  }

  public onStartScheduled(callback: () => void) {
    this.emitter.on(Events.START_SCHEDULED, callback);
  }

  public onStart(callback: () => void) {
    this.emitter.on(Events.START, callback);
  }

  public onStartAbort(callback: () => void) {
    this.emitter.on(Events.START_ABORT, callback);
  }

  public scheduleStop(stopDelayMs?: number): boolean {
    if (!this.is(State.STARTED)) {
      throw new Error("have to be started to be stopped");
    }

    this.stopDelayTimeout = setTimeout(() => {
      this.stopDelayTimeout = null;
      this.emitter.emit(Events.STOP);
    }, stopDelayMs || this.stopDelayMs);
    return this.emitter.emit(Events.STOP_SCHEDULED);
  }

  public abortStop(): boolean {
    if (!this.is(State.STOPPING)) {
      throw new Error("there is no stop scheduled");
    }
    clearTimeout(this.stopDelayTimeout as NodeJS.Timeout);
    this.stopDelayTimeout = null;
    return this.emitter.emit(Events.STOP_ABORT);
  }

  onStopScheduled(callback: () => void) {
    this.emitter.on(Events.STOP_SCHEDULED, callback);
  }

  onStop(callback: () => void) {
    this.emitter.on(Events.STOP, callback);
  }

  onStopAbort(callback: () => void) {
    this.emitter.on(Events.STOP_ABORT, callback);
  }

  on(event: Events, callback: () => void) {
    this.emitter.on(event, callback);
  }
}
