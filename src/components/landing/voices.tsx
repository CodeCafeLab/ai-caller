"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Mic } from 'lucide-react';
import { api } from '@/lib/apiConfig';

type ElevenVoice = {
  voice_id: string;
  name: string;
  preview_url?: string;
  labels?: Record<string, string>;
};

export function Voices() {
  const [voices, setVoices] = useState<ElevenVoice[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const avatarMapRef = useRef<Map<string, string>>(new Map());
  const maleIdxRef = useRef(0);
  const femaleIdxRef = useRef(0);

  useEffect(() => {
    async function loadVoices() {
      try {
        const resp = await api.getVoices();
        if (!resp.ok) {
          console.warn('Failed to fetch voices: bad response');
          setVoices([]);
          return;
        }
        const data = await resp.json();
        const list: ElevenVoice[] = (data?.voices || []).slice(0, 10);
        // Assign unique avatars deterministically without repeats
        const malePool = [
          'https://randomuser.me/api/portraits/men/11.jpg',
          'https://randomuser.me/api/portraits/men/22.jpg',
          'https://randomuser.me/api/portraits/men/31.jpg',
          'https://randomuser.me/api/portraits/men/42.jpg',
          'https://randomuser.me/api/portraits/men/53.jpg',
          'https://randomuser.me/api/portraits/men/61.jpg',
          'https://randomuser.me/api/portraits/men/72.jpg',
          'https://randomuser.me/api/portraits/men/83.jpg',
        ];
        const femalePool = [
          'https://randomuser.me/api/portraits/women/12.jpg',
          'https://randomuser.me/api/portraits/women/24.jpg',
          'https://randomuser.me/api/portraits/women/35.jpg',
          'https://randomuser.me/api/portraits/women/44.jpg',
          'https://randomuser.me/api/portraits/women/55.jpg',
          'https://randomuser.me/api/portraits/women/62.jpg',
          'https://randomuser.me/api/portraits/women/73.jpg',
          'https://randomuser.me/api/portraits/women/84.jpg',
        ];
        const femaleNames = new Set(['ava','emma','olivia','sophia','mia','sofia','amelia','isabella','neha','sofia','sofia']);
        const m = avatarMapRef.current;
        let mIdx = maleIdxRef.current;
        let fIdx = femaleIdxRef.current;
        list.forEach(v => {
          if (v.labels?.avatar_url) {
            m.set(v.voice_id, v.labels.avatar_url);
          } else {
            if (!m.has(v.voice_id)) {
              const raw = (v.labels?.gender || v.labels?.voice_gender || '').toString().toLowerCase();
              const nameLower = (v.name || '').toLowerCase();
              const isFemale = raw.includes('female') || raw === 'f' || femaleNames.has(nameLower);
              const url = isFemale
                ? femalePool[fIdx++ % femalePool.length]
                : malePool[mIdx++ % malePool.length];
              m.set(v.voice_id, url);
            }
          }
        });
        maleIdxRef.current = mIdx;
        femaleIdxRef.current = fIdx;
        setVoices(list);
      } catch (e) {
        console.warn('Failed to fetch voices', e);
        setVoices([]);
      }
    }
    loadVoices();
  }, []);

  useEffect(() => {
    const tracks = sectionRef.current?.querySelectorAll<HTMLElement>('.marquee-track');
    if (!tracks) return;
    tracks.forEach(t => (t.style.animationPlayState = playingId ? 'paused' : 'running'));
  }, [playingId]);

  function playVoice(v: ElevenVoice) {
    if (!v.preview_url) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(v.preview_url);
    audioRef.current = audio;
    setPlayingId(v.voice_id);
    audio.play().catch(() => setPlayingId(null));
    audio.onended = () => setPlayingId(null);
    audio.onpause = () => setPlayingId(null);
  }

  function getAvatarUrl(v: ElevenVoice) {
    if (v.labels?.avatar_url) return v.labels.avatar_url;
    const m = avatarMapRef.current;
    return m.get(v.voice_id) || 'https://randomuser.me/api/portraits/men/1.jpg';
  }

  const [rowA, rowB] = useMemo(() => {
    const half = Math.ceil(voices.length / 2);
    return [voices.slice(0, half), voices.slice(half)];
  }, [voices]);
  const dupA = useMemo(() => [...rowA, ...rowA], [rowA]);
  const dupB = useMemo(() => [...rowB, ...rowB], [rowB]);

  const isEmpty = voices.length === 0;

  return (
    <section ref={sectionRef} id="voices" className="pt-6 md:pt-20 pb-6 md:pb-20 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto text-center">
          <div className="flex justify-center mb-3">
            <Mic className="h-10 w-10 text-[#6DD629]" />
          </div>
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-foreground">Voices</h2>
          <p className="mt-4 md:text-lg text-foreground/80">Natural, production-ready voices for different markets.</p>
        </div>
        {isEmpty ? (
          <div className="mt-10 text-center text-foreground/70">
            Voices are loading or temporarily unavailable.
          </div>
        ) : (
        <div className="relative mt-10 overflow-x-hidden overflow-y-visible py-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
          <div className="marquee-track flex gap-6" style={{ width: 'max-content', animationDuration: '80s' }}>
            {dupA.map((v, i) => (
              <div key={v.voice_id + '-' + i} className="min-w-[220px]">
                <div className="rounded-2xl bg-[hsl(33,31%,12%)] border border-[hsl(33,31%,16%)] px-5 py-5 text-foreground shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden bg-[hsl(33,31%,16%)] flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getAvatarUrl(v)} alt={v.name || 'Voice'} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold leading-none">{v.name || 'Voice'}</div>
                      <div className="text-xs text-foreground/70">
                        {v?.labels?.accent || 'Neutral'} · {v?.labels?.language || v?.labels?.language_name || 'Multiple'}
                      </div>
                    </div>
                    <button
                      aria-label="Play sample"
                      onClick={() => playVoice(v)}
                      className={`h-9 w-9 rounded-full flex items-center justify-center ${playingId === v?.voice_id ? 'bg-[#6DD629] text-black' : 'bg-[#FFC012] text-black'} hover:opacity-90`}
                    >
                      {playingId === v?.voice_id ? '■' : '►'}
                    </button>
                  </div>
                  <div className="text-xs text-foreground/75">Use cases: {v?.labels?.use_case || 'General'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
        <div className="relative mt-6 overflow-x-hidden overflow-y-visible py-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
          <div className="marquee-track marquee-reverse flex gap-6 pl-12" style={{ width: 'max-content', animationDuration: '90s' }}>
            {dupB.map((v, i) => (
              <div key={v.voice_id + '-b-' + i} className="min-w-[220px]">
                <div className="rounded-2xl bg-[hsl(33,31%,12%)] border border-[hsl(33,31%,16%)] px-5 py-5 text-foreground shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden bg-[hsl(33,31%,16%)] flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getAvatarUrl(v)} alt={v.name || 'Voice'} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold leading-none">{v.name || 'Voice'}</div>
                      <div className="text-xs text-foreground/70">
                        {v?.labels?.accent || 'Neutral'} · {v?.labels?.language || v?.labels?.language_name || 'Multiple'}
                      </div>
                    </div>
                    <button
                      aria-label="Play sample"
                      onClick={() => playVoice(v)}
                      className={`h-9 w-9 rounded-full flex items-center justify-center ${playingId === v?.voice_id ? 'bg-[#6DD629] text-black' : 'bg-[#FFC012] text-black'} hover:opacity-90`}
                    >
                      {playingId === v?.voice_id ? '■' : '►'}
                    </button>
                  </div>
                  <div className="text-xs text-foreground/75">Use cases: {v?.labels?.use_case || 'General'}</div>
                </div>
              </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}



