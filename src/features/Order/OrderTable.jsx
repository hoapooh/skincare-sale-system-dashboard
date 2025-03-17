import { formatVND } from '@/utils/formatVND';
import { FaEllipsisVertical } from 'react-icons/fa6';
import {
  Box,
  Button,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
} from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
import CustomBadge from './CustomBadge';
import { GrView } from 'react-icons/gr';
import OrderDrawer from './OrderDrawer';

const OrderTable = ({ data }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  // Function to handle viewing an order
  const handleViewOrder = orderId => {
    setSelectedOrder(orderId);
    setOpenDrawer(true);
    console.log(orderId);
  };

  // Custom cell renderer for the Actions column
  const ActionsRenderer = props => {
    return (
      <MenuRoot positioning={{ placement: 'bottom-end' }}>
        <MenuTrigger
          as={Button}
          size="sm"
          p={0}
          colorPalette={'black'}
          colorScheme={'dark'}
        >
          <FaEllipsisVertical />
        </MenuTrigger>
        <Portal>
          <MenuPositioner>
            <MenuContent>
              <MenuItem
                value="view"
                onClick={() => handleViewOrder(props.data._id)}
              >
                <GrView />
                View
              </MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </MenuRoot>
    );
  };

  const [colDefs] = useState([
    {
      field: 'userId.email',
      headerName: 'Email',
      minWidth: 180,
      flex: 2,
    },
    {
      field: 'address',
      minWidth: 150,
      flex: 1.5,
    },
    {
      field: 'status',
      headerName: 'Status',
      cellRenderer: CustomBadge,
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'items.length',
      headerName: 'Total Item',
      minWidth: 100,
      flex: 0.8,
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      valueFormatter: p => formatVND(p.value) + ' VND',
      minWidth: 150,
      flex: 1.2,
    },
    {
      headerName: 'Actions',
      cellRenderer: ActionsRenderer,
      sortable: false,
      filter: false,
      minWidth: 120,
      flex: 0.8,
      suppressSizeToFit: true,
    },
  ]);

  return (
    // Data Grid will fill the size of the parent container
    <>
      <Box w={'full'}>
        <AgGridReact
          rowData={data}
          columnDefs={colDefs}
          defaultColDef={{ flex: 1 }}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 30]}
          suppressColumnVirtualisation={false}
          domLayout="autoHeight"
          enableCellTextSelection
        />
      </Box>

      {selectedOrder && (
        <OrderDrawer
          open={openDrawer}
          setOpen={setOpenDrawer}
          selectedOrder={selectedOrder}
        />
      )}
    </>
  );
};

export default OrderTable;
