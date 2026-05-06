"use client";

import { useEffect, useRef } from "react";
import { ConfirmModalProps } from "./types";
import { useMediaQuery } from "@/hooks/use-media-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  // DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";

export default function ModalDeleteConfirmation({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "destructive",
  loading = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  const isDestructive = variant === "destructive";

  return isDesktop ?(
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon />
              <AlertTitle>Error:</AlertTitle>
              <AlertDescription className="text-center">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center items-center space-x-2">
            <Button onClick={onCancel} disabled={loading} variant="outline">
              {cancelLabel}
            </Button>

            <Button
              ref={confirmRef}
              onClick={onConfirm}
              disabled={loading}
              variant={isDestructive ? "destructive" : "default"}
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={onCancel}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">{title}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon />
              <AlertTitle>Error:</AlertTitle>
              <AlertDescription className="text-center">
                {error}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col justify-center items-center space-x-2 gap-2 w-full">
            <Button onClick={onCancel} disabled={loading} variant="outline" className="w-full">
              {cancelLabel}
            </Button>
            <Button
              ref={confirmRef}
              onClick={onConfirm}
              disabled={loading}
              variant={isDestructive ? "destructive" : "default"}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
