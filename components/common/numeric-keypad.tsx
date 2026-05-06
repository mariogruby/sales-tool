"use client";

import { Button } from "@/components/ui/button";

interface NumericKeypadProps {
    onKeyPress: (key: string) => void;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "←"];

export function NumericKeypad({ onKeyPress }: NumericKeypadProps) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {KEYS.map((key) => (
                <Button
                    key={key}
                    variant="secondary"
                    className="text-xl py-6 border"
                    onClick={() => onKeyPress(key)}
                >
                    {key}
                </Button>
            ))}
            <Button className="col-span-3 bg-destructive" onClick={() => onKeyPress("C")}>
                Limpiar
            </Button>
        </div>
    );
}
