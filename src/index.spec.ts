import { DelayedTransitionHandler } from ".";
import { State } from "./state";

describe("DelayedTransitionHandler", () => {
  beforeEach(() => {});

  it("should be a DelayedTransitionHandler", () => {
    const handler = new DelayedTransitionHandler();
    expect(handler).toBeInstanceOf(DelayedTransitionHandler);
  });

  describe("is()", () => {
    it("should return true, if givenState is currentState", () => {
      const handler = new DelayedTransitionHandler();
      expect(handler.is(State.STATUS_A)).toEqual(true);
    });
  });

  describe("scheduleTransition()", () => {
    it("should throw an error, if the state is not STATUS_A", () => {
      const handler = new DelayedTransitionHandler();
      handler.scheduleTransition();
      expect(() => handler.scheduleTransition()).toThrow(Error);
    });
  });

  describe("onTransitionScheduled()", () => {
    it("should call callback, if transition is scheduled", () => {
      const handler = new DelayedTransitionHandler();
      const callback = jest.fn();
      handler.onTransitionScheduled(callback);
      handler.scheduleTransition();
      expect(callback).toBeCalled();
    });
  });

  describe("onceTransitionScheduled()", () => {
    it("should call callback once, if transition is scheduled", () => {
      const handler = new DelayedTransitionHandler();
      const callback = jest.fn();
      handler.onceTransitionScheduled(callback);
      handler.scheduleTransition();
      expect(callback).toBeCalledTimes(1);
    });
  });

  describe("onTransitionFinished()", () => {
    it("should call callback, if transition is started", (done) => {
      const handler = new DelayedTransitionHandler();
      const callback = jest.fn();
      handler.onTransitionFinished(callback);
      handler.scheduleTransition();
      setTimeout(() => {
        expect(callback).toBeCalled();
        done();
      }, 1);
    });
  });

  describe("onceTransitionFinished()", () => {
    it("should call callback once, if transition is started", (done) => {
      const handler = new DelayedTransitionHandler();
      const callback = jest.fn();
      handler.onceTransitionFinished(callback);
      handler.scheduleTransition();
      handler.onceTransitionFinished(() => {
        handler.onceTransitionFinished(() => {
          expect(callback).toBeCalledTimes(1);
          done();
        });
        handler.reset();
        handler.scheduleTransition();
      });
    });
  });

  describe("getState()", () => {
    it("should be a State", (done) => {
      const handler = new DelayedTransitionHandler();
      handler.scheduleTransition();
      setTimeout(() => {
        expect(handler.getState()).toEqual(State.STATUS_B);
        done();
      }, 1);
    });
  });

  describe("abortTransition()", () => {
    it("should throw an error, if the state is not TRANSITIONING", () => {
      const handler = new DelayedTransitionHandler();
      expect(() => handler.abortTransition()).toThrow(Error);
    });
  });

  describe("onTransitionAbort()", () => {
    it("should call callback, if transition is aborted", () => {
      const handler = new DelayedTransitionHandler();
      const callback = jest.fn();
      handler.onTransitionAborted(callback);
      handler.scheduleTransition();
      handler.abortTransition();
      expect(callback).toBeCalled();
    });
  });

  describe("onceTransitionAbort()", () => {
    it("should call callback once, if transition is started", (done) => {
      const handler = new DelayedTransitionHandler(100);
      const callback = jest.fn();
      handler.onceTransitionAborted(callback);
      handler.onceTransitionScheduled(() => {
        handler.onceTransitionAborted(() => {
          handler.onceTransitionScheduled(() => {
            handler.abortTransition();
            expect(callback).toBeCalledTimes(1);
            done();
          });
          handler.scheduleTransition();
        });
        handler.abortTransition();
      });
      handler.scheduleTransition();
    });
  });

  describe("reset()", () => {
    it("should throw an error, if the state is not B", () => {
      const handler = new DelayedTransitionHandler();
      expect(() => handler.reset()).toThrow(Error);
    });
  });

  describe("reset()", () => {
    it("should change state B to A", (done) => {
      const handler = new DelayedTransitionHandler();
      handler.scheduleTransition();
      handler.onTransitionFinished(() => {
        expect(handler.getState()).toEqual(State.STATUS_B);
        handler.reset();
        expect(handler.getState()).toEqual(State.STATUS_A);
        done();
      });
    });
  });

  describe("setDelay()", () => {
    it("should set the delay", (done) => {
      const handler = new DelayedTransitionHandler();
      const expected = 10;

      expect(handler.getDelay()).toEqual(0);
      handler.setDelay(10);

      expect(handler.getDelay()).toEqual(expected);
      done();
    });
  });
});
