import React from 'react';
import { Pagination as MuiPagination } from '@mui/material';

const Pagination = ({ totalItems, itemsPerPage, onPageChange, currentPage }) => {
  const pageCount = Math.ceil(totalItems / itemsPerPage); // Calculate the total number of pages

  return (
    <MuiPagination
      count={pageCount}
      page={currentPage}
      onChange={(_, value) => onPageChange(value)}
      color="primary"
      shape="rounded"
      sx={{
        marginTop: 2,
        justifyContent: 'center',
        display: 'flex',
      }}
    />
  );
};

export default Pagination;
