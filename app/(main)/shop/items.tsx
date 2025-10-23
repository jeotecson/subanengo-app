"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";
import { POINTS_TO_REFILL } from "@/constants";
import { refillHearts } from "@/actions/user-progress"; 
import { enqueueAction } from "@/components/OfflineSyncClient"; 

type Props = {
    hearts: number;
    points: number;
};

export const Items = ({ hearts, points }: Props) => {
    const [pending, startTransition] = useTransition();

    const onRefillHearts = () => {
        if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
            return;
        }

        //This is the offline handling logic
        if (!navigator.onLine) {
            enqueueAction({
                type: "refillHearts",
                payload: {},
            });
            toast("You're offline — purchase saved and will sync later.");
            return;
        }

        //This is the online handling logic
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
        <ul className="w-full">
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
                <Image src="/heart.png" alt="Heart" height={60} width={60}/>
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold">
                        Refill hearts
                    </p>
                </div>
                <Button 
                    onClick={onRefillHearts}
                    disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
                >
                    {hearts === 5 ? "full" : (
                        <div className="flex items-center">
                            <Image 
                                src="/points.png" 
                                alt="Points" 
                                height={20} 
                                width={20}
                            />
                            <p>
                                {POINTS_TO_REFILL}
                            </p>
                        </div>
                    )}
                </Button>
            </div>
        </ul>
    );
};