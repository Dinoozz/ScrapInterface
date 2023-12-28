import React, { useEffect, useState } from 'react';
import api from '../api/api'; // Assurez-vous que le chemin est correct
import ListError from '../components/ListStockErrorComponent';
import ErrorDetails from '../components/StockErrorDetailsComponent';

const StockErrorPage = () => {
  const [file, setFile] = useState(null);
  const [selectedErrorId, setSelectedErrorId] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  const handleStatusChange = () => {
    setRefreshList(oldState => !oldState); // Inverse l'état pour forcer la mise à jour
  };


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSelectError = (id) => {
    setSelectedErrorId(id);
  };

  const handleUpload = async () => {
    if (file && window.confirm('Voulez-vous vraiment envoyer ce fichier ?')) {
      const formData = new FormData();
      formData.append('csv', file);

      try {
        const response = await api.sendCsvOpenSi(formData);
        console.log(response.data);
        alert('Fichier CSV uploadé avec succès.');
      } catch (error) {
        console.error('Erreur lors de l\'upload du fichier CSV:', error);
        alert('Erreur lors de l\'upload du fichier CSV.');
      }
    }
  };

  const handleGenError = async () => {
        try {
            const response = await api.genStockError();
            if (response.data.message === "Processus de vérification terminé")
                alert('Erreur de stock généré avec succès.');
            handleStatusChange();
        } catch (error) {
            console.error('Erreur lors de la génération d\'erreur:', error);
            alert('Erreur lors de la génération d\'erreur.');
        }
    };
  
    const handleGenCSV = async () => {
      try {
          const response = await api.genCSV(); // Assurez-vous que cette fonction retourne la réponse brute sans json() ou similar
  
          if (response.status === 200) {
              // Créer un URL à partir du blob de réponse
              const url = window.URL.createObjectURL(new Blob([response.data]));
              // Créer un élément <a> pour le téléchargement
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'products.csv'); // Nom du fichier à télécharger
              document.body.appendChild(link);
              link.click();
  
              console.log("Téléchargement du CSV lancé.");
  
              // Nettoyage: retirer l'URL et l'élément <a>
              window.URL.revokeObjectURL(url);
              document.body.removeChild(link);
          } else {
              console.error('Erreur lors de la génération du CSV:', response);
              alert('Erreur lors de la génération du CSV.');
          }
      } catch (error) {
          console.error('Erreur lors de la génération du CSV:', error);
          alert(error.message);
      }
  };
  
  
  

  return (
    <div className="flex w-full">
      {/* Colonne de Gauche */}
      <div className="flex flex-col w-1/5 p-4">
        <input
            className="block w-full text-sm text-gray-500
                    file:mt-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    cursor-pointer"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
        />
        <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleUpload}
        >
            Uploader le CSV
        </button>
        <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGenError}
        >
            Détection des erreurs
        </button>
        <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGenCSV}
        >
            Génération du CSV
        </button>
      </div>
      <div className="w-1/5 mt-8">
        <ListError onSelectError={handleSelectError} key={refreshList} />
      </div>
      <div className="w-3/5 mt-8">
        {selectedErrorId && <ErrorDetails errorId={selectedErrorId} onStatusChange={handleStatusChange} />}
      </div>
    </div>
  );
};

export default StockErrorPage;