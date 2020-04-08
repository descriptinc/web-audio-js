'use strict';

import * as impl from '../impl';
import EventTarget from './EventTarget';
import AudioDestinationNode from './AudioDestinationNode';
import AudioListener from './AudioListener';
import AudioBuffer from './AudioBuffer';
import AudioBufferSourceNode from './AudioBufferSourceNode';
import ScriptProcessorNode from './ScriptProcessorNode';
import AnalyserNode from './AnalyserNode';
import GainNode from './GainNode';
import DelayNode from './DelayNode';
import BiquadFilterNode from './BiquadFilterNode';
import IIRFilterNode from './IIRFilterNode';
import WaveShaperNode from './WaveShaperNode';
import PannerNode from './PannerNode';
import SpatialPannerNode from './SpatialPannerNode';
import StereoPannerNode from './StereoPannerNode';
import ConvolverNode from './ConvolverNode';
import ConstantSourceNode from './ConstantSourceNode';
import ChannelSplitterNode from './ChannelSplitterNode';
import ChannelMergerNode from './ChannelMergerNode';
import DynamicsCompressorNode from './DynamicsCompressorNode';
import OscillatorNode from './OscillatorNode';
import PeriodicWave from './PeriodicWave';
import * as decoder from '../decoder';
import { defineProp } from '../utils';

class BaseAudioContext extends EventTarget {
  constructor(opts) {
    super();

    defineProp(this, '_impl', new impl.AudioContext(opts));

    this._impl.$destination = new AudioDestinationNode(
      this,
      this._impl.getDestination(),
    );
    this._impl.$listener = new AudioListener(this, this._impl.getListener());
    this._impl.$onstatechange = null;
  }

  get destination() {
    return this._impl.$destination;
  }

  get sampleRate() {
    return this._impl.getSampleRate();
  }

  get currentTime() {
    return this._impl.getCurrentTime();
  }

  get listener() {
    return this._impl.$listener;
  }

  get state() {
    return this._impl.getState();
  }

  resume() {
    return this._impl.resume();
  }

  close() {
    return this._impl.close();
  }

  get onstatechange() {
    return this._impl.$onstatechange;
  }

  set onstatechange(callback) {
    this._impl.replaceEventListener(
      'statechange',
      this._impl.$onstatechange,
      callback,
    );
    this._impl.$onstatechange = callback;
  }

  createBuffer(numberOfChannels, length, sampleRate) {
    return new AudioBuffer({ numberOfChannels, length, sampleRate });
  }

  decodeAudioData(
    audioData,
    successCallback = undefined,
    errorCallback = undefined,
  ) {
    const promise = decoder.decode(audioData, { sampleRate: this.sampleRate });

    promise.then(successCallback, errorCallback);

    return promise;
  }

  createBufferSource() {
    return new AudioBufferSourceNode(this);
  }

  createConstantSource() {
    return new ConstantSourceNode(this);
  }

  createScriptProcessor(
    bufferSize,
    numberOfInputChannels,
    numberOfOutputChannels,
  ) {
    return new ScriptProcessorNode(this, {
      bufferSize,
      numberOfInputChannels,
      numberOfOutputChannels,
    });
  }

  createAnalyser() {
    return new AnalyserNode(this);
  }

  createGain() {
    return new GainNode(this);
  }

  createDelay(maxDelayTime) {
    return new DelayNode(this, { maxDelayTime });
  }

  createBiquadFilter() {
    return new BiquadFilterNode(this);
  }

  createIIRFilter(feedforward, feedback) {
    return new IIRFilterNode(this, { feedforward, feedback });
  }

  createWaveShaper() {
    return new WaveShaperNode(this);
  }

  createPanner() {
    return new PannerNode(this);
  }

  createSpatialPanner() {
    return new SpatialPannerNode(this);
  }

  createStereoPanner() {
    return new StereoPannerNode(this);
  }

  createConvolver() {
    return new ConvolverNode(this);
  }

  createChannelSplitter(numberOfOutputs) {
    return new ChannelSplitterNode(this, { numberOfOutputs });
  }

  createChannelMerger(numberOfInputs) {
    return new ChannelMergerNode(this, { numberOfInputs });
  }

  createDynamicsCompressor() {
    return new DynamicsCompressorNode(this);
  }

  createOscillator() {
    return new OscillatorNode(this);
  }

  createPeriodicWave(real, imag, constraints) {
    return new PeriodicWave(this, { real, imag, constraints });
  }
}

export default BaseAudioContext;
