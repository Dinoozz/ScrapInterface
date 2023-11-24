import React, { useState, useEffect } from 'react';
import api from '../api/api';

const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
};

const SortIcon = ({ isActive, isAsc }) => {
  return (
    <span className="inline-block ml-1">
      <span className={`inline-block ${isActive && isAsc ? 'text-green-600' : 'text-gray-500'}`}>▲</span>
      <span className={`inline-block ${isActive && !isAsc ? 'text-green-600' : 'text-gray-500'}`}>▼</span>
    </span>
  );
};

const formatValuation = (value) => {
  const num = value ?? 0;
  if (num >= 1e6 && num < 1e9) {
    return `${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
  return `${num.toFixed(2)}`;
};

const HomePage = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getTop100(); // Remplacez par votre appel d'API réel
        setOriginalData(response);
        setCryptoData(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortData = (key, isNumeric) => {
    if (!key || key === 'image' || key === 'symbol') return; // Pas de tri pour 'image' et 'symbol'

    setCryptoData((prevData) => {
      if (sortConfig.key === key && sortConfig.direction === 'desc') {
        setSortConfig({});
        return originalData;
      }

      const sortedData = [...cryptoData].sort((a, b) => {
        let aValue = a[key];
        let bValue = b[key];
    
        if (isNumeric) {
          // Pour les nombres, nous convertissons les chaînes en nombres réels
          aValue = aValue ? parseFloat(aValue.toString().replace(/[\%\$]/g, '')) : 0;
          bValue = bValue ? parseFloat(bValue.toString().replace(/[\%\$]/g, '')) : 0;
        }
    
        if (sortConfig.direction === 'asc') {
          return isNumeric ? aValue - bValue : aValue.localeCompare(bValue);
        } else {
          return isNumeric ? bValue - aValue : bValue.localeCompare(aValue);
        }
      });
      setCryptoData(sortedData);
      setSortConfig({ key, direction: sortConfig.direction === 'asc' && sortConfig.key === key ? 'desc' : 'asc' });

      return sortedData;
    });
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="container mx-auto py-8 px-20">
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 cursor-pointer text-left" onClick={() => sortData('name')}>
                Crypto {<SortIcon isActive={sortConfig.key === 'name'} isAsc={sortConfig.direction === 'asc'} />}
              </th>
              <th className="px-2 cursor-pointer text-center" onClick={() => sortData('current_price', true)}>
                Current Price {<SortIcon isActive={sortConfig.key === 'current_price'} isAsc={sortConfig.direction === 'asc'} />}
              </th>
              <th className="px-2 cursor-pointer text-center" onClick={() => sortData('price_change_percentage_24h', true)}>
                24h % {<SortIcon isActive={sortConfig.key === 'price_change_percentage_24h'} isAsc={sortConfig.direction === 'asc'} />}
              </th>
              <th className="px-2 cursor-pointer text-center" onClick={() => sortData('market_cap_change_percentage_24h', true)}>
                Market Cap Change 24h {<SortIcon isActive={sortConfig.key === 'market_cap_change_percentage_24h'} isAsc={sortConfig.direction === 'asc'} />}
              </th>
              <th className="px-2 cursor-pointer text-center" onClick={() => sortData('fully_diluted_valuation', true)}>
                Fully Diluted Valuation {<SortIcon isActive={sortConfig.key === 'fully_diluted_valuation'} isAsc={sortConfig.direction === 'asc'} />}
              </th>
              <th className="text-center px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((crypto) => (
              <tr key={crypto.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="px-2 flex items-center justify-start h-12">
                  <img src={crypto.image} alt={crypto.name} className="h-6 w-6 mr-2" />
                  <div>
                    <span className="font-medium">{crypto.symbol.toUpperCase()}</span>
                    <span className="text-sm text-gray-500 pl-2">{crypto.name}</span>
                  </div>
                </td>
                <td className="text-center">${crypto.current_price}</td>
                <td className={`text-center ${crypto.price_change_percentage_24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {crypto.price_change_percentage_24h}%
                </td>
                <td className={`text-center ${crypto.market_cap_change_percentage_24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {crypto.market_cap_change_percentage_24h}%
                </td>
                <td className="text-center">{formatValuation(crypto.fully_diluted_valuation)}</td>
                <td className="text-center">
                  {/* <ActionButton crypto={crypto} /> Remplacer par votre composant de bouton d'action */}
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  
  
  
  
};

export default HomePage;
