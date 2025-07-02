/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query"
import { useCheckProtectedRoute } from "@/hooks/account/use-check-protected-route";
import { useAccountContext } from "@/app/context/account-context";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";

type Props = {
    route: string;
    children: React.ReactNode;
};

export function ProtectedRouteGuard({ route, children }: Props) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const { restaurant, loading } = useAccountContext();
    const [authorized, setAuthorized] = useState(false);
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState("");
    const { checkRoute, loading: checking, error } = useCheckProtectedRoute();

    const [checkingAccess, setCheckingAccess] = useState(true);

    useEffect(() => {
        if (!loading && restaurant) {
            const protectedRoutes = restaurant.protectedRoutes || [];
            const securityEnabled = restaurant.securityCodeEnabled;

            if (securityEnabled && protectedRoutes.includes(route)) {
                setAuthorized(false);
                setOpen(true);
            } else {
                setAuthorized(true);
                setOpen(false);
            }

            setCheckingAccess(false);
        }
    }, [loading, restaurant, route]);

    useEffect(() => {
        if (loading) {
            setCheckingAccess(true);
        }
    }, [loading]);

    const verifyCode = async (codeToCheck: string) => {
        if (codeToCheck.length !== 6) return;
        const valid = await checkRoute(codeToCheck, route);
        if (valid) {
            setAuthorized(true);
            setOpen(false);
        } else {
            setCode("");
        }
    };

    useEffect(() => {
        if (code.length === 6) {
            verifyCode(code);
        }
    }, [code]);

    if (checkingAccess) {
        return <div className="p-4 text-center text-muted-foreground">Cargando...</div>;
    }

    if (!authorized && !open) {
        return (
            <div className="p-4 flex flex-col items-center justify-center gap-4 text-muted-foreground text-center">
                <p>No tienes acceso a esta área.</p>
                <Button onClick={() => setOpen(true)}>
                    Ingresar código de acceso
                </Button>
            </div>
        );
    }

    return isDesktop ? (
        <>
            <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            Acceso restringido
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Introduce el código de seguridad para acceder a esta sección
                        </DialogDescription>
                    </DialogHeader>
                    <form className="flex justify-center my-5">
                        <InputOTP
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS}
                            value={code}
                            inputMode="numeric"
                            onChange={(value) => setCode(value)}
                            disabled={checking}
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
                    </form>
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircleIcon />
                            <AlertTitle>Error:</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </DialogContent>
            </Dialog>
            {authorized && children}
        </>
    ) : (
        <>
            <Drawer open={open} onOpenChange={(value) => setOpen(value)}>
                <DrawerContent className="mb-10">
                    <DrawerHeader>
                        <DrawerTitle className="text-center">
                            Acceso restringido
                        </DrawerTitle>
                        <DrawerDescription className="text-center">
                            Introduce el código de seguridad para acceder
                        </DrawerDescription>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircleIcon />
                                <AlertTitle>{error}</AlertTitle>
                            </Alert>
                        )}
                    </DrawerHeader>
                    <form className="flex justify-center my-5">
                        <InputOTP
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS}
                            value={code}
                            inputMode="numeric"
                            onChange={(value) => setCode(value)}
                            disabled={checking}
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
                    </form>
                </DrawerContent>
            </Drawer>
            {authorized && children}
        </>
    );
}
