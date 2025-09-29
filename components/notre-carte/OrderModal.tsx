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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-full border border-white/20">
        {/* Header */}
        <div className="bg-green-700 text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">COMMANDER</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">Résumé de votre commande</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{orderDetails.item?.name}</span>
                <span>{orderDetails.quantity || 1}x</span>
              </div>
              {orderDetails.variant && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taille: {orderDetails.variant.variantName}</span>
                </div>
              )}
              {orderDetails.base && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Base: {orderDetails.base}</span>
                </div>
              )}
              {orderDetails.ingredients && orderDetails.ingredients.length > 0 && (
                <div className="text-sm text-gray-600">
                  <span>Ingrédients: {orderDetails.ingredients.join(', ')}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>{orderDetails.totalPrice?.toFixed(2) || orderDetails.variant?.price?.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Order Method Selection */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Choisissez votre méthode de commande</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => setOrderMethod('phone')}
                className={`
                  w-full p-4 rounded-lg border-2 transition-colors text-left
                  ${orderMethod === 'phone'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-3">📞</div>
                  <div>
                    <div className="font-medium">Commande téléphonique</div>
                    <div className="text-sm text-gray-600">Appelez directement le restaurant</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setOrderMethod('ubereats')}
                className={`
                  w-full p-4 rounded-lg border-2 transition-colors text-left
                  ${orderMethod === 'ubereats'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-3">🚗</div>
                  <div>
                    <div className="font-medium">Uber Eats</div>
                    <div className="text-sm text-gray-600">Commandez via l'application</div>
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
                className="w-full bg-green-700 text-white py-3 rounded-lg font-medium hover:bg-green-800 transition-colors"
              >
                Appeler le restaurant
              </button>
            ) : (
              <button
                onClick={handleUberEatsOrder}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Ouvrir Uber Eats
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
