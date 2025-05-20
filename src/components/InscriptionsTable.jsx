import React, { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Papa from "papaparse";
import Loader from "./Loader";
import Filter from "./Filter";
import NoData from "./NoData";

const customStyles = {
    headCells: {
        style: {
            backgroundColor: "#f1f1f1",
            fontSize: "13px",
            fontWeight: "bold",
            color: "#333",
            textTransform: "uppercase",
        },
    },
};

const displayedFields = {
    NOM: "Nom",
    PRENOM: "Prénom",
    CATEGORIE_ET_SEXE: "Catégorie",
    "CODE POSTAL": "CP",
    VILLE: "Ville",
    FEDERATION: "Fédération",
    CLUB: "Club",
    ETAT: "État",
};

const InscriptionsTable = ({ csvFile }) => {
    const [pending, setPending] = useState(true);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [filter, setFilter] = useState("");

    const filteredItems = data.filter(
        (item) =>
            item.NOM && item.NOM.toLowerCase().includes(filter.toLowerCase())
    );

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filter) {
                setFilter("");
            }
        };
        return (
            <Filter
                onFilter={(e) => setFilter(e.target.value)}
                onClear={handleClear}
                filterText={filter}
                totalCount={filteredItems.length}
            />
        );
    }, [filter, filteredItems]);

    useEffect(() => {
        fetch(`/imports/${csvFile}`)
            .then((response) => response.text())
            .then((text) => {
                const parsed = Papa.parse(text, { header: true });
                const csvData = parsed.data;

                if (csvData.length > 0) {
                    const colonnes = Object.entries(displayedFields).map(
                        ([cle, displayedName], index) => ({
                            id: index + 1,
                            name: displayedName,
                            selector: (row) => row[cle],
                            sortFunction: (a, b) => {
                                const aVal = a[cle] || "";
                                const bVal = b[cle] || "";
                                return aVal.localeCompare(bVal, "fr", {
                                    sensitivity: "base",
                                });
                            },
                        })
                    );

                    setColumns(colonnes);

                    const sortedData = [...csvData].sort((a, b) => {
                        if (!a.NOM) return 1;
                        if (!b.NOM) return -1;
                        return a.NOM.localeCompare(b.NOM, "fr", {
                            sensitivity: "base",
                        });
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
            progressComponent={<Loader />}
            noDataComponent={<NoData />}
            persistTableHead
            defaultSortField="NOM"
            defaultSortAsc={false}
            customStyles={customStyles}
        />
    );
};

export default InscriptionsTable;
