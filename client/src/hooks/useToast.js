import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

const useToast = () => {
  const { toast } = useContext(ToastContext);
  return toast;
};

export default useToast;
