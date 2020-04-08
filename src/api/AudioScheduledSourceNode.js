'use strict';

import AudioNode from './AudioNode';

class AudioScheduledSourceNode extends AudioNode {
  get onended() {
    return this._impl.$onended;
  }

  set onended(callback) {
    this._impl.replaceEventListener('ended', this._impl.$onended, callback);
    this._impl.$onended = callback;
  }

  /**
   *
   * @param {number} when
   * @param {number} [offset]
   * @param {number} [duration]
   */
  start(when, offset, duration) {
    this._impl.start(when, offset, duration);
  }

  stop(when) {
    this._impl.stop(when);
  }
}

export default AudioScheduledSourceNode;
