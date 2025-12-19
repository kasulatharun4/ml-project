
export interface LatentParams {
  melodicEntropy: number;
  harmonicDepth: number;
  rhythmicDensity: number;
  emotionalVariance: number;
  diffusionSteps: number;
}

export interface SongStructure {
  title: string;
  genre: string;
  tempo: number;
  key: string;
  mood: string;
  lyrics: {
    verse1: string;
    chorus: string;
    verse2: string;
    bridge: string;
    outro: string;
  };
  instrumentation: string[];
  compositionalAnalysis: string;
}

export interface GenerationState {
  isGenerating: boolean;
  step: 'idle' | 'composing' | 'visualizing' | 'synthesizing' | 'completed';
  error: string | null;
}
