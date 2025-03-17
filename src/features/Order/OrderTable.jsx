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
import { useState, useCallback, useRef } from 'react';
import CustomBadge from './CustomBadge';
import { GrView } from 'react-icons/gr';
import OrderDrawer from './OrderDrawer';
import { updateOrderStatusApi } from '@/services/orderApi';
import { toaster } from '@/components/ui/toaster';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register the required module
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const OrderTable = ({ data, onOrdersUpdated }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const gridRef = useRef();

  // Function to handle viewing an order
  const handleViewOrder = useCallback(orderId => {
    setSelectedOrder(orderId);
    setOpenDrawer(true);
  }, []);

  // Define valid status transitions
  const isValidStatusTransition = useCallback((currentStatus, newStatus) => {
    // Define valid transitions
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [], // Terminal state
      cancelled: [], // Terminal state
    };

    // Check if the transition is valid
    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }, []);

  // Get valid next statuses based on current status
  const getValidNextStatuses = useCallback(currentStatus => {
    const validNextStatuses = {
      pending: ['pending', 'confirmed', 'cancelled'],
      confirmed: ['confirmed', 'shipped', 'cancelled'],
      shipped: ['shipped', 'delivered'],
      delivered: ['delivered'], // Terminal state
      cancelled: ['cancelled'], // Terminal state
    };

    return validNextStatuses[currentStatus] || [];
  }, []);

  // Function to handle status change
  const handleStatusChange = useCallback(
    async (orderId, currentStatus, newStatus) => {
      // Skip if status is the same
      if (currentStatus === newStatus) return;

      // Check if the transition is valid
      if (!isValidStatusTransition(currentStatus, newStatus)) {
        toaster.create({
          title: 'Invalid Status Change',
          description: `Cannot change status from ${currentStatus} to ${newStatus}`,
          type: 'error',
        });
        return;
      }

      try {
        await updateOrderStatusApi(orderId, newStatus);

        toaster.create({
          title: 'Status Updated',
          description: `Order status changed to ${newStatus}`,
          type: 'success',
        });

        // Refresh data if callback exists
        if (onOrdersUpdated) {
          onOrdersUpdated();
        }
      } catch (error) {
        toaster.create({
          title: 'Update Failed',
          description:
            error.response?.data?.message || 'Could not update order status',
          type: 'error',
        });
      }
    },
    [isValidStatusTransition, onOrdersUpdated]
  );

  // Custom cell renderer for the Actions column
  const ActionsRenderer = useCallback(
    props => {
      const currentStatus = props.data.status;
      const validNextStatuses = getValidNextStatuses(currentStatus).filter(
        status => status !== currentStatus
      );

      // Terminal states have no actions to change status
      const isTerminalState =
        currentStatus === 'delivered' || currentStatus === 'cancelled';

      return (
        <MenuRoot positioning={{ placement: 'bottom-end' }}>
          <MenuTrigger as={Button} size="sm" p={0} colorPalette={'black'}>
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
                  View Details
                </MenuItem>

                {/* Only show status change menu if there are valid transitions */}
                {!isTerminalState && validNextStatuses.length > 0 && (
                  <>
                    <MenuItem value="status" command="→">
                      Change Status
                    </MenuItem>

                    <MenuRoot>
                      <MenuPositioner placement="right-start">
                        <MenuContent>
                          {validNextStatuses.map(status => (
                            <MenuItem
                              key={status}
                              onClick={() =>
                                handleStatusChange(
                                  props.data._id,
                                  currentStatus,
                                  status
                                )
                              }
                            >
                              <CustomBadge value={status} />
                            </MenuItem>
                          ))}
                        </MenuContent>
                      </MenuPositioner>
                    </MenuRoot>
                  </>
                )}
              </MenuContent>
            </MenuPositioner>
          </Portal>
        </MenuRoot>
      );
    },
    [handleViewOrder, handleStatusChange, getValidNextStatuses]
  );

  // Column definitions with improved status handling
  const [colDefs] = useState([
    {
      field: 'userId.email',
      headerName: 'Customer Email',
      minWidth: 180,
      flex: 2,
      filter: true,
    },
    {
      field: 'address',
      headerName: 'Shipping Address',
      minWidth: 150,
      flex: 1.5,
      filter: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      cellRenderer: CustomBadge,
      editable: params => {
        const currentStatus = params.data.status;
        // Only allow editing if not in terminal state
        return currentStatus !== 'delivered' && currentStatus !== 'cancelled';
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: params => {
        return {
          values: getValidNextStatuses(params.data.status),
        };
      },
      onCellValueChanged: async params => {
        // Skip if no change
        if (params.oldValue === params.newValue) return;

        // Validate transition
        if (!isValidStatusTransition(params.oldValue, params.newValue)) {
          // Revert to old value and show error
          params.node.setDataValue('status', params.oldValue);
          toaster.create({
            title: 'Invalid Status Change',
            description: `Cannot change status from ${params.oldValue} to ${params.newValue}`,
            type: 'error',
          });
          return;
        }

        try {
          await updateOrderStatusApi(params.data._id, params.newValue);
          toaster.create({
            title: 'Status Updated',
            description: `Order status changed to ${params.newValue}`,
            type: 'success',
          });

          // Refresh data if callback exists
          if (onOrdersUpdated) {
            onOrdersUpdated();
          }
        } catch (error) {
          // Revert to the old value on error
          params.node.setDataValue('status', params.oldValue);
          toaster.create({
            title: 'Update Failed',
            description:
              error.response?.data?.message || 'Could not update order status',
            type: 'error',
          });
        }
      },
      minWidth: 120,
      flex: 1,
      filter: true,
    },
    {
      field: 'items.length',
      headerName: 'Items',
      minWidth: 100,
      flex: 0.8,
      filter: true,
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      valueFormatter: p => formatVND(p.value) + ' VND',
      minWidth: 150,
      flex: 1.2,
      filter: true,
    },
    {
      field: 'createdAt',
      headerName: 'Order Date',
      valueFormatter: p => new Date(p.value).toLocaleDateString(),
      minWidth: 120,
      flex: 1,
      filter: true,
      sort: 'desc',
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
    <>
      <Box w={'full'} className="ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={data}
          columnDefs={colDefs}
          defaultColDef={{
            flex: 1,
            resizable: true,
          }}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 30, 50]}
          suppressColumnVirtualisation={false}
          domLayout="autoHeight"
          enableCellTextSelection={true}
          animateRows={true}
          rowSelection="single"
          context={{ onOrdersUpdated, handleViewOrder }}
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
