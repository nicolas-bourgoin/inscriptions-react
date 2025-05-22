import LoadingRow from "./LoadingRow";

function LoadingTableSkeleton({ rows = 5, columns = 6 }) {
    return (
        <div className="loading-table">
            {Array.from({ length: rows }).map((_, i) => (
                <LoadingRow key={i} columnCount={columns} />
            ))}
        </div>
    );
}

export default LoadingTableSkeleton;
