
import Chip from "@mui/material/Chip";
import React from "react";

const CustomChip = (props) => {
    const {color, label, ...rest} = props;
    return (
        <Chip
            label={label}
            variant="outlined"
            size="large"
            sx={{
                borderColor: color,
                width: '200px',
                color: color,
                borderRadius: '4px',
                fontSize: '1rem',
                py: 1,
                px: 2,
                ...rest.sx,
            }}
            {...rest}
        />
    );
}
export default CustomChip;