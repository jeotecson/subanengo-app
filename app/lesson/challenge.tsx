import { challengeOptions, challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Card } from "./card";
import { SentenceScramble } from "@/components/sentence-scramble";

type Props = {
    options: typeof challengeOptions.$inferInsert[];
    onSelect: (id: number) => void;
    status: 'correct' | 'wrong' | 'none';
    selectedOption?: number;
    disabled?: boolean;
    type: typeof challenges.$inferSelect["type"];
};

export const Challenge = ({options, onSelect, status, selectedOption, disabled, type}: Props) => {
    if (type === "SCRAMBLED") {
        return (
            <SentenceScramble
                options={options.map((o, index) => ({
                    id: o.id ?? index,
                    text: o.text || "",
                    order: o.order ?? index + 1,
                }))}
                onSubmit={(userOrder) => {
                    console.log("User order:", userOrder);
                }}
            />
        );
    }

    return (
        <div className={cn(
            "grid gap-2",
            type === "ASSIST" && "grid-cols-1",
            type === "SELECT" && "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
        )}>
            {options.map((option, i) => (
                <Card
                    key={option.id}
                    id={option.id ?? 0}
                    text={option.text}
                    imageSrc={option.imageSrc ?? null}
                    shortcut={`${i + 1}`}
                    selected={selectedOption === option.id}
                    onClick={() => option.id !== undefined && onSelect(option.id)}
                    status={status}
                    audioSrc={option.audioSrc ?? null}
                    disabled={disabled}
                    type={type}
                />
            ))}
        </div>
    );
};
