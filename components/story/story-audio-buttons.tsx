"use client";

import { Button } from "@/components/ui/button";

type Props = {
  audioSrc: string;
};

export const AudioButtons = ({ audioSrc }: Props) => {
  const playAudio = (src: string) => {
    const audio = new Audio(src);
    audio.play();
  };

  return (
    <div className="space-x-2">
      <Button size="sm" onClick={() => playAudio(audioSrc)}>
        Play
      </Button>
    </div>
  );
};
