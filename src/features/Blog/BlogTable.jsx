import { Box, Button, Flex } from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
import { GrView } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';

const ActionsRenderer = props => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/blogs/${props.data._id}`);
  };

  return (
    <Flex>
      <Button size="sm" colorScheme={'dark'} onClick={handleViewDetail}>
        <GrView />
      </Button>
    </Flex>
  );
};

const BlogTable = ({ data }) => {
  const [colDefs] = useState([
    {
      field: 'imageUrl',
      headerName: 'Image Url',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'title',
      headerName: 'Title',
      sortable: true,
      filter: true,
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      valueFormatter: p => new Date(p.value).toLocaleDateString(),
      sortable: true,
      filter: true,
      minWidth: 120,
      flex: 1,
    },
    {
      headerName: 'Actions',
      cellRenderer: ActionsRenderer,
      minWidth: 150,
      sortable: false,
      filter: false,
      resizable: false,
    },
  ]);

  return (
    <Box w={'full'}>
      <AgGridReact
        rowData={data}
        columnDefs={colDefs}
        defaultColDef={{
          flex: 1,
        }}
        pagination={true}
        paginationPageSize={5}
        paginationPageSizeSelector={[5, 10, 20]}
        suppressColumnVirtualisation={false}
        domLayout="autoHeight"
        enableCellTextSelection={true}
      />
    </Box>
  );
};

export default BlogTable;
