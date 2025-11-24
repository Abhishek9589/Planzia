import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function RatingFormLoadingDialog({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Loading...</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Checking rating eligibility...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
