'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isOpen: boolean;
}

export default function ConfirmDialog({
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isOpen,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-sm">
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 mb-6">{description}</p>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              onConfirm();
              onCancel?.();
            }}
            className="bg-red-600 hover:bg-red-700 flex-1"
          >
            {confirmText}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}
