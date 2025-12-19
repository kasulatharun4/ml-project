
import React from 'react';
import { SongStructure } from '../types';

interface Props {
  song: SongStructure;
  onPlayPreview: (text: string) => void;
  isPlaying: boolean;
}

const SongPreview: React.FC<Props> = ({ song, onPlayPreview, isPlaying }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">{song.title}</h2>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 bg-blue-900/40 border border-blue-500/30 text-blue-400 text-xs rounded-full uppercase font-bold">
              {song.genre}
            </span>
            <span className="px-3 py-1 bg-purple-900/40 border border-purple-500/30 text-purple-400 text-xs rounded-full uppercase font-bold">
              {song.tempo} BPM
            </span>
            <span className="px-3 py-1 bg-green-900/40 border border-green-500/30 text-green-400 text-xs rounded-full uppercase font-bold">
              Key: {song.key}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onPlayPreview(song.lyrics.chorus)}
          disabled={isPlaying}
          className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2 text-sm font-bold"
        >
          {isPlaying ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-play"></i>}
          AI Vocal Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4">
          <Section title="Verse I" content={song.lyrics.verse1} />
          <Section title="Chorus" content={song.lyrics.chorus} highlight />
          <Section title="Verse II" content={song.lyrics.verse2} />
          <Section title="Bridge" content={song.lyrics.bridge} />
          <Section title="Outro" content={song.lyrics.outro} />
        </div>

        <div className="space-y-8">
          <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-blue-900/10 to-transparent">
            <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
              <i className="fas fa-flask"></i> Compositional Analysis
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed italic">
              "{song.compositionalAnalysis}"
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
              <i className="fas fa-guitar"></i> Instrumentation
            </h3>
            <div className="flex flex-wrap gap-2">
              {song.instrumentation.map((inst, i) => (
                <span key={i} className="px-4 py-2 bg-black/40 border border-white/5 rounded-lg text-xs font-mono text-gray-300">
                  {inst}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; content: string; highlight?: boolean }> = ({ title, content, highlight }) => (
  <div className={`p-6 rounded-2xl transition-all ${highlight ? 'bg-blue-600/10 border-l-4 border-blue-500' : 'bg-white/5 border border-white/5'}`}>
    <h4 className={`text-xs font-black uppercase tracking-widest mb-4 ${highlight ? 'text-blue-400' : 'text-gray-500'}`}>
      {title}
    </h4>
    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-serif text-lg">
      {content}
    </p>
  </div>
);

export default SongPreview;
