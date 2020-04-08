'use strict';

import AudioContext from '../../api/BaseAudioContext';
import AudioDestinationNode from '../../api/AudioDestinationNode';
import AudioListener from '../../api/AudioListener';
import AudioBuffer from '../../api/AudioBuffer';

describe('api/AudioContext', () => {
  describe('attributes', () => {
    it('.destination', () => {
      const target = new AudioContext();

      expect(target.destination instanceof AudioDestinationNode).toBeTruthy();
      expect(target.destination).toBe(target._impl.$destination);
    });

    it('.sampleRate', () => {
      const target = new AudioContext();
      const sampleRate = 44100;

      target._impl.getSampleRate = jest.fn(() => sampleRate);

      expect(target.sampleRate).toBe(sampleRate);
      expect(target._impl.getSampleRate).toHaveBeenCalledTimes(1);
    });

    it('.currentTime', () => {
      const target = new AudioContext();
      const currentTime = 0;

      target._impl.getCurrentTime = jest.fn(() => currentTime);

      expect(target.currentTime).toBe(currentTime);
      expect(target._impl.getCurrentTime).toHaveBeenCalledTimes(1);
    });

    it('.listener', () => {
      const target = new AudioContext();

      expect(target.listener instanceof AudioListener).toBeTruthy();
      expect(target.listener).toBe(target._impl.$listener);
    });

    it('.state', () => {
      const target = new AudioContext();
      const state = 'suspended';

      target._impl.getState = jest.fn(() => state);

      expect(target.state).toBe(state);
      expect(target._impl.getState).toHaveBeenCalledTimes(1);
    });

    it('.onstatechange=', () => {
      const target = new AudioContext();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const callback3 = jest.fn();
      const event = { type: 'statechange' };

      target.onstatechange = callback1;
      target.onstatechange = callback2;
      target.addEventListener('statechange', callback3);
      target._impl.dispatchEvent(event);

      expect(target.onstatechange).toBe(callback2);
      expect(callback1).toHaveBeenCalledTimes(0);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(1);
      expect(callback2.mock.calls[0][0]).toBe(event);
      expect(callback3.mock.calls[0][0]).toBe(event);
    });
  });

  describe('methods', () => {
    it('.resume()', () => {
      const target = new AudioContext();

      target._impl.resume = jest.fn();

      target.resume();
      expect(target._impl.resume).toHaveBeenCalledTimes(1);
    });

    it('.close()', () => {
      const target = new AudioContext();

      target._impl.close = jest.fn();

      target.close();
      expect(target._impl.close).toHaveBeenCalledTimes(1);
    });

    it('.decodeAudioData(audioData)', async () => {
      const target = new AudioContext({ sampleRate: 44100 });
      const audioData = new Uint32Array([
        0x46464952,
        0x0000002c,
        0x45564157,
        0x20746d66,
        0x00000010,
        0x00020001,
        0x0000ac44,
        0x0002b110,
        0x00100004,
        0x61746164,
        0x00000008,
        0x8000c000,
        0x3fff7fff,
      ]).buffer;

      await expect(target.decodeAudioData(audioData)).resolves.toBeInstanceOf(
        AudioBuffer,
      );
    });

    it('.decodeAudioData(audioData, successCallback)', (done) => {
      const target = new AudioContext({ sampleRate: 44100 });
      const audioData = new Uint32Array([
        0x46464952,
        0x0000002c,
        0x45564157,
        0x20746d66,
        0x00000010,
        0x00020001,
        0x0000ac44,
        0x0002b110,
        0x00100004,
        0x61746164,
        0x00000008,
        0x8000c000,
        0x3fff7fff,
      ]).buffer;

      target.decodeAudioData(audioData, (audioBuffer) => {
        expect(audioBuffer instanceof AudioBuffer).toBeTruthy();
        done();
      });
    });
  });
});
