'use strict';

import config from '../config';
import BaseAudioContext from '../api/BaseAudioContext';
import {
  toValidBlockSize,
  toValidNumberOfChannels,
  toValidSampleRate,
} from '../utils';
import AudioContext from '../impl/AudioContext';
import AudioData from '../impl/core/AudioData';
import AudioBuffer from '../api/AudioBuffer';

export class RawDataAudioContext extends BaseAudioContext {
  readonly _impl!: AudioContext;
  public readonly blockSize: number;
  public readonly numberOfChannels: number;

  constructor({
    sampleRate = config.sampleRate,
    blockSize = config.blockSize,
    numberOfChannels = config.numberOfChannels,
  }: {
    sampleRate?: number;
    blockSize?: number;
    numberOfChannels?: number;
  } = {}) {
    sampleRate = toValidSampleRate(sampleRate);
    blockSize = toValidBlockSize(blockSize);
    numberOfChannels = toValidNumberOfChannels(numberOfChannels);

    super({ sampleRate, blockSize, numberOfChannels });

    this.blockSize = blockSize;
    this.numberOfChannels = numberOfChannels;
  }

  suspend() {
    return this._impl.suspend();
  }

  createAudioBuffer(
    length: number,
    sampleRate: number,
    channels: Float32Array[],
  ): AudioBuffer {
    return new AudioBuffer(
      new AudioData(channels.length, length, sampleRate, channels),
    );
  }

  process(channelBuffers: Float32Array[], offset: number = 0): void {
    this._impl.process(channelBuffers, offset);
  }
}
