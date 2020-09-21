import { DelayedStartStopHandler } from ".";
import { State } from "./state";
import { Events } from "./events";

describe("VoiceChannelObserver", () => {
  beforeEach(() => {});

  describe("to be defined", () => {
    it("with no users", () => {
      const handler = new DelayedStartStopHandler();
      expect(handler).toBeDefined();
    });

    it("should start on status STOPPED if nothing is given", () => {
      const handler = new DelayedStartStopHandler();
      expect(handler.getState()).toEqual(State.STOPPED);
    });

    it("should start on status STARTED if STARTED was given", () => {
      const handler = new DelayedStartStopHandler(0, 0, State.STARTED);
      expect(handler.getState()).toEqual(State.STARTED);
    });
  });

  it(`if event ${Events.START} emitted, status should be ${State.STARTED}`, (done) => {
    const handler = new DelayedStartStopHandler(0, 0, State.STOPPED);
    handler.on(Events.START, () =>
      setTimeout(() => {
        expect(handler.getState() === State.STARTED);
        done();
      }, 5)
    );
    handler.scheduleStart();
  });

  describe("scheduleStart", () => {
    describe("should throw a exception", () => {
      Object.keys(State)
        .filter((state) => state !== State.STOPPED)
        .forEach((state) => {
          it(`if state is ${state}`, () => {
            const handler = new DelayedStartStopHandler(0, 0, state as State);
            expect(() => handler.scheduleStart()).toThrowError(
              "has to be stopped to be started"
            );
          });
        });
    });

    it(`should emit ${Events.START_SCHEDULED} if state is ${State.STOPPED}`, () => {
      const handler = new DelayedStartStopHandler(0, 0, State.STOPPED);
      const callback = jest.fn();
      handler.onStartScheduled(callback);
      handler.scheduleStart();
      expect(callback).toBeCalled();
    });

    it(`should emit ${Events.START} if state is ${State.STOPPED}`, (done) => {
      const handler = new DelayedStartStopHandler(1, 1, State.STOPPED);
      const callback = jest.fn();
      handler.onStart(callback);
      handler.scheduleStart(5);
      setTimeout(() => {
        expect(callback).toBeCalled();
        done();
      }, 10);
    });

    it(`should emit ${Events.START_SCHEDULED} if state is ${State.STOPPED}`, (done) => {
      const handler = new DelayedStartStopHandler(1, 1, State.STOPPED);
      const callback = jest.fn();
      handler.onStartScheduled(callback);
      handler.scheduleStart(5);
      setTimeout(() => {
        expect(callback).toBeCalled();
        done();
      }, 10);
    });

    it(`should emit ${Events.STOP_SCHEDULED} if state is ${State.STARTED}`, (done) => {
      const handler = new DelayedStartStopHandler(1, 1, State.STARTED);
      const callback = jest.fn();
      handler.onStopScheduled(callback);
      handler.scheduleStop(5);
      setTimeout(() => {
        expect(callback).toBeCalled();
        done();
      }, 10);
    });

    it(`should emit ${Events.STOP} if scheduleStop() is called`, (done) => {
      const handler = new DelayedStartStopHandler(1, 1, State.STARTED);
      const callback = jest.fn();
      handler.onStop(callback);
      handler.scheduleStop(5);
      setTimeout(() => {
        expect(callback).toBeCalled();
        done();
      }, 10);
    });

    it(`should emit ${Events.STOP_ABORT} if abortStop() is called`, (done) => {
      const handler = new DelayedStartStopHandler(1, 1, State.STOPPING);
      const callback = jest.fn();
      handler.onStopAbort(callback);
      handler.abortStop();
      setTimeout(() => {
        expect(callback).toBeCalled();
        done();
      }, 10);
    });
  });

  describe("abortStart", () => {
    describe("should throw a exception", () => {
      Object.keys(State)
        .filter((state) => state !== State.STARTING)
        .forEach((state) => {
          it(`if state is ${state}`, () => {
            const handler = new DelayedStartStopHandler(0, 0, state as State);
            expect(() => handler.abortStart()).toThrowError(
              "there is no startup scheduled"
            );
          });
        });
    });

    it(`should emit ${Events.START_ABORT} if state is ${State.STARTING}`, () => {
      const handler = new DelayedStartStopHandler(0, 0, State.STARTING);
      const callback = jest.fn();
      handler.onStartAbort(callback);
      handler.abortStart();
      expect(callback).toBeCalled();
    });
  });

  describe("scheduleStop", () => {
    describe("should throw a exception", () => {
      Object.keys(State)
        .filter((state) => state !== State.STARTED)
        .forEach((state) => {
          it(`if state is ${state}`, () => {
            const handler = new DelayedStartStopHandler(0, 0, state as State);
            expect(() => handler.scheduleStop()).toThrowError(
              "have to be started to be stopped"
            );
          });
        });
    });

    describe("", () => {});
  });
});
