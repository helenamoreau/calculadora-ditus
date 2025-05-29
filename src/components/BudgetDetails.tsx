import React, { useRef } from 'react';
import { X, Printer, Mail } from 'lucide-react';
import { SelectedService, PaymentMethod, ClientInfo, RecurringPayment } from '../types';
import { calculateTotals, calculateFees } from '../utils/calculations';
import { getCategoryById } from '../data/servicesData';

interface BudgetDetailsProps {
  selectedServices: SelectedService[];
  paymentMethod: PaymentMethod;
  clientInfo: ClientInfo;
  recurringPayment: RecurringPayment;
  onClose: () => void;
}

export const BudgetDetails: React.FC<BudgetDetailsProps> = ({
  selectedServices,
  paymentMethod,
  clientInfo,
  recurringPayment,
  onClose
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Orçamento Ditus Marketing</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .title { font-size: 20px; margin-bottom: 20px; }
            .service-group { margin-bottom: 15px; }
            .group-title { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
            .service-item { padding: 5px 0; border-bottom: 1px solid #eee; }
            .service-name { font-weight: bold; }
            .option { color: #666; margin-left: 20px; }
            .price { text-align: right; }
            .totals { margin-top: 20px; border-top: 2px solid #ddd; padding-top: 10px; }
            .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
            .total-label { font-weight: bold; }
            .payment-info { margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <div class="footer">
            <p>Ditus Marketing - Av. Paulista, 1636, sala 1504, São Paulo - SP, CEP 01310-200</p>
            <p>© 2025 Ditus Marketing. Todos os direitos reservados.</p>
            <p>Orçamento válido por 10 dias. A entrada é paga no 1º mês; as mensalidades começam no 2º mês.</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const totals = calculateTotals(selectedServices);
  const totalUnique = totals.entry + totals.oneTime;
  const totalWithFees = calculateFees(totalUnique, paymentMethod);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 10);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Detalhes do Orçamento</h2>
          
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center px-3 py-1.5 bg-purple-700 text-white rounded hover:bg-purple-800"
            >
              <Printer size={16} className="mr-1" />
              Imprimir
            </button>
            
            <button
              className="flex items-center px-3 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-800"
            >
              <Mail size={16} className="mr-1" />
              Enviar por Email
            </button>
          </div>
        </div>
        
        <div ref={printRef} className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#5C005C] mb-1">Ditus Marketing</h1>
            <p className="text-xl font-medium text-gray-700">Orçamento Personalizado</p>
            <p className="text-gray-500 mt-2">
              Data: {formatDate(new Date())} | Válido até: {formatDate(expirationDate)}
            </p>
          </div>
          
          {selectedServices.length > 0 ? (
            <>
              <div className="space-y-6 mb-8">
                {Array.from(new Set(selectedServices.map(s => s.category))).map(categoryId => {
                  const categoryServices = selectedServices.filter(s => s.category === categoryId);
                  const category = getCategoryById(categoryId);
                  
                  return (
                    <div key={categoryId} className="border-b pb-4">
                      <h3 className="font-semibold text-lg text-[#5C005C] mb-3 flex items-center">
                        <span className="mr-2">{category?.icon}</span>
                        {category?.name || categoryId}
                      </h3>
                      
                      {categoryServices.map((service, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-800">{service.name}</span>
                            <div className="text-right">
                              {service.prices.oneTime > 0 && (
                                <div className="text-gray-700">
                                  R$ {service.prices.oneTime.toLocaleString('pt-BR', {minimumFractionDigits: 2})} <span className="text-gray-500 text-sm">único</span>
                                </div>
                              )}
                              
                              {service.prices.entry > 0 && (
                                <div className="text-gray-700">
                                  R$ {service.prices.entry.toLocaleString('pt-BR', {minimumFractionDigits: 2})} <span className="text-gray-500 text-sm">entrada</span>
                                </div>
                              )}
                              
                              {service.prices.monthly > 0 && (
                                <div className="text-gray-700">
                                  R$ {service.prices.monthly.toLocaleString('pt-BR', {minimumFractionDigits: 2})} <span className="text-gray-500 text-sm">/mês</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {Object.keys(service.options).length > 0 && (
                            <div className="ml-4 text-sm text-gray-600">
                              {Object.entries(service.options).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span>{key}: {value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor de entrada:</span>
                    <span className="font-medium">
                      {totals.entry > 0 
                        ? `R$ ${totals.entry.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` 
                        : '-'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor único:</span>
                    <span className="font-medium">
                      {totals.oneTime > 0 
                        ? `R$ ${totals.oneTime.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` 
                        : '-'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor mensal:</span>
                    <span className="font-medium">
                      {totals.monthly > 0 
                        ? `R$ ${totals.monthly.toLocaleString('pt-BR', {minimumFractionDigits: 2})}/mês` 
                        : '-'}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-gray-300 pt-3 space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Total único:</span>
                    <span>R$ {totalUnique.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                  </div>
                  
                  {paymentMethod.type === 'credit' && paymentMethod.installments > 1 && (
                    <div className="flex justify-between text-[#5C005C] font-medium">
                      <span>
                        Total com taxas ({paymentMethod.installments}x):
                      </span>
                      <span>
                        R$ {totalWithFees.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                      </span>
                    </div>
                  )}
                  
                  {totals.monthly > 0 && (
                    <div className="flex justify-between font-medium">
                      <span>Mensal recorrente:</span>
                      <span>
                        R$ {totals.monthly.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-600">
                <h4 className="font-semibold text-gray-700 mb-2">Forma de Pagamento:</h4>
                <p>
                  {paymentMethod.type === 'pix' ? (
                    "Pix (sem juros)"
                  ) : (
                    paymentMethod.installments === 1 
                      ? "Cartão de Crédito à vista (+4,20%)" 
                      : `Cartão de Crédito em ${paymentMethod.installments}x`
                  )}
                </p>
                
                <h4 className="font-semibold text-gray-700 mt-4 mb-2">Observações:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Orçamento válido por 10 dias.</li>
                  <li>A entrada é paga no 1º mês; as mensalidades começam no 2º mês.</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum serviço selecionado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};