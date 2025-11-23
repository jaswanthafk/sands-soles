
import React from 'react';

// Since we are simulating a Stripe Checkout Redirect for the client-side demo,
// We don't need the inline Elements provider modal anymore.
// Keeping file empty or returning null to satisfy imports until fully cleaned up.

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountKWD: number;
  onSuccess: (details: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = () => {
  return null;
};

export default PaymentModal;
