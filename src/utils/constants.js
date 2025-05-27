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

const expandedData = [
    { key: "CATEGORIE_ET_SEXE", label: "Catégorie" },
    { key: "CODE POSTAL", label: "Code postal" },
    { key: "VILLE", label: "Ville" },
    { key: "FEDERATION", label: "Fédération" },
    { key: "CLUB", label: "Club" },
    { key: "ETAT", label: "État" },
];

const excludedColumnsMobile = ["FEDERATION", "CODE POSTAL", "CLUB", "ETAT"];

export {
    customStyles,
    displayedFields,
    mobileColumns,
    expandedData,
    excludedColumnsMobile,
};
