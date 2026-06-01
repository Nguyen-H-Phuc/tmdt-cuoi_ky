import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const AdminConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Xác nhận hành động', 
  message = 'Bạn có chắc chắn muốn thực hiện hành động này không?', 
  confirmText = 'Xác nhận', 
  cancelText = 'Hủy bỏ',
  type = 'danger' 
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
          confirmBtn: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500',
        };
      case 'info':
        return {
          iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
          confirmBtn: 'bg-blue-650 hover:bg-blue-700 text-white focus:ring-blue-500',
        };
      case 'danger':
      default:
        return {
          iconBg: 'bg-red-50 text-red-650 border border-red-100',
          confirmBtn: 'bg-red-600 hover:bg-red-750 text-white focus:ring-red-600',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-[0px_8px_32px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 p-6 space-y-4">
        
        {/* Header Icon & Title */}
        <div className="flex gap-4 items-start">
          <div className={`p-2.5 rounded-xl shrink-0 ${styles.iconBg}`}>
            <AlertTriangle size={20} />
          </div>
          <div className="grow space-y-1">
            <h3 className="text-sm font-bold text-gray-900 leading-tight">
              {title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              {message}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50 shrink-0 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-250 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer shadow-xs ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminConfirmModal;
