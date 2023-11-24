import React, { useState, useEffect } from 'react';
import api from '../api/api';
import CreateCryptoButton from '../components/CreateCryptoButton';
import DeleteCryptoButton from '../components/DeleteCryptoButton';


const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
};

const SortIcon = ({ isActive, isAsc }) => {
  console.log("isactive :");
  console.log(isActive);
  console.log("isAsc :");
  console.log(isAsc);
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
  const [allCryptos, setAllCryptos] = useState([]);


  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const top100Response = await api.getTop100();
        const allCryptosResponse = await api.getAllCryptos();
        setCryptoData(top100Response);
        setOriginalData(top100Response); // Sauvegarde des données originales
        setAllCryptos(allCryptosResponse);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const isCryptoInAllCryptos = (crypto) => {
    return allCryptos.some((c) => c.name === crypto.name);
  };

  const handleCreateCryptoResult = async (success, data) => {
    if (success) {
      // Ajoute la crypto nouvellement créée à la liste allCryptos
      setAllCryptos([...allCryptos, data]);
    }
    // Gérez le résultat ici, par exemple, mise à jour de l'état ou affichage d'un message
  };

  const handleDeleteCryptoResult = (success, data, cryptoId) => {
    if (success) {
      // Supprime la crypto de la liste allCryptos
      setAllCryptos(allCryptos.filter((c) => c._id !== cryptoId));
    }
  };

  const sortData = (key, isNumeric) => {
  
    if (!key || key === 'image' || key === 'symbol') {
      return; // Pas de tri pour 'image' et 'symbol'
    }
  
    let newSortConfig = { ...sortConfig };
    if (sortConfig.key === key) {
      newSortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : sortConfig.direction === 'desc' ? null : 'asc';
    } else {
      newSortConfig = { key, direction: 'asc' };
    }
  
    if (newSortConfig.direction === null) {
      setSortConfig(newSortConfig);
      setCryptoData([...originalData]);
    } else {
      const sortedData = [...cryptoData].sort((a, b) => {
        let aValue = a[key];
        let bValue = b[key];
    
        if (isNumeric) {
          aValue = aValue ? parseFloat(aValue.toString().replace(/[\%\$]/g, '')) : 0;
          bValue = bValue ? parseFloat(bValue.toString().replace(/[\%\$]/g, '')) : 0;
        }
    
        return newSortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      });

      setCryptoData(sortedData);
    }
  
    setSortConfig(newSortConfig);
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((crypto) => {
              const isInAllCryptos = isCryptoInAllCryptos(crypto);
              return (
                <tr key={crypto.id} className={`border-b border-gray-200 hover:bg-gray-100 ${isInAllCryptos ? 'bg-green-100' : 'bg-red-100'}`}>
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
                    {isInAllCryptos ? (
                      <DeleteCryptoButton
                        coinID={allCryptos.find((c) => c.name === crypto.name)._id}
                        onResult={(success, data) => handleDeleteCryptoResult(success, data, allCryptos.find((c) => c.name === crypto.name)._id)}
                      />
                    ) : (
                      <CreateCryptoButton 
                        name={crypto.name}
                        symbol={crypto.symbol}
                        coinID={crypto.id}
                        imageUrl={crypto.image}
                        onResult={(success, data) => handleCreateCryptoResult(success, data, {
                          name: crypto.name,
                          symbol: crypto.symbol,
                          coinID: crypto.id,
                          image: crypto.image
                        })}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default HomePage;
