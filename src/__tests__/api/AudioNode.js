'use strict';

import AudioContext from '../../api/BaseAudioContext';

describe('api/AudioNode', () => {
  it('.context', () => {
    const context = new AudioContext();
    const target = context.createGain();

    expect(target.context).toBe(context);
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const context = new AudioContext();
      const target = context.createGain();
      const numberOfInputs = 1;

      target._impl.getNumberOfInputs = jest.fn(() => numberOfInputs);

      expect(target.numberOfInputs).toBe(numberOfInputs);
      expect(target._impl.getNumberOfInputs).toHaveBeenCalledTimes(1);
    });

    it('.numberOfOutputs', () => {
      const context = new AudioContext();
      const target = context.createGain();
      const numberOfOutputs = 1;

      target._impl.getNumberOfOutputs = jest.fn(() => numberOfOutputs);

      expect(target.numberOfOutputs).toBe(numberOfOutputs);
      expect(target._impl.getNumberOfOutputs).toHaveBeenCalledTimes(1);
    });

    it('.channelCount=', () => {
      const context = new AudioContext();
      const target = context.createGain();
      const channelCount1 = 1;
      const channelCount2 = 2;

      target._impl.getChannelCount = jest.fn(() => channelCount1);
      target._impl.setChannelCount = jest.fn();

      expect(target.channelCount).toBe(channelCount1);
      expect(target._impl.getChannelCount).toHaveBeenCalledTimes(1);

      target.channelCount = channelCount2;
      expect(target._impl.setChannelCount).toHaveBeenCalledTimes(1);
      expect(target._impl.setChannelCount.mock.calls[0][0]).toBe(channelCount2);
    });

    it('.channelCountMode=', () => {
      const context = new AudioContext();
      const target = context.createGain();
      const channelCountMode1 = 'max';
      const channelCountMode2 = 'explicit';

      target._impl.getChannelCountMode = jest.fn(() => channelCountMode1);
      target._impl.setChannelCountMode = jest.fn();

      expect(target.channelCountMode).toBe(channelCountMode1);
      expect(target._impl.getChannelCountMode).toHaveBeenCalledTimes(1);

      target.channelCountMode = channelCountMode2;
      expect(target._impl.setChannelCountMode).toHaveBeenCalledTimes(1);
      expect(target._impl.setChannelCountMode.mock.calls[0][0]).toBe(
        channelCountMode2,
      );
    });

    it('.channelInterpretation=', () => {
      const context = new AudioContext();
      const target = context.createGain();
      const channelInterpretation1 = 'max';
      const channelInterpretation2 = 'explicit';

      target._impl.getChannelInterpretation = jest.fn(
        () => channelInterpretation1,
      );
      target._impl.setChannelInterpretation = jest.fn();

      expect(target.channelInterpretation).toBe(channelInterpretation1);
      expect(target._impl.getChannelInterpretation).toHaveBeenCalledTimes(1);

      target.channelInterpretation = channelInterpretation2;
      expect(target._impl.setChannelInterpretation).toHaveBeenCalledTimes(1);
      expect(target._impl.setChannelInterpretation.mock.calls[0][0]).toBe(
        channelInterpretation2,
      );
    });
  });

  describe('methods', () => {
    it('.connect(destination: AudioNode, output, input)', () => {
      const context = new AudioContext();
      const target = context.createGain();
      const destination = context.createGain();
      const output = 0;
      const input = 0;

      target._impl.connect = jest.fn();

      const retVal = target.connect(destination, output, input);

      expect(retVal).toBe(destination);
      expect(target._impl.connect).toHaveBeenCalledTimes(1);
      expect(target._impl.connect.mock.calls[0][0]).toBe(destination._impl);
      expect(target._impl.connect.mock.calls[0][1]).toBe(output);
      expect(target._impl.connect.mock.calls[0][2]).toBe(input);
    });

    it('.connect(destination: AudioParam, output)', () => {
      const context = new AudioContext();
      const target = context.createGain();
      const destination = context.createGain().gain;
      const output = 0;

      target._impl.connect = jest.fn();

      const retVal = target.connect(destination, output);

      expect(retVal).toBe(undefined);
      expect(target._impl.connect).toHaveBeenCalledTimes(1);
      expect(target._impl.connect.mock.calls[0][0]).toBe(destination._impl);
      expect(target._impl.connect.mock.calls[0][1]).toBe(output);
    });

    it('.disconnect(...args) mocked', () => {
      const context = new AudioContext();
      const target = context.createGain();
      const output = 0;

      target._impl.disconnect = jest.fn();

      target.disconnect(output);
      expect(target._impl.disconnect).toHaveBeenCalledTimes(1);
      expect(target._impl.disconnect.mock.calls[0][0]).toBe(output);
    });

    it('.disconnect(...args) real', () => {
      const context = new AudioContext();
      const source = context.createGain();
      const dest = context.destination;

      expect(source._impl.outputs[0].inputs).toHaveLength(0);

      source.connect(dest);

      expect(source._impl.outputs[0].inputs).toHaveLength(1);

      source.disconnect(dest);

      expect(source._impl.outputs[0].inputs).toHaveLength(0);
    });
  });
});
