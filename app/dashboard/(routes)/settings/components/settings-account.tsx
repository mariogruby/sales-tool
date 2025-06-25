"use client";

import { useEffect, useState } from "react";
import { IRestaurant } from "@/types/restaurant";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";

interface AccountFormProps {
    accountData: IRestaurant | null;
    loading: boolean;
    loadingData: boolean;
    error?: string;
    onSubmit: (data: {
        name: string;
        email: string;
        phoneNumber?: string;
        direction?: string;
    }) => Promise<boolean>;
}

export const AccountForm = ({
    accountData,
    loading,
    loadingData,
    error,
    onSubmit,
}: AccountFormProps) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [direction, setDirection] = useState("");


    useEffect(() => {
        if (accountData) {
            setName(accountData.name || "");
            setEmail(accountData.email || "");
            setPhoneNumber(accountData.phoneNumber || "");
            setDirection(accountData.direction || "");
        }
    }, [accountData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await onSubmit({
            name,
            email,
            phoneNumber,
            direction,
        });
    };

    if (loadingData) {
        return (
            <div className="flex justify-center items-center">
                <p className="text-muted-foreground">Cargando datos...</p>
            </div>
        );
    }

    if (!accountData) return null;

    return (
        <div className="w-full flex justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-xl">
                        Editar Datos de la Cuenta
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const filtered = value.replace(/[^0-9+\-\s]/g, "");
                                    setPhoneNumber(filtered);
                                }}
                                disabled={loading}
                            />

                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="direction">Dirección</Label>
                            <Input
                                id="direction"
                                value={direction}
                                onChange={(e) => setDirection(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 mt-2">{error}</p>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-center p-4">
                        <Button type="submit" disabled={loading} className="cursor-pointer">
                            {loading ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
