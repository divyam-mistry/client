import { Box } from "@mui/material";
import { styled } from "@mui/system";

// styled(Component, [options])(styles) => Component
const FlexBetween = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
});

export default FlexBetween;