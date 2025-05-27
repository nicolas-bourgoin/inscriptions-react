import LoadingRow from "./LoadingRow";

function LoadingTableSkeleton({ rows, columns }) {
    return (
        <div className="loading-table">
            {Array.from({ length: rows }).map((_, i) => (
                <LoadingRow key={i} columnCount={columns} />
            ))}
        </div>
    );
}

export default LoadingTableSkeleton;
