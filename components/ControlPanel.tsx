
import React from 'react';
import { LatentParams } from '../types';

interface Props {
  params: LatentParams;
  setParams: (p: LatentParams) => void;
  prompt: string;
  setPrompt: (s: string) => void;
  onGenerate: () => void;
  disabled: boolean;
}

const ControlPanel: React.FC<Props> = ({ params, setParams, prompt, setPrompt, onGenerate, disabled }) => {
  const updateParam = (key: keyof LatentParams, val: number) => {
    setParams({ ...params, [key]: val });
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-blue-400 uppercase tracking-wider">Latent Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the sonic atmosphere... (e.g., 'A rainy night in Neo-Tokyo with jazz undertones')"
          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none"
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Melodic Entropy', key: 'melodicEntropy', icon: 'fa-wave-square' },
          { label: 'Harmonic Depth', key: 'harmonicDepth', icon: 'fa-layer-group' },
          { label: 'Rhythmic Density', key: 'rhythmicDensity', icon: 'fa-drum' },
          { label: 'Emotional Variance', key: 'emotionalVariance', icon: 'fa-heart-pulse' },
        ].map((item) => (
          <div key={item.key} className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                <i className={`fas ${item.icon} text-blue-500`}></i> {item.label}
              </span>
              <span className="text-xs font-mono text-blue-300">{params[item.key as keyof LatentParams]}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params[item.key as keyof LatentParams]}
              onChange={(e) => updateParam(item.key as keyof LatentParams, parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      <button
        onClick={onGenerate}
        disabled={disabled || !prompt.trim()}
        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
          disabled ? 'bg-gray-800 text-gray-500' : 'bg-blue-600 hover:bg-blue-500 text-white glow-accent shadow-lg shadow-blue-500/20'
        }`}
      >
        {disabled ? (
          <><i className="fas fa-spinner fa-spin"></i> Processing Latent Space...</>
        ) : (
          <><i className="fas fa-microchip"></i> Diffuse Audio Concept</>
        )}
      </button>
    </div>
  );
};

export default ControlPanel;
