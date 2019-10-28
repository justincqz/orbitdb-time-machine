import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";

const DatabaseStateDisplay: React.FC<{data: any}> = ({data}) => {

    const columns = [
    {   Header: 'Value',
        accessor: 'value'
    }];

    return (
         <ReactTable
             className="-striped -highlight"
             data={data}
             columns={columns}
             defaultPageSize={5}
         />
    );
};

export default DatabaseStateDisplay;
