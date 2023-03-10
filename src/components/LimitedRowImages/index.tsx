import { Avatar, Box, Typography } from "@mui/material";

export interface LimitedRowImagesProps {
  items: Array<{ logo: string | null; name: string }> | undefined;
  numberBeforeTruncate?: number;
}

export const LimitedRowImages: React.FC<LimitedRowImagesProps> = ({
  items,
  numberBeforeTruncate,
}) => {
  if (!items?.length) {
    return <>No supported devices</>;
  }

  const slicedItems = items.slice(0, numberBeforeTruncate ?? 3);

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      {slicedItems.map((item, index) => (
        <Avatar
          key={index}
          variant="square"
          alt={item.name}
          src={item.logo ?? ""}
          sx={{
            width: 24,
            height: 24,
            marginRight: 1,
          }}
        />
      ))}{" "}
      {items.length > slicedItems.length && (
        <Typography height="fit-content" variant="smallText">
          + {items.length - slicedItems.length} more
        </Typography>
      )}
    </Box>
  );
};
