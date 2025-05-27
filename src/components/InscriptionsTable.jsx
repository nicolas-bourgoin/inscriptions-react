import React, { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Papa from "papaparse";
import LoadingTableSkeleton from "./LoadingTableSkeleton";
import Filter from "./Filter";
import NoData from "./NoData";
import ExpandedMobileData from "./ExpandedMobileData";
import {
    customStyles,
    displayedFields,
    mobileColumns,
    excludedColumnsMobile,
} from "../utils/constants";
import useWindowSize from "../hooks/useWindowSize";
import fetchCsvData from "../queries/fetchCsvData";

const InscriptionsTable = ({ csvFile }) => {
    // loading table
    const [pending, setPending] = useState(true);
    // data from csv
    const [data, setData] = useState([]);
    // columns calculated in desktop version
    const [columns, setColumns] = useState([]);
    const [filter, setFilter] = useState("");

    const width = useWindowSize();

    const filteredItems = useMemo(() => {
        return data.filter(
            (item) =>
                item.NOM &&
                item.NOM.toLowerCase().includes(filter.toLowerCase())
        );
    }, [data, filter]);

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
        return (
            Object.entries(displayedFields)
                // If we are in mobile mode (width < 768), we exclude certain specific columns
                .filter(
                    ([key]) =>
                        !(width < 768 && excludedColumnsMobile.includes(key))
                )
                // For each entry, we create a column object for react-data-table-component
                .map(([key, displayedName], index) => ({
                    id: index + 1,
                    name: displayedName,
                    selector: (row) => row[key] ?? "", // Function to retrieve the corresponding data in a row

                    sortFunction: (a, b) => {
                        // Custom function to sort values by column (French locale)

                        const aVal = a[key] || "";
                        const bVal = b[key] || "";
                        return aVal.localeCompare(bVal, "fr", {
                            sensitivity: "base",
                        });
                    },
                }))
        );
    }, [width]);

    useEffect(() => {
        // display skeleton
        setPending(true);

        // request
        fetchCsvData(`/imports/${csvFile}`)
            .then((csvData) => {
                if (csvData.length > 0) {
                    setColumns(filteredColumns);

                    // sort by name
                    const sortedData = [...csvData].sort((a, b) => {
                        if (!a.NOM) return 1;
                        if (!b.NOM) return -1;
                        return a.NOM.localeCompare(b.NOM, "fr", {
                            sensitivity: "base",
                        });
                    });

                    setData(sortedData);
                }
                // Slight wait for the skeleton appear
                setTimeout(() => setPending(false), 50);
            })
            .catch((error) => {
                console.error(error);
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
            expandableRowsComponent={ExpandedMobileData}
        />
    );
};

export default InscriptionsTable;
