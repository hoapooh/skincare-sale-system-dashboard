import {
  getAllProductsApi,
  deleteProductApi,
  restoreProductApi,
} from '@/services/productApi';
import { Box } from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useEffect, useState } from 'react';
import ProductDrawer from './ProductDrawer';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const ProductDataTable = ({ data }) => {
  const [colDefs] = useState([
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Price',
      field: 'price',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Stock',
      field: 'stock',
      sortable: true,
      filter: true,
    },
  ]);
  return (
    <Box className="ag-theme-alpine" height="600px" width="100%">
      <AgGridReact
        rowData={data}
        columnDefs={colDefs}
        pagination
        paginationAutoPageSize
        enableCellTextSelection
        animateRows
        domLayout="autoHeight"
      />
    </Box>
  );
};

export default ProductDataTable;
