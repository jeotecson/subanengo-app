import { challengeOptions, challenges } from "@/db/schema"
import { cn } from "@/lib/utils";
import { Card } from "./card";

type Props = {
    options: typeof challengeOptions.$inferInsert[];
    onSelect: (id: number) => void;
    status: 'correct' | 'wrong' | 'none';
    selectedOption?: number;
    disabled?: boolean;
    type: typeof challenges.$inferSelect["type"];
};

export const Challenge = ({options, onSelect, status, selectedOption, disabled, type}: Props) => {
    return (
        <div className={cn( "grid gap-2", type === "ASSIST" && "grid-cols-1", type === "SELECT" && "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]" )}>
            {options.map((option, i) => (
                <Card
                    key={option.id}
                    id={option.id ?? 0} //Remove the ?? 0 if it does not work
                    text={option.text}
                    imageSrc={option.imageSrc ?? null} //Remove the ?? null if it does not work
                    shortcut={`${i + 1}`}
                    selected={selectedOption === option.id}
                    onClick={() => option.id !== undefined && onSelect(option.id)} //Remove
                    status={status}
                    audioSrc={option.audioSrc ?? null} //Remove the ?? null if it does not work
                    disabled={disabled}
                    type={type}
                />
            ))}
        </div>
    )
}