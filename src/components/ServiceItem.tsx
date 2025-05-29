import React, { useState } from 'react';
import { Service, SelectedService } from '../types';

interface ServiceItemProps {
  service: Service;
  category: string;
  isSelected: boolean;
  selectedOptions: Record<string, any>;
  toggleService: (service: SelectedService) => void;
  updateOptions: (options: Record<string, any>) => void;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({
  service,
  category,
  isSelected,
  selectedOptions,
  toggleService,
  updateOptions
}) => {
  const handleToggle = () => {
    toggleService({
      id: service.id,
      name: service.name,
      category,
      options: selectedOptions,
      prices: {
        entry: service.prices.entry || 0,
        monthly: service.prices.monthly || 0,
        oneTime: service.prices.oneTime || 0
      }
    });
  };

  const handleOptionChange = (optionId: string, value: any) => {
    updateOptions({
      ...selectedOptions,
      [optionId]: value
    });
  };

  return (
    <div className={`p-4 rounded-lg transition duration-200 ${
      isSelected 
        ? 'bg-[#5C005C]/30 border border-[#5C005C]/50' 
        : 'bg-[#1a0c20]/40 border border-gray-800/40 hover:border-gray-700/40'
    }`}>
      <div className="flex items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleToggle}
              className="mr-3 h-5 w-5 rounded border-gray-700 text-[#5C005C] focus:ring-[#5C005C]"
            />
            <h4 className="font-medium text-white">{service.name}</h4>
          </div>
          
          <div className="ml-8 text-sm text-white/70 mb-3">
            {service.description}
          </div>

          <div className="ml-8 space-y-3">
            {isSelected && service.options?.map((option) => (
              <div key={option.id} className="text-sm">
                <label className="block text-white/90 mb-1">{option.label}</label>
                
                {option.type === 'select' && (
                  <select
                    className="w-full bg-[#1a0c20] border border-gray-700 rounded px-3 py-2 text-white/90"
                    value={selectedOptions[option.id] || option.default || ''}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  >
                    {option.choices?.map((choice) => (
                      <option key={choice.value} value={choice.value}>
                        {choice.label}
                      </option>
                    ))}
                  </select>
                )}
                
                {option.type === 'number' && (
                  <input
                    type="number"
                    className="w-full bg-[#1a0c20] border border-gray-700 rounded px-3 py-2 text-white/90"
                    value={selectedOptions[option.id] || option.default || 0}
                    onChange={(e) => handleOptionChange(option.id, parseInt(e.target.value, 10))}
                    min={option.min || 0}
                    max={option.max}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-[150px] text-right">
          {service.prices.oneTime > 0 && (
            <div className="mb-1">
              <span className="text-purple-300 font-medium">
                R$ {service.prices.oneTime.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
              </span>
              <span className="text-white/60 text-xs"> único</span>
            </div>
          )}
          
          {service.prices.entry > 0 && (
            <div className="mb-1">
              <span className="text-purple-300 font-medium">
                R$ {service.prices.entry.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
              </span>
              <span className="text-white/60 text-xs"> entrada</span>
            </div>
          )}
          
          {service.prices.monthly > 0 && (
            <div>
              <span className="text-purple-300 font-medium">
                R$ {service.prices.monthly.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
              </span>
              <span className="text-white/60 text-xs">/mês</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};