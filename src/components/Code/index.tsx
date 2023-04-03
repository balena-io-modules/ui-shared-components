import { Box, BoxProps } from "@mui/material";
import { theme } from "../../theme";

export const Code = ({ children, ...props }: BoxProps) => (
  <Box
    sx={{
      background: theme.palette.hubGrey.xlight,
      borderRadius: 1,
    }}
    p={1}
    component="span"
    {...props}
  >
    <code
      style={{
        color: theme.palette.hubGrey.dark || "#000",
      }}
    >
      {children}
    </code>
  </Box>
);
