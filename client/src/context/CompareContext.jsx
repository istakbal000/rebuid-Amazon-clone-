import { createContext, useState, useEffect } from 'react';

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => {
    const saved = localStorage.getItem('compareItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('compareItems', JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product) => {
    if (compareItems.length >= 3) {
      return { success: false, message: 'You can compare up to 3 products.' };
    }
    
    // Check if same category (optional, but good practice. For now let's just add it, or check if it exists)
    if (compareItems.some(item => item._id === product._id)) {
      return { success: false, message: 'Product is already in comparison.' };
    }
    
    // Optional: enforce same category
    if (compareItems.length > 0 && compareItems[0].category._id !== product.category._id) {
       // return { success: false, message: 'Can only compare products from the same category.' };
       // Let's just allow it for now, or just don't strictly enforce. The instructions say: "The comparison should work correctly for different categories."
    }

    setCompareItems([...compareItems, product]);
    return { success: true };
  };

  const removeFromCompare = (productId) => {
    setCompareItems(compareItems.filter(item => item._id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider value={{
      compareItems,
      addToCompare,
      removeFromCompare,
      clearCompare
    }}>
      {children}
    </CompareContext.Provider>
  );
};
