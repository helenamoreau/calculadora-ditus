import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { TransportInfo } from '../types';

interface TransportCalculatorProps {
  transport: TransportInfo;
  setTransport: React.Dispatch<React.SetStateAction<TransportInfo>>;
}

export const TransportCalculator: React.FC<TransportCalculatorProps> = ({
  transport,
  setTransport
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDistanceChange = (distance: number) => {
    // R$ 4,00 per km (round trip)
    const cost = distance > 0 ? distance * 4 : 0;
    
    setTransport({
      distance,
      cost
    });
  };

  return (
    <div className="rounded-lg overflow-hidden bg-gradient-to-br from-[#2a1333] to-[#1a0c20] shadow-lg transition-all duration-300 ease-in-out">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer bg-gradient-to-r from-[#5C005C]/80 to-transparent hover:from-[#5C005C]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Truck className="mr-3 text-white" size={20} />
          <h3 className="text-xl font-semibold text-white">Transporte</h3>
        </div>
        <div>
          {transport.cost > 0 && (
            <span className="mr-2 text-sm bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded">
              R$ {transport.cost.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </span>
          )}
        </div>
      </div>

      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[300px]' : 'max-h-0'
        }`}
      >
        <div className="p-4">
          <p className="text-white/70 text-sm mb-4">
            Transporte da unidade Ditus: R$ 4,00 por km (ida e volta).
            Distâncias acima de 60 km são negociados à parte, pois podem envolver
            custos adicionais como hospedagem.
          </p>
          
          <div className="mb-4">
            <label className="block text-white/90 text-sm mb-1">
              Distância da sua localização (em km):
            </label>
            <input
              type="number"
              className="w-full bg-[#1a0c20] border border-gray-700 rounded px-3 py-2 text-white"
              value={transport.distance}
              onChange={(e) => handleDistanceChange(Number(e.target.value))}
              min="0"
            />
          </div>
          
          {transport.distance > 0 && (
            <div className="bg-[#5C005C]/20 rounded p-3 text-sm">
              <p className="text-white/80">
                Custo de transporte (ida e volta):
                <span className="text-white font-semibold ml-2">
                  R$ {transport.cost.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </span>
              </p>
              {transport.distance > 60 && (
                <p className="text-white/70 text-xs mt-2">
                  *Para distâncias acima de 60 km, podem ser aplicados custos adicionais.
                  Consulte-nos para mais detalhes.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};