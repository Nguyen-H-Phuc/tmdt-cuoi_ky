import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const AdminModal = ({
  isOpen = false,
  onClose,
  title = '',
  children,
  footer = null,
  size = 'md' // sm, md, lg, xl
}) => {

  // Listen to escape key press to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock scrolling on document body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl'
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div className={`relative w-full bg-white rounded-2xl border border-gray-150 shadow-2xl overflow-hidden flex flex-col z-10 transition-all duration-300 animate-in fade-in zoom-in-95 ${selectedSize}`}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm md:text-base font-bold text-gray-950 font-display">
            {title}
          </h3>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-55 text-gray-500 hover:text-gray-900 transition-colors focus:outline-none cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 overflow-y-auto max-h-[70vh] text-xs md:text-sm text-gray-650 leading-relaxed scrollbar-thin">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40 flex items-center justify-end gap-3 flex-wrap">
            {footer}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminModal;
