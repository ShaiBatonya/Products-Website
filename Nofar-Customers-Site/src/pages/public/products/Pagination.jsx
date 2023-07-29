import React from "react";
import { Box, ButtonGroup, Button } from "@chakra-ui/react";

const Pagination = ({ currentPage, productsPerPage, totalProducts, onPageChange }) => {
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handleClick = (page) => {
    onPageChange(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <Button
          key={i}
          colorScheme={currentPage === i ? "orange" : "gray"}
          onClick={() => handleClick(i)}
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  return (
    <Box my={5}>
      <ButtonGroup spacing={2}>{renderPaginationButtons()}</ButtonGroup>
    </Box>
  );
};

export default Pagination;
