import React, { Component } from 'react';
import './App.css';


class App extends Component {

  render() {
    return (
      <div className="col-md-12 App">
        <header className="head">
          <h1>Dynamic Data Tables using react</h1>
        </header>
        <DataTables className="tables_block" />
      </div>
    );
  }
}

class DataTables extends Component {

  constructor(props){
    super(props);
    this.state = {id:[],count:1,showDialog:false, nCols:2, nRows:2};
    this.addNewTable = this.addNewTable.bind(this);
    this.removeTable = this.removeTable.bind(this);
  }

  addNewTable(cols,rows) {
    this.setState((preState) => ({
      id:preState.id.concat(preState.count),
      count: preState.count + 1,
      showDialog:false,
      nCols:parseInt(cols),
      nRows:parseInt(rows)
      }));
    
  }

  removeTable(id){
    this.setState(ps => ({id:ps.id.filter(i => i !== id)}));
  }

  render(){
      return (
        <div className="col-md-12 justify-content-center container-fluid">
          <div className="ctBtnBlock row ">
              <button className="btn btn-primary pull-right" onClick={()=>this.setState({showDialog:true})}>New table</button>
          </div>
          {this.state.showDialog ? <FormDialog onCreate={this.addNewTable} /> : null}
          {this.state.id.map(tb =>(
            <Table key={tb} name={'Table_'+tb} colVal={this.state.nCols} rowVal={this.state.nRows} remove={() => this.removeTable(tb)}/>
          ))}
        </div>);
  }
}

class Table extends Component {

  constructor(props){
    super(props);
    this.state = {cols:this.props.colVal, rows:this.props.rowVal, delRow:[], delCol:[]};
    this.addRows = this.addRows.bind(this);
    this.addColumns = this.addColumns.bind(this);
    this.deleteColumns = this.deleteColumns.bind(this);
    this.deleteRows = this.deleteRows.bind(this);
  }

  addRows(){

    this.setState((prevState) => ({rows: prevState.rows + 1}));
  }

  addColumns(){
    this.setState((prevState) => ({cols: prevState.cols + 1}));
  }

  deleteColumns(id){

    this.setState(ps => ({delCol:ps.delCol.concat(id)}));
    
  }

  deleteRows(id){
    
    this.setState(ps => ({delRow:ps.delRow.concat(id)}));
  }

  render(){

    return (
      <div className="row col-md-12 tb-container">
        <div className="row h3 col-md-11">
          <span className="col-md-6 h3"><RowInput key={this.props.name} placeholder={this.props.name} /></span><span><button className="btn btn-danger pull-right" onClick={this.props.remove}>Remove</button></span>
        </div>
        <table className="table table-bordered">
          <thead className="thead-dark">
            <TableRow key={0} header={true} cols={this.state.cols} delcol={this.state.delCol} addColumns={this.addColumns} deleteColumns={this.deleteColumns}/>
          </thead>
          <tbody>
            { Array.apply(null,{length:this.state.rows}).map((_,i) =>
              this.state.delRow.includes(i) ? null : (<TableRow key={i} header={false} cols={this.state.cols} delcol={this.state.delCol} deleteRows={()=>this.deleteRows(i)}/>)
            )}
            <tr colSpan={this.state.cols-this.state.delCol.length}>
              <td colSpan={this.state.cols-this.state.delCol.length}><button className="btn btn-success" onClick={this.addRows}>Add row</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class TableRow extends Component{

  constructor(props){
    super(props);
    this.state = {cols:this.props.cols};
    this.getContent = this.getContent.bind(this);
   }


  getContent(id){

    if (this.props.delcol.includes(id))
        return null
    
    var i = id;
    return this.props.header ? (<th key={i} colid={i} ><div className=""><RowInput key={i} placeholder={"Column "+(i+1)}/><button className="btn btn-light btn-sm" onClick={() => this.props.deleteColumns(i)}>X</button></div></th>):(<td key={i} colid={i}><RowInput key={i} placeholder="Enter value"/></td>);

  }
  
  render(){

    return (
      <tr>
        { Array.apply(null,{length:this.props.cols}).map((_,i) => (this.getContent(i)))}
        {this.props.header ? (<th className="col-md-1" key={'0'}><button className="btn btn-success" onClick={() => (this.props.addColumns())}>Add column</button></th>) : (<td className="col-md-1" key={'0'}><button className="btn btn-light btn-sm" onClick={this.props.deleteRows}>X</button></td>)}
      </tr>
    );
  }

}

class RowInput extends Component{

  constructor(props){
    super(props);
    this.state = {readonly:true};
    this.editable = this.editable.bind(this);
    this.onlyread = this.onlyread.bind(this);
  }

  editable(){

    this.setState(ps => ({
      readonly : false
    }));
  }

  onlyread(){
    this.setState(ps => ({
      readonly : true
    }));
  }

  render(){
    return <input type="text" className="form-control col-md-10" onClick={this.editable} onFocus={this.editable} onBlur={this.onlyread} placeholder={this.props.placeholder} readOnly={this.state.readonly}/>
  }
}

class FormDialog extends Component
{
    constructor(props){
      super(props);
      this.clickHandle= this.clickHandle.bind(this);
    }

    clickHandle(){
      this.props.onCreate(this.col_input.value,this.row_input.value);
    }

    render(){
      return (
            <div className=" dialogform justify-content-end">
              <div className="row form-inline"><label className="pull-right">Columns: <input type="number" className="form-control" ref={(input) => {this.col_input = input;}} defaultValue="2"/></label></div>
              <div className="row form-inline"><label className="pull-right">Rows: <input type="number" className="form-control" ref={(input) => {this.row_input= input;}} defaultValue="1"/></label></div>
              <button className="btn btn-primary pull-right" onClick={this.clickHandle}>Create</button>
            </div>
        );

    }

}
export default App;



