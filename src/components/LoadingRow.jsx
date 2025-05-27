function LoadingRow({ columnCount }) {
    const columns = Array.from({ length: columnCount });

    return (
        <div className="loading-row">
            {columns.map((_, i) => (
                <div key={i} className="loading-cell skeleton" />
            ))}
        </div>
    );
}

export default LoadingRow;
