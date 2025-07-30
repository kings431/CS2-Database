import React from 'react';

interface SkinViewerFallbackProps {
  model: string;
  skin: string;
  float: number;
  stickers: (string | null)[];
  // New props for screenshot integration
  itemName?: string;
  category?: string;
  wear?: string;
  pattern?: number;
}

const SkinViewerFallback: React.FC<SkinViewerFallbackProps> = ({
  model,
  skin,
  float,
  stickers,
  itemName,
  category,
  wear,
  pattern
}) => {
  const getWearLevel = (float: number) => {
    if (float <= 0.07) return 'Factory New';
    if (float <= 0.15) return 'Minimal Wear';
    if (float <= 0.38) return 'Field-Tested';
    if (float <= 0.45) return 'Well-Worn';
    return 'Battle-Scarred';
  };

  const getWearColor = (float: number) => {
    if (float <= 0.07) return 'text-green-400';
    if (float <= 0.15) return 'text-blue-400';
    if (float <= 0.38) return 'text-yellow-400';
    if (float <= 0.45) return 'text-orange-400';
    return 'text-red-400';
  };

  // Use itemName if provided, otherwise fall back to model and skin
  const displayName = itemName || `${model.toUpperCase()} | ${skin.replace('_', ' ').toUpperCase()}`;
  const wearValue = wear ? parseFloat(wear) : float;

  return (
    <div className="w-full h-[400px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="w-32 h-32 bg-gray-700 rounded-lg mx-auto mb-6 flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
          </svg>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">
          {displayName}
        </h3>
        
        <div className="space-y-2 text-gray-300">
          <p className="text-sm">
            Wear: <span className={getWearColor(wearValue)}>{getWearLevel(wearValue)}</span>
          </p>
          <p className="text-sm">
            Float: <span className="text-blue-400">{wearValue.toFixed(3)}</span>
          </p>
          
          {pattern !== undefined && (
            <p className="text-sm">
              Pattern: <span className="text-purple-400">{pattern}</span>
            </p>
          )}
          
          {category && (
            <p className="text-sm">
              Category: <span className="text-green-400 capitalize">{category}</span>
            </p>
          )}
          
          {stickers.some(sticker => sticker !== null) && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Stickers:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {stickers.map((sticker, index) => 
                  sticker && (
                    <span key={index} className="px-2 py-1 bg-gray-700 rounded text-xs">
                      {sticker.replace('.png', '')}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-xs text-gray-500">
          <p>3D model loading...</p>
          <p>Please ensure model files are available in /public/models/</p>
        </div>
      </div>
    </div>
  );
};

export default SkinViewerFallback; 