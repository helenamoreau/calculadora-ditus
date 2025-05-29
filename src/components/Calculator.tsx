import React, { useState } from 'react';
import { ServiceSection } from './ServiceSection';
import { Summary } from './Summary';
import { BudgetDetails } from './BudgetDetails';
import { PaymentOptions } from './PaymentOptions';
import { RecurringPaymentOptions } from './RecurringPaymentOptions';
import { ClientInfoForm } from './ClientInfoForm';
import { servicesData } from '../data/servicesData';
import { SelectedService, PaymentMethod, RecurringPayment, ClientInfo } from '../types';

export const Calculator: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [showBudgetDetails, setShowBudgetDetails] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'pix',
    installments: 1
  });
  const [recurringPayment, setRecurringPayment] = useState<RecurringPayment>({
    method: 'pix',
    dueDate: 5
  });
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    businessName: '',
    contactName: '',
    whatsapp: ''
  });

  const toggleService = (service: SelectedService) => {
    const existingIndex = selectedServices.findIndex(
      s => s.id === service.id && s.category === service.category
    );

    if (existingIndex >= 0) {
      setSelectedServices(prev => prev.filter((_, index) => index !== existingIndex));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const updateServiceOptions = (serviceId: string, category: string, options: Record<string, any>) => {
    setSelectedServices(prev => 
      prev.map(service => 
        service.id === serviceId && service.category === category 
          ? { ...service, options } 
          : service
      )
    );
  };

  const hasRecurringServices = selectedServices.some(service => service.prices.monthly > 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
          Orçamento Personalizado
        </h2>
        <p className="text-white/80">
          Selecione os serviços desejados para calcular o investimento em sua empresa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {servicesData.map((category) => (
            <ServiceSection
              key={category.id}
              category={category}
              selectedServices={selectedServices}
              toggleService={toggleService}
              updateServiceOptions={updateServiceOptions}
            />
          ))}
        </div>
        
        <div className="md:col-span-1">
          <div className="sticky top-4 space-y-6">
            <Summary 
              selectedServices={selectedServices} 
              paymentMethod={paymentMethod}
              clientInfo={clientInfo}
              recurringPayment={recurringPayment}
              showBudgetDetails={() => setShowBudgetDetails(true)}
            />
            
            <PaymentOptions 
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
            
            <RecurringPaymentOptions
              recurringPayment={recurringPayment}
              setRecurringPayment={setRecurringPayment}
              hasRecurringServices={hasRecurringServices}
            />
            
            <ClientInfoForm 
              clientInfo={clientInfo}
              setClientInfo={setClientInfo}
            />
          </div>
        </div>
      </div>

      {showBudgetDetails && (
        <BudgetDetails
          selectedServices={selectedServices}
          paymentMethod={paymentMethod}
          clientInfo={clientInfo}
          recurringPayment={recurringPayment}
          onClose={() => setShowBudgetDetails(false)}
        />
      )}
    </div>
  );
};