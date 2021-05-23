// npm install @material-ui/core          or   yarn add @material-ui/core
// npm install react-virtualized --save   or   yarn add react-virtualized --save
// npm install axios                      or   yarn add axios
// npm install react-number-format --save or   yarn add react-number-format

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
import axios from 'axios';
import NumberFormat from 'react-number-format'

const styles = (theme) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
});

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
};

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

function createData(country, cases,  deaths, recovered, todayCases,) {
  return { country, cases, deaths, recovered, todayCases,};
}




class ReactVirtualizedTable_byCountry extends Component{
constructor(props){
    super(props);
    this.state = {
        data:null   
    }
}

async componentDidMount() {
    await axios.get('https://corona.lmao.ninja/v3/covid-19/countries')
    .then((res) => {
        var sortedData = [...res.data].sort((a, b) => b.cases - a.cases);
        var temp = sortedData.map(({country, cases, deaths, 
            recovered, todayCases}) => ({country, cases, deaths, recovered, todayCases}));
        this.processData(temp);
    })
};

processData = (data) => {
    let value = []
    
    for(let d in data){
        
        value.push(createData(data[d]['country'], data[d]['cases'], data[d]['deaths'], 
        data[d]['recovered'], data[d]['todayCases']))

        console.log(data[d])
    }
    console.log(value)
    this.setState({data: {value}})
};


  render(){  
    const { data } = this.state;
    if (data === null) {
        console.log("null")
        return (
            <div></div>
        );
    }
    else{
        console.log(data.value)
        return (
            <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
                rowCount={data.value.length}
                rowGetter={({ index }) => data.value[index]}
                columns={[
                {
                    width: 300,
                    label: 'Country',
                    dataKey: 'country',
                },
                {
                    width: 300,
                    label: 'Cases',
                    dataKey: 'cases',
                    numeric: true,
                },
                {
                    width: 300,
                    label: 'Deaths',
                    dataKey: 'deaths',
                    numeric: true,
                },
                {
                    width: 300,
                    label: 'Recovered',
                    dataKey: 'recovered',
                    numeric: true,
                },
                {
                    width: 300,
                    label: 'TodayCases',
                    dataKey: 'todayCases',
                    numeric: true,
                },
                ]}
            />
            </Paper>
        );
    }
  }
}


function createData2(state, cases, deaths, recovered, active) {
    return { state, cases, deaths, recovered, active};
  }



class ReactVirtualizedTable_byStates extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:null   
        }
    }
    
    async componentDidMount() {
        await axios.get('https://corona.lmao.ninja/v3/covid-19/states')
        .then((res) => {
            var sortedData = [...res.data].sort((a, b) => b.cases - a.cases);
            var temp = sortedData.map(({state, cases, deaths, 
                recovered, active}) => ({state, cases, deaths, recovered, active}));
            this.processData(temp);
        })
    };
    
    processData = (data) => {
        let value = []
        
        for(let d in data){
            
            value.push(createData2(data[d]['state'], data[d]['cases'], data[d]['deaths'], 
            data[d]['recovered'], data[d]['active']))
    
            console.log(data[d])
        }
        console.log(value)
        this.setState({data: {value}})
    };
    
    
      render(){  
        const { data } = this.state;
        if (data === null) {
            console.log("null")
            return (
                <div></div>
            );
        }
        else{
            console.log(data.value)
            return (
                <Paper style={{ height: 400, width: '100%' }}>
                <VirtualizedTable
                    rowCount={data.value.length}
                    rowGetter={({ index }) => data.value[index]}
                    columns={[
                    {
                        width: 300,
                        label: 'State',
                        dataKey: 'state',
                    },
                    {
                        width: 300,
                        label: 'Cases',
                        dataKey: 'cases',
                        numeric: true,
                    },
                    {
                        width: 300,
                        label: 'Deaths',
                        dataKey: 'deaths',
                        numeric: true,
                    },
                    {
                        width: 300,
                        label: 'Recovered',
                        dataKey: 'recovered',
                        numeric: true,
                    },
                    {
                        width: 300,
                        label: 'Active',
                        dataKey: 'active',
                        numeric: true,
                    },
                    ]}
                />
                </Paper>
            );
        }
      }
    }




    function createData3(county, confirmed, deaths, updatedAt) {
        return { county, confirmed, deaths, updatedAt};
      }
    
    class ReactVirtualizedTable_byCounty extends Component{
        constructor(props){
            super(props);
            this.state = {
                data:null   
            }
        }
        
        async componentDidMount() {
            await axios.get('https://corona.lmao.ninja/v3/covid-19/jhucsse/counties')
            .then((res) => {
                var Calif = [...res.data].filter((a) => 
                    a.province === 'California');
                
                var sortedCalif = Calif.sort((a, b) => b.stats.confirmed - a.stats.confirmed);
                var temp = sortedCalif.map(({county, stats,
                    updatedAt}) => ({county, stats, updatedAt}));
                this.processData(temp);
            })
        };
        
        processData = (data) => {
            let value = []
            
            for(let d in data){
                
                value.push(createData3(data[d]['county'], data[d].stats['confirmed'], 
                data[d].stats['deaths'], data[d]['updatedAt']))
        
                console.log(data[d])
            }
            console.log(value)
            this.setState({data: {value}})
        };
        
        
          render(){  
            const { data } = this.state;
            if (data === null) {
                console.log("null")
                return (
                    <div></div>
                );
            }
            else{
                console.log(data.value)
                return (
                    <Paper style={{ height: 400, width: '100%' }}>
                    <VirtualizedTable
                        rowCount={data.value.length}
                        rowGetter={({ index }) => data.value[index]}
                        columns={[
                        {
                            width: 300,
                            label: 'County',
                            dataKey: 'county',
                        },
                        {
                            width: 300,
                            label: 'Confirmed',
                            dataKey: 'confirmed',
                            numeric: true,
                        },
                        {
                            width: 300,
                            label: 'Deaths',
                            dataKey: 'deaths',
                            numeric: true,
                        },
                        {
                            width: 300,
                            label: 'UpdatedAt',
                            dataKey: 'updatedAt',
                            numeric: true,
                        },
                        ]}
                    />
                    </Paper>
                );
            }
          }
        }


export{ ReactVirtualizedTable_byCountry,
        ReactVirtualizedTable_byStates,
        ReactVirtualizedTable_byCounty 
}
