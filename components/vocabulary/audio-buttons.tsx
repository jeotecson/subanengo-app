"use client";

import { Button } from "@/components/ui/button";

type Props = {
  audioSrc: string;
  slowAudioSrc: string;
};

export const AudioButtons = ({ audioSrc, slowAudioSrc }: Props) => {
  const playAudio = (src: string) => {
    const audio = new Audio(src);
    audio.play();
  };

  return (
    <div className="space-x-2">
      <Button size="sm" onClick={() => playAudio(audioSrc)}>
        ▶️ Normal
      </Button>
      <Button size="sm" onClick={() => playAudio(slowAudioSrc)}>
        🐢 Slow
      </Button>
    </div>
  );
};
