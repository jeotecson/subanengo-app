"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";
import { POINTS_TO_REFILL } from "@/constants";
import { refillHearts } from "@/actions/user-progress";

type Props = {
  hearts: number;
  points: number;
};

export const RefillHeartsButton = ({ hearts, points }: Props) => {
  const [pending, startTransition] = useTransition();

  const onRefillHearts = () => {
    if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
      return;
    }

    startTransition(() => {
      refillHearts()
        .then((res) => {
          if (res?.error === "full") {
            toast.error("Hearts are already full");
          } else if (res?.error === "points") {
            toast.error("Not enough points to refill hearts");
          } else {
            toast.success("Hearts refilled!");
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Button
      onClick={onRefillHearts}
      disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
    >
      {hearts === 5 ? (
        "Full"
      ) : (
        <div className="flex items-center">
          <Image src="/points.png" alt="Points" height={20} width={20} />
          <p className="ml-1">{POINTS_TO_REFILL}</p>
        </div>
      )}
    </Button>
  );
};
