
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { LatentParams, SongStructure } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateSongConcept = async (prompt: string, params: LatentParams): Promise<SongStructure> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Design a detailed song concept based on the prompt: "${prompt}". 
    Incorporate these latent diffusion parameters:
    - Melodic Entropy (Unpredictability): ${params.melodicEntropy}%
    - Harmonic Depth (Complexity): ${params.harmonicDepth}%
    - Rhythmic Density (Activity): ${params.rhythmicDensity}%
    - Emotional Variance (Contrast): ${params.emotionalVariance}%
    
    The output must be JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          genre: { type: Type.STRING },
          tempo: { type: Type.INTEGER },
          key: { type: Type.STRING },
          mood: { type: Type.STRING },
          lyrics: {
            type: Type.OBJECT,
            properties: {
              verse1: { type: Type.STRING },
              chorus: { type: Type.STRING },
              verse2: { type: Type.STRING },
              bridge: { type: Type.STRING },
              outro: { type: Type.STRING },
            },
            required: ["verse1", "chorus", "verse2", "bridge", "outro"]
          },
          instrumentation: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          compositionalAnalysis: { type: Type.STRING, description: "A technical breakdown of how the latent parameters influenced the composition." }
        },
        required: ["title", "genre", "tempo", "key", "mood", "lyrics", "instrumentation", "compositionalAnalysis"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateAlbumArt = async (prompt: string, song: SongStructure): Promise<string> => {
  const visualPrompt = `Cinematic, hyper-detailed album cover for a song titled "${song.title}". 
  Style: ${song.genre}, ${song.mood}. Visual elements: ${song.instrumentation.join(', ')}. 
  Concept: ${prompt}. Aesthetic: Ethereal, latent diffusion patterns, abstract sonic waves. High quality 4k.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: visualPrompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  return 'https://picsum.photos/1024/1024?grayscale';
};

export const generateVocalPreview = async (text: string, voiceName: 'Kore' | 'Puck' | 'Zephyr' = 'Kore'): Promise<ArrayBuffer> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read these lyrics with the appropriate emotion: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Audio generation failed");

  // Manual decode for raw PCM
  const binaryString = atob(base64Audio);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};
