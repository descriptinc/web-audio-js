'use strict';

import AudioSourceNode from './AudioSourceNode';
import { toNumber } from '../utils';

import {
  FINISHED,
  PLAYING,
  SCHEDULED,
  UNSCHEDULED,
} from '../constants/PlaybackState';

class AudioScheduledSourceNode extends AudioSourceNode {
  /**
   * @param {AudioContext} context
   */
  constructor(context, opts) {
    super(context, opts);

    this._startTime = Infinity;
    this._stopTime = Infinity;
    this._startFrame = Infinity;
    this._stopFrame = Infinity;
  }

  /**
   * @return {number}
   */
  getStartTime() {
    if (this._startTime !== Infinity) {
      return this._startTime;
    }
  }

  /**
   * @return {number}
   */
  getStopTime() {
    if (this._stopTime !== Infinity) {
      return this._stopTime;
    }
  }

  /**
   * @return {string}
   */
  getPlaybackState() {
    if (this._startTime === Infinity) {
      return UNSCHEDULED;
    }
    if (this.context.currentTime < this._startTime) {
      return SCHEDULED;
    }
    if (this._stopTime <= this.context.currentTime) {
      return FINISHED;
    }
    return PLAYING;
  }

  /**
   * @param {number} when
   * @param {number} [offset]
   * @param {number} [duration]
   */
  start(when, offset, duration) {
    /* istanbul ignore next */
    if (this._startTime !== Infinity) {
      return;
    }

    when = Math.max(this.context.currentTime, toNumber(when));

    this._startTime = when;
    this._startFrame = Math.round(when * this.sampleRate);

    this.context.sched(when, () => {
      this.outputs[0].enable();
    });
  }

  /**
   * @param {number} when
   */
  stop(when) {
    /* istanbul ignore next */
    if (this._stopTime !== Infinity) {
      return;
    }

    when = Math.max(this.context.currentTime, this._startTime, toNumber(when));

    this._stopTime = when;
    this._stopFrame = Math.round(when * this.sampleRate);
  }
}

export default AudioScheduledSourceNode;
