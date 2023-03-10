import { Tooltip, Typography } from "@mui/material";
import React from "react";

export interface TruncateProps {
  lineCamp: number;
  tooltip?: boolean;
}

export const Truncate: React.FC<React.PropsWithChildren<TruncateProps>> = ({
  children,
  lineCamp,
  tooltip,
}) => {
  return (
    <Tooltip
      title={tooltip && typeof children === "string" ? children : undefined}
    >
      <Typography
        component="span"
        sx={{
          lineHeight: "2rem",
          display: "-webkit-box",
          overflow: "hidden !important",
          textOverflow: "ellipsis",
          WebkitLineClamp: lineCamp,
          WebkitBoxOrient: "vertical",
        }}
      >
        {children}
      </Typography>
    </Tooltip>
  );
};
