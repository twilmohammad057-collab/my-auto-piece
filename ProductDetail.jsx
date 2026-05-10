import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductGrid = ({ products }) => {
  const navigate = useNavigate();

  // تنقية النصوص
  const sanitize = (text) => {
    if (!text) return "";
    return text.replace(/\uFFFD/g, '').trim();
  };

  // تحويل الثمن الرقمي
  const formatPrice = (priceText) => {
    if (!priceText) return "Sur devis";
    const cleanPrice = parseFloat(priceText.replace(',', '.'));
    return isNaN(cleanPrice) ? "Sur devis" : `${cleanPrice.toLocaleString()} DH`;
  };

  if (!products || products.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-12 rounded-3xl text-center shadow-2xl my-10 mx-4">
        <h2 className="text-3xl font-black mb-4">Pièce non trouvée ?</h2>
        <p className="text-blue-100 mb-8 text-lg">Nous pouvons chercher n'importe quelle pièce pour vous.</p>
        <button className="bg-white text-blue-900 px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-blue-50 transition-colors">
          Demander un devis spécial
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          onClick={() => navigate(`/product/${product.id}`)} // الربط بصفحة المنتج
          className="group cursor-pointer bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col overflow-hidden"
        >
          {/* حاوية الصورة مع الفلتر */}
          <div className="h-56 bg-gray-50 flex items-center justify-center relative overflow-hidden">
            {product.Image && product.Image.startsWith('http') ? (
              <img 
                src={product.Image} 
                alt={product.Name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="flex flex-col items-center opacity-20 group-hover:opacity-40 transition-opacity">
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <p className="text-[10px] font-black uppercase mt-2 tracking-tighter">Photo en cours</p>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-[10px] font-bold text-gray-600">
              REF: {product.Reference || 'N/A'}
            </div>
          </div>

          {/* تفاصيل المنتج */}
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-black text-gray-900 mb-1">
              {sanitize(product.Marque)} {sanitize(product.Modele)}
            </h3>
            <p className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider italic">
              Année: {sanitize(product.Annee)}
            </p>
            
            <div className="mt-auto">
              <div className="text-2xl font-black text-blue-600 mb-4">
                {formatPrice(product.Prix)}
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation(); // منع فتح صفحة المنتج عند الضغط على الزر
                  window.open(`https://wa.me/212634119267?text=Commande: ${product.Marque} ${product.Modele} (Ref: ${product.Reference})`, '_blank');
                }}
                className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#128C7E] shadow-xl shadow-green-100 transition-all active:scale-95"
              >
                Commander Via WhatsApp
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;