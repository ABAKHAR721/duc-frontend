'use client';

import React, { useState } from 'react';
import { ItemData, ItemVariant } from '@/services/itemsService';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: any;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  orderDetails,
}) => {
  const [orderMethod, setOrderMethod] = useState<'phone' | 'ubereats'>('phone');

  if (!isOpen || !orderDetails) return null;

  const handlePhoneOrder = () => {
    // Open phone dialer
    window.location.href = 'tel:+33123456789'; // Replace with actual restaurant phone
    onClose();
  };

  const handleUberEatsOrder = () => {
    // Open Uber Eats link
    window.open('https://www.ubereats.com/restaurant-link', '_blank'); // Replace with actual Uber Eats link
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-md md:w-full border border-white/20 overflow-hidden max-h-[85vh] md:max-h-[90vh]">
        {/* Mobile Drag Handle */}
        <div className="md:hidden flex justify-center py-2 bg-white/95">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 md:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg md:text-xl">🛒</span>
              </div>
              <h2 className="text-lg md:text-xl font-light">Finaliser la commande</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-120px)] md:max-h-none">
          <div className="p-4 md:p-6">
          {/* Order Summary */}
          <div className="mb-8 p-6 rounded-2xl border border-gray-100" style={{ backgroundColor: 'var(--muted)' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <span className="text-orange-500">📋</span>
              Résumé de votre commande
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>{orderDetails.item?.name}</span>
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm font-medium">
                  {orderDetails.quantity || 1}x
                </span>
              </div>
              {orderDetails.variant && (
                <div className="flex justify-between text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <span>Taille:</span>
                  <span className="font-medium">{orderDetails.variant.variantName}</span>
                </div>
              )}
              {orderDetails.base && (
                <div className="flex justify-between text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <span>Base:</span>
                  <span className="font-medium">{orderDetails.base}</span>
                </div>
              )}
              {orderDetails.ingredients && orderDetails.ingredients.length > 0 && (
                <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <span>Ingrédients: </span>
                  <span className="font-medium">{orderDetails.ingredients.join(', ')}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                <span className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Total:</span>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {orderDetails.totalPrice?.toFixed(2) || orderDetails.variant?.price?.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>

          {/* Order Method Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <span className="text-orange-500">🚀</span>
              Comment souhaitez-vous commander ?
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => setOrderMethod('phone')}
                className={`
                  w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left transform hover:scale-[1.02]
                  ${orderMethod === 'phone'
                    ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg'
                    : 'border-gray-200 hover:border-orange-300 bg-white'
                  }
                `}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--foreground)' }}>Commande téléphonique</div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Appelez directement notre équipe</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setOrderMethod('ubereats')}
                className={`
                  w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left transform hover:scale-[1.02]
                  ${orderMethod === 'ubereats'
                    ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg'
                    : 'border-gray-200 hover:border-orange-300 bg-white'
                  }
                `}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-xl">🚗</span>
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--foreground)' }}>Uber Eats</div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Livraison à domicile</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {orderMethod === 'phone' ? (
              <button
                onClick={handlePhoneOrder}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <span className="text-lg">📞</span>
                Appeler maintenant
              </button>
            ) : (
              <button
                onClick={handleUberEatsOrder}
                className="w-full bg-gradient-to-r from-gray-800 to-black text-white py-4 rounded-2xl font-semibold hover:from-gray-900 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <span className="text-lg">🚗</span>
                Ouvrir Uber Eats
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl font-medium transition-all duration-300 border-2"
              style={{ 
                backgroundColor: 'var(--muted)', 
                color: 'var(--muted-foreground)',
                borderColor: 'var(--border)'
              }}
            >
              Annuler
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
