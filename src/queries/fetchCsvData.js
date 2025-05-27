import Papa from "papaparse";

const fetchCsvData = async (path) => {
    try {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error("Erreur lors du chargement des données.");
        }

        const text = await response.text();

        const parsed = Papa.parse(text, { header: true });

        return parsed.data;
    } catch (error) {
        console.error("Erreur fetchCsvData :", error);
        throw error;
    }
};

export default fetchCsvData;
