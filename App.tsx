
import React, { useState, useCallback, useRef } from 'react';
import ControlPanel from './components/ControlPanel';
import SongPreview from './components/SongPreview';
import { generateSongConcept, generateAlbumArt, generateVocalPreview } from './services/geminiService';
import { LatentParams, SongStructure, GenerationState } from './types';
import { decodeAudioData } from './utils/audio';

const App: React.FC = () => {
  const [params, setParams] = useState<LatentParams>({
    melodicEntropy: 45,
    harmonicDepth: 60,
    rhythmicDensity: 50,
    emotionalVariance: 70,
    diffusionSteps: 50,
  });
  const [prompt, setPrompt] = useState('');
  const [song, setSong] = useState<SongStructure | null>(null);
  const [albumArt, setAlbumArt] = useState<string | null>(null);
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    step: 'idle',
    error: null,
  });
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleGenerate = async () => {
    setState({ isGenerating: true, step: 'composing', error: null });
    setSong(null);
    setAlbumArt(null);

    try {
      // Step 1: Generate Lyrics & Structure
      const songData = await generateSongConcept(prompt, params);
      setSong(songData);
      
      setState(prev => ({ ...prev, step: 'visualizing' }));
      
      // Step 2: Generate Album Art
      const artUrl = await generateAlbumArt(prompt, songData);
      setAlbumArt(artUrl);

      setState({ isGenerating: false, step: 'completed', error: null });
    } catch (err: any) {
      console.error(err);
      setState({ isGenerating: false, step: 'idle', error: err.message || 'Latent space collapse. Please try again.' });
    }
  };

  const playVocalPreview = async (text: string) => {
    try {
      setIsAudioPlaying(true);
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioBufferData = await generateVocalPreview(text);
      const audioBuffer = await decodeAudioData(audioBufferData, audioContextRef.current);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsAudioPlaying(false);
      source.start();
    } catch (err) {
      console.error("Audio playback error:", err);
      setIsAudioPlaying(false);
    }
  };

  return (
    <div className="min-h-screen latent-gradient pb-24">
      <header className="py-8 px-6 border-b border-white/5 flex justify-between items-center sticky top-0 z-50 glass-panel">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white glow-accent">
            <i className="fas fa-compact-disc text-xl animate-spin-slow"></i>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase">DiffuSong</h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Latent Audio Architect v3.0</p>
          </div>
        </div>
        <div className="hidden md:flex gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          <span className="hover:text-blue-400 cursor-pointer transition-colors">Neural Engines</span>
          <span className="hover:text-blue-400 cursor-pointer transition-colors">Spectral Nodes</span>
          <span className="hover:text-blue-400 cursor-pointer transition-colors">Archive</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          {/* Left Side: Controls & Art */}
          <div className="xl:col-span-4 space-y-8">
            <ControlPanel
              params={params}
              setParams={setParams}
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerate}
              disabled={state.isGenerating}
            />

            {state.isGenerating && (
              <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-brain text-blue-500 text-2xl"></i>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white capitalize">{state.step}...</h3>
                  <p className="text-xs text-gray-500 mt-1">Interpreting multi-modal embeddings</p>
                </div>
              </div>
            )}

            {albumArt && !state.isGenerating && (
              <div className="glass-panel p-3 rounded-2xl overflow-hidden animate-in zoom-in duration-500 glow-accent border-blue-500/30">
                <img src={albumArt} alt="AI Generated Cover Art" className="w-full h-auto rounded-xl object-cover shadow-2xl" />
                <div className="p-3">
                   <p className="text-[10px] text-gray-500 font-mono uppercase text-center tracking-widest">Spectral Manifestation Alpha-1</p>
                </div>
              </div>
            )}

            {state.error && (
              <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-sm flex items-start gap-3">
                <i className="fas fa-exclamation-triangle mt-1"></i>
                <p>{state.error}</p>
              </div>
            )}
          </div>

          {/* Right Side: Result Display */}
          <div className="xl:col-span-8">
            {song ? (
              <SongPreview
                song={song}
                onPlayPreview={playVocalPreview}
                isPlaying={isAudioPlaying}
              />
            ) : !state.isGenerating && (
              <div className="h-[600px] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center p-12 opacity-50">
                <i className="fas fa-wave-square text-6xl text-gray-800 mb-6"></i>
                <h2 className="text-2xl font-bold text-gray-600">Awaiting Diffusion Input</h2>
                <p className="text-gray-700 max-w-sm mt-2 text-sm">
                  Configure the latent parameters and provide a descriptive prompt to synthesize a new sonic architecture.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
