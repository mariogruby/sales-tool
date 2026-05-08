"use client";

import { ReactNode } from "react";
import { useMediaQuery } from "@/hooks/ui/use-media-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";

interface ResponsiveModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger?: ReactNode;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    drawerFooter?: ReactNode;
    dialogClassName?: string;
    drawerClassName?: string;
}

export function ResponsiveModal({
    open,
    onOpenChange,
    trigger,
    title,
    description,
    children,
    footer,
    drawerFooter,
    dialogClassName,
    drawerClassName,
}: ResponsiveModalProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className={dialogClassName}>
                <DialogHeader className="text-center">
                    <DialogTitle className="mx-auto">{title}</DialogTitle>
                </DialogHeader>
                {children}
                {footer}
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
            <DrawerContent className={drawerClassName}>
                <DrawerHeader>
                    <DrawerTitle>{title}</DrawerTitle>
                    {description && <DrawerDescription>{description}</DrawerDescription>}
                </DrawerHeader>
                <div className="px-4 pb-6 flex-1">{children}</div>
                {(drawerFooter ?? footer) && (
                    <div className="px-4 pb-4">{drawerFooter ?? footer}</div>
                )}
            </DrawerContent>
        </Drawer>
    );
}
