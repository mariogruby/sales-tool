"use client";

import { useEffect, useState } from "react";
import { IRestaurant } from "@/types/restaurant";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Alert,
    // AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { signOut } from "next-auth/react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

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
        securityCode?: string;
        securityCodeEnabled: boolean;
        protectedRoutes: string[];
    }) => Promise<boolean>;
}

const ROUTE_OPTIONS = [
    { label: "Dashboard principal", value: "/dashboard" },
    { label: "Configuración (recomendado)", value: "/dashboard/settings" },
    { label: "Productos (no recomendado restringir)", value: "/dashboard/product" },
    { label: "Mesas (no recomendado restringir)", value: "/dashboard/tables" },
    { label: "Historial de ventas del día", value: "/dashboard/documents/sales-day" },
    { label: "Historial Mensual", value: "/dashboard/documents/monthly-history" },
    { label: "Estadísticas de ventas", value: "/dashboard/analytics" },
    { label: "Gestión de empleados (aún no está en funcionamiento)", value: "/dashboard/team" },
    { label: "Información de perfil", value: "/dashboard/profile" },
];

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
    const [securityCode, setSecurityCode] = useState("");
    const [securityCodeEnabled, setSecurityCodeEnabled] = useState(false);
    const [protectedRoutes, setProtectedRoutes] = useState<string[]>([]);
    const [securityCodeError, setSecurityCodeError] = useState("");

    const handleSecurityCodeChange = (value: string) => {
        // Permitir solo números
        if (/^\d*$/.test(value)) {
            setSecurityCode(value);

            // Validar longitud
            if (value.length !== 6) {
                setSecurityCodeError("El código debe tener 6 números.");
            } else {
                setSecurityCodeError("");
            }
        }
    };

    useEffect(() => {
        if (accountData) {
            setName(accountData.name || "");
            setEmail(accountData.email || "");
            setPhoneNumber(accountData.phoneNumber || "");
            setDirection(accountData.direction || "");
            setSecurityCode(accountData.securityCode || "");
            setSecurityCodeEnabled(accountData.securityCodeEnabled || false);
            setProtectedRoutes(accountData.protectedRoutes || []);
        }
    }, [accountData]);

    const handleCheckboxChange = (route: string, checked: boolean) => {
        if (checked) {
            setProtectedRoutes((prev) => [...prev, route]);
        } else {
            setProtectedRoutes((prev) => prev.filter((r) => r !== route));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const success = await onSubmit({
            name,
            email,
            phoneNumber,
            direction,
            securityCode,
            securityCodeEnabled,
            protectedRoutes,
        });

        if (success) {
            signOut({ callbackUrl: "/sign-in" });
        }
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
            <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
                <Tabs defaultValue="account" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="account">Datos de la cuenta</TabsTrigger>
                        <TabsTrigger value="security">Seguridad</TabsTrigger>
                    </TabsList>

                    {/* Datos de la cuenta */}
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Datos de la cuenta</CardTitle>
                                <CardDescription>
                                    Modifica los datos básicos de tu restaurante.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Nombre</Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Teléfono</Label>
                                    <Input
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
                                    <Label>Dirección</Label>
                                    <Input
                                        value={direction}
                                        onChange={(e) => setDirection(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Seguridad */}
                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Seguridad</CardTitle>
                                <CardDescription>
                                    Gestiona el código de seguridad y las rutas protegidas.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-lg">Código de seguridad</Label>
                                    <InputOTP
                                        maxLength={6}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        value={securityCode}
                                        inputMode="numeric"
                                        onChange={(value) => handleSecurityCodeChange(value)}
                                        disabled={loading}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>

                                    {/* <Input
                                        value={securityCode}
                                        onChange={(e) => handleSecurityCodeChange(e.target.value)}
                                        maxLength={6}
                                        disabled={loading}
                                        placeholder="6 dígitos"
                                        type="tel"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                    /> */}
                                    {securityCodeEnabled && securityCodeError && (
                                        <Alert variant="destructive">
                                            <AlertCircleIcon />
                                            <AlertTitle>{securityCodeError}</AlertTitle>
                                        </Alert>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label className="text-lg">Requerir código de seguridad</Label>
                                    <Switch
                                        checked={securityCodeEnabled}
                                        onCheckedChange={setSecurityCodeEnabled}
                                        disabled={loading}
                                    />
                                </div>

                                {securityCodeEnabled && (
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-muted-foreground font-normal">Selecciona las rutas protegidas</Label>
                                        <div className="flex flex-col gap-2">
                                            {ROUTE_OPTIONS.map((route) => (
                                                <div
                                                    key={route.value}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Checkbox
                                                        id={route.value}
                                                        checked={protectedRoutes.includes(
                                                            route.value
                                                        )}
                                                        onCheckedChange={(checked) =>
                                                            handleCheckboxChange(
                                                                route.value,
                                                                checked === true
                                                            )
                                                        }
                                                        disabled={loading}
                                                    />
                                                    <Label htmlFor={route.value}>
                                                        {route.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
                )}

                {/* Botón */}
                <CardFooter className="flex justify-center p-4">
                    <Button
                        type="submit"
                        disabled={loading || (securityCodeEnabled && securityCodeError !== "")}
                    >
                        {loading ? (
                            <>
                                <Loader2Icon className="animate-spin mr-2" />
                                Guardando...
                            </>
                        ) : (
                            "Guardar Cambios"
                        )}
                    </Button>
                </CardFooter>
            </form>
        </div>
    );
};
