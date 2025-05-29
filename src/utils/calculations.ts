import { SelectedService, PaymentMethod } from '../types';

export const calculateTotals = (selectedServices: SelectedService[]) => {
  const totals = selectedServices.reduce(
    (acc, service) => {
      // Calculate paid traffic budget if applicable
      const paidTrafficBudget = service.options?.monthlyBudget || 0;

      return {
        entry: acc.entry + (service.prices.entry || 0),
        oneTime: acc.oneTime + (service.prices.oneTime || 0),
        monthly: acc.monthly + (service.prices.monthly || 0),
        paidTraffic: acc.paidTraffic + paidTrafficBudget
      };
    },
    { entry: 0, oneTime: 0, monthly: 0, paidTraffic: 0 }
  );

  // Calculate 5% fee for paid traffic and add it to monthly total
  const paidTrafficFee = totals.paidTraffic * 0.05;

  return {
    ...totals,
    uniqueTotal: totals.entry + totals.oneTime, // Total of one-time payments and entry fees
    monthlyTotal: totals.monthly + paidTrafficFee, // Total monthly recurring payments including paid traffic fee
    paidTrafficTotal: totals.paidTraffic // Total paid traffic budget without fee
  };
};

export const getCreditFeePercentage = (installments: number): number => {
  const fees = {
    1: 4.20,  // à vista
    2: 6.09,
    3: 7.01,
    4: 7.91,
    5: 8.80,
    6: 9.67,
    7: 12.59,
    8: 13.42,
    9: 14.25,
    10: 15.06,
    11: 15.87,
    12: 16.66,
  };

  return fees[installments as keyof typeof fees] || 0;
};

export const calculateFees = (amount: number, paymentMethod: PaymentMethod): number => {
  if (paymentMethod.type === 'pix') {
    return amount;
  }

  const feePercentage = getCreditFeePercentage(paymentMethod.installments);
  return amount * (1 + feePercentage / 100);
};

export const calculateInstallmentValue = (amount: number, installments: number): number => {
  const totalWithFees = amount * (1 + getCreditFeePercentage(installments) / 100);
  return totalWithFees / installments;
};

export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

export const calculateTransportCost = (distance: number): number => {
  return distance * 4; // R$ 4,00 per km
};