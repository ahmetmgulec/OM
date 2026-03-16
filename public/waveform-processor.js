/**
 * AudioWorklet processor - captures amplitude samples for waveform display.
 * Replaces deprecated ScriptProcessorNode.
 */
class WaveformCaptureProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, _parameters) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const channel = input[0];
      if (channel) {
        const data = Array.from(channel).map((v) => Math.abs(v));
        this.port.postMessage({ type: 'samples', data });
        // Pass audio through to output - otherwise no sound
        const output = outputs[0];
        if (output && output.length > 0 && output[0]) {
          output[0].set(channel);
        }
      }
    }
    return true;
  }
}

registerProcessor('waveform-capture-processor', WaveformCaptureProcessor);
