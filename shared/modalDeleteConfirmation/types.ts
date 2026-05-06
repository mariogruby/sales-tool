export interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  error?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "warning";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}