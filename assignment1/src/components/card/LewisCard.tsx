import { Box, Card } from "@material-ui/core";
import React, { ReactElement } from "react";

export const LewisCard = (props: { children: ReactElement }) => {
  const { children } = props;

  return (
    <Card>
      <Box margin={3}>{children}</Box>
    </Card>
  );
};
