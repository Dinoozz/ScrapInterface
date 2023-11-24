import React, { useState } from 'react';
import TableRowButton from '../components/CreateCryptoButton';


function Table() {
  const [tableData, setTableData] = useState([]);

  const handleRowButtonClick = (responseData) => {
    // Mettre à jour le tableau avec les nouvelles données reçues de la requête API
    // Vous pouvez implémenter la logique spécifique de mise à jour ici
    console.log('Données de la requête API :', responseData);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Colonne 1</th>
          <th>Colonne 2</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((rowData, index) => (
          <tr key={index}>
            <td>{rowData.column1}</td>
            <td>{rowData.column2}</td>
            <td>
              <TableRowButton rowData={rowData} onClick={handleRowButtonClick} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
