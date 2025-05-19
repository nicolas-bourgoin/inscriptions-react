import React, { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import styled, { keyframes } from 'styled-components';
import Papa from "papaparse";
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

const customStyles = {
  headCells: {
    style: {
      backgroundColor: '#f1f1f1',
      fontSize: '13px',
      fontWeight: 'bold',
      color: '#333',
      textTransform: 'uppercase',
    },
  },
};

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
	margin: 16px;
	animation: ${rotate360} 1s linear infinite;
	transform: translateZ(0);
	border-top: 2px solid grey;
	border-right: 2px solid grey;
	border-bottom: 2px solid grey;
	border-left: 4px solid black;
	background: transparent;
	width: 80px;
	height: 80px;
	border-radius: 50%;
`;

const CustomLoader = () => (
	<div style={{ padding: '24px' }}>
		<Spinner />
		<div>Fancy Loader...</div>
	</div>
);

const displayedFields = {
  "NOM": "Nom",
  "PRENOM": "Prénom",
  "CATEGORIE_ET_SEXE": "Catégorie",
  "CODE POSTAL": "CP",
  "VILLE": "Ville",
  "FEDERATION": "Fédération",
  "CLUB": "Club",
  "ETAT": "État",
};

const FilterComponent = ({ filterText, onFilter, onClear, totalCount }) => (
  <div className="table-header">
    <span className="count">
      {totalCount === 0
        ? "Aucun inscrit"
        : `${totalCount} inscrit${totalCount > 1 ? "s" : ""}`}
    </span>
    <FormControl className="filter-section" variant="filled">
      <InputLabel className="filter-label" >Rechercher par nom</InputLabel>
      <FilledInput
        id="filter-input"
        type='text'
        value={filterText}
        onChange={onFilter}
        endAdornment={
          <InputAdornment position="end">
            {filterText.length >= 1 &&
            <IconButton
              onClick={onClear}
              disableRipple
              sx={{
                '&:focus': {
                  outline: 'none',
                },
              }}
            >
              <ClearIcon />
            </IconButton>
          }
          </InputAdornment>
        }
      />
    </FormControl>
    </div>
  
);

const NoData = () => (
  <div className="no-data">
    <p>Aucun enregistrement à afficher.</p>
  </div>
);


const InscriptionsTable = ({csvFile}) => {

  const [pending, setPending] = useState(true);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filter, setFilter] = useState('');
  

  const filteredItems = data.filter(item => item.NOM && item.NOM.toLowerCase().includes(filter.toLowerCase()));

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filter) {
        setFilter('');
      }
    };
    return <FilterComponent onFilter={e => setFilter(e.target.value)} onClear={handleClear} filterText={filter} totalCount={filteredItems.length}/>;
  }, [filter, filteredItems]);
  
  useEffect(() => {
    fetch(`/imports/${csvFile}`)
      .then((response) => response.text())
      .then((text) => {
        const parsed = Papa.parse(text, { header: true });
        const csvData = parsed.data;

        if (csvData.length > 0) {
          const colonnes = Object.entries(displayedFields).map(([cle, displayedName], index) => ({
            id: index + 1,
            name: displayedName,
            selector: row => row[cle],
            sortFunction: (a, b) => {
              const aVal = a[cle] || '';
              const bVal = b[cle] || '';
              return aVal.localeCompare(bVal, 'fr', { sensitivity: 'base' });
            }
          }));

          setColumns(colonnes);
        
        const sortedData = [...csvData].sort((a, b) => {
          if (!a.NOM) return 1;
          if (!b.NOM) return -1;
          return a.NOM.localeCompare(b.NOM, 'fr', { sensitivity: 'base' });
        });
        
        setData(sortedData);

      }
      setPending(false);
      
      });
  }, [csvFile]);

  

  
  return (
     <DataTable
        columns={columns}
        data={filteredItems}
        subHeaderComponent={subHeaderComponentMemo}
        responsive
        subHeader
        highlightOnHover
        striped
        fixedHeader={false}
        progressPending={pending}
        progressComponent={<CustomLoader />}
        noDataComponent={<NoData />}
        persistTableHead
        defaultSortField="NOM"
        defaultSortAsc={false}
        customStyles={customStyles}
      />
  );
};

export default InscriptionsTable;
