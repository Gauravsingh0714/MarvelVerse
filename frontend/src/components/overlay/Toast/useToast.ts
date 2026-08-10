import { useToastContext } from './ToastProvider';

export const useToast = () => {
  const context = useToastContext();
  return {
    toast: context.toast,
    dismiss: context.dismiss,
    clearToasts: context.clearToasts,
  };
};
