import { expandedData } from "../utils/constants";

function ExpandedMobileData({ data }) {
    return (
        <div style={{ padding: "10px 20px" }}>
            {expandedData.map(({ key, label }) =>
                data[key] ? (
                    <p key={key}>
                        <strong>{label} :</strong> {data[key]}
                    </p>
                ) : null
            )}
        </div>
    );
}

export default ExpandedMobileData;
