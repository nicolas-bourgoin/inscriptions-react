import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import FilledInput from "@mui/material/FilledInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";

function Filter({ filterText, onFilter, onClear, totalCount }) {
    return (
        <div className="table-header">
            <span className="count">
                {totalCount === 0
                    ? "Aucun inscrit"
                    : `${totalCount} inscrit${totalCount > 1 ? "s" : ""}`}
            </span>
            <FormControl className="filter-section" variant="filled">
                <InputLabel className="filter-label">
                    Rechercher par nom
                </InputLabel>
                <FilledInput
                    id="filter-input"
                    type="text"
                    value={filterText}
                    onChange={onFilter}
                    aria-label="Champ de recherche"
                    endAdornment={
                        <InputAdornment position="end">
                            {filterText.length >= 1 && (
                                <IconButton
                                    onClick={onClear}
                                    disableRipple
                                    sx={{
                                        "&:focus": {
                                            outline: "none",
                                        },
                                    }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            )}
                        </InputAdornment>
                    }
                />
            </FormControl>
        </div>
    );
}

export default Filter;
