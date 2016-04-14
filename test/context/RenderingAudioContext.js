"use strict";

const assert = require("power-assert");
const RenderingAudioContext = require("../../src/context/RenderingAudioContext");

describe("RenderingAudioContext", () => {
  it("should return a RenderingAudioContext instance", () => {
    const context = new RenderingAudioContext();

    assert(context instanceof RenderingAudioContext);
  });

  it("should advance current time when rendered", () => {
    const context = new RenderingAudioContext();

    assert(context.currentTime === 0);

    context.processTo("00:00:10.000");
    assert(context.currentTime|0 === 10);

    context.processTo("00:00:15.000");
    assert(context.currentTime|0 === 15);
  });

  it("should export AudioData", () => {
    const context = new RenderingAudioContext();

    context.processTo("00:00:10.000");

    const audioData = context.exportAsAudioData();

    assert(audioData.numberOfChannels === 2);
    assert((audioData.length / audioData.sampleRate)|0 === 10);
    assert(audioData.sampleRate === 44100);
  });

  it("should encode AudioData", () => {
    const context = new RenderingAudioContext();

    const audioData = {
      sampleRate: 44100,
      channelData: [ new Float32Array(16) ]
    };

    return context.encodeAudioData(audioData).then((arrayBuffer) => {
      assert(arrayBuffer instanceof ArrayBuffer);
    });
  });
});