import { FC, useCallback, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

interface Props {
  currentValue: number;
  updatedQuantity: (newValue: number) => void;
}
export const ItemCounter: FC<Props> = ({ currentValue, updatedQuantity }) => {
  const addOrRemove = useCallback(
    (value: number) => {
      if (value === -1) {
        if (currentValue === 1) return;

        return updatedQuantity(currentValue - 1);
      } else {
        return updatedQuantity(Math.floor(currentValue) + 1);
      }
    },
    [currentValue, updatedQuantity]
  );

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={() => addOrRemove(-1)}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: "center" }}>
        {currentValue}
      </Typography>
      <IconButton onClick={() => addOrRemove(1)}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
