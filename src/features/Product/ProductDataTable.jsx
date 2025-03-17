import { Box, Button } from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrView } from 'react-icons/gr';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// Custom cell renderer for the action buttons
const ActionButtonRenderer = props => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${props.data._id}`);
  };

  return (
    <Button
      size="sm"
      colorPalette="black"
      onClick={handleViewDetails}
      leftIcon={<GrView />}
    >
      View
    </Button>
  );
};

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
    {
      headerName: 'Actions',
      field: 'actions',
      sortable: false,
      filter: false,
      cellRenderer: ActionButtonRenderer,
      width: 120,
    },
  ]);

  return (
    <Box className="ag-theme-alpine" width="100%">
      <AgGridReact
        rowData={data}
        columnDefs={colDefs}
        pagination
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 30]}
        enableCellTextSelection
        animateRows
        domLayout="autoHeight"
      />
    </Box>
  );
};

export default ProductDataTable;
