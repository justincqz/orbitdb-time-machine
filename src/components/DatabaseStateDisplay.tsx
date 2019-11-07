import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";

const DatabaseStateDisplay: React.FC<{data: any}> = ({data}) => {
  const columns = Object.keys(data[0]).map((key) => {
    return {
      Header: key,
      accessor: key
    }
  })
  
  return (
    <ReactTable
    className="-striped -highlight"
    data={data}
    columns={columns}
    defaultPageSize={5}
    pageSizeOptions={[5,10,20]}
    />
    );
  };
  
  export default DatabaseStateDisplay;
  