import React, { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Papa from "papaparse";
import LoadingTableSkeleton from "./LoadingTableSkeleton";
import Filter from "./Filter";
import NoData from "./NoData";
import { customStyles, displayedFields } from "../utils/constants";
import useWindowSize from "../hooks/useWindowSize";

const InscriptionsTable = ({ csvFile }) => {
    const [pending, setPending] = useState(true);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [filter, setFilter] = useState("");

    const width = useWindowSize();

    const filteredItems = data.filter(
        (item) =>
            item.NOM && item.NOM.toLowerCase().includes(filter.toLowerCase())
    );

    const mobileColumns = [
        {
            name: "Nom",
            selector: (row) => row.NOM,
            sortable: true,
        },
        {
            name: "Prénom",
            selector: (row) => row.PRENOM,
            sortable: true,
        },
    ];

    const ExpandedComponent = ({ data }) => (
        <div style={{ padding: "10px 20px" }}>
            <p>
                <strong>Catégorie :</strong> {data.CATEGORIE_ET_SEXE}
            </p>
            <p>
                <strong>Code postal :</strong> {data["CODE POSTAL"]}
            </p>
            <p>
                <strong>Ville :</strong> {data.VILLE}
            </p>
            <p>
                <strong>Fédération :</strong> {data.FEDERATION}
            </p>
            <p>
                <strong>Club :</strong> {data.CLUB}
            </p>
            <p>
                <strong>État :</strong> {data.ETAT}
            </p>
        </div>
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

    const filteredColumns = useMemo(() => {
        return Object.entries(displayedFields)
            .filter(([key]) => {
                if (
                    width < 768 &&
                    (key === "FEDERATION" ||
                        key === "CODE POSTAL" ||
                        key === "CLUB" ||
                        key === "ETAT")
                )
                    return false;
                return true;
            })
            .map(([cle, displayedName], index) => ({
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
            }));
    }, [width]);

    useEffect(() => {
        setPending(true);

        fetch(`/imports/${csvFile}`)
            .then((response) => {
                if (!response.ok)
                    throw new Error("Erreur lors du chargement des données.");
                return response.text();
            })
            .then((text) => {
                const parsed = Papa.parse(text, { header: true });
                const csvData = parsed.data;

                if (csvData.length > 0) {
                    setColumns(filteredColumns);

                    const sortedData = [...csvData].sort((a, b) => {
                        if (!a.NOM) return 1;
                        if (!b.NOM) return -1;
                        return a.NOM.localeCompare(b.NOM, "fr", {
                            sensitivity: "base",
                        });
                    });

                    setData(sortedData);
                }
                setTimeout(() => setPending(false), 50);
            })
            .catch((err) => {
                console.error(err);
                setPending(false);
            });
    }, [csvFile, filteredColumns]);

    return (
        <DataTable
            columns={width <= 768 ? mobileColumns : columns}
            data={filteredItems}
            subHeaderComponent={subHeaderComponentMemo}
            responsive
            subHeader
            highlightOnHover
            striped
            fixedHeader={false}
            progressPending={pending}
            progressComponent={
                <LoadingTableSkeleton
                    rows={6}
                    columns={
                        width <= 768 ? mobileColumns.length : columns.length
                    }
                />
            }
            noDataComponent={<NoData />}
            persistTableHead
            defaultSortField="NOM"
            defaultSortAsc={false}
            customStyles={customStyles}
            expandableRows={width <= 768 ? true : false}
            expandableRowsComponent={ExpandedComponent}
        />
    );
};

export default InscriptionsTable;
