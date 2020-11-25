import React from 'react';
import {
    Row,
    Col,
    Table
} from 'reactstrap';

import {connect} from 'react-redux'
import Widget from '../../components/Widget';
import { withRouter } from 'react-router-dom';
const Web3 = require('web3');
const web3 = new Web3(Web3.currentProvider)
const Trades = (props) => (
    <div>
         {(props.isFetching) ? "Loading..." : (
             <div>
        <h1 className="page-title">Trades</h1>

        {props.data.wrappedAssetsList.map((value, index) => {
            return (
                (props.data[value.assetName]["pools"].length!=0) ? 
            <div>
                {props.data[value.assetName]["pools"].map((value, index)=> {
                    return (
                        <div>
                            <h3>{value.poolInfo.token0.symbol} - {value.poolInfo.token1.symbol} pool</h3>
                            <Row>
          <Col lg={7}>
            <Table>
                <thead>
                  <tr className="fs-sm">
                    <th>Timestamp</th>
                    <th>Bought</th>
                    <th>Sold</th>
                    <th>TX</th>
                  </tr>
                </thead>
                {
                    value.trades.map((k,i)=> {
                        return (
                                <tbody>
                  
                    <tr key={i}>
                      <td>{k.timestamp}</td>
                      <td>
                      {parseFloat(k.amountBought).toFixed(2) +' ' + k.assetBought}
                      </td>
                      <td>
                      {parseFloat(k.amountSold).toFixed(2) +' ' + k.assetSold}
                      </td>
                      
                      <td >
                      <a href={"https://etherscan.io/tx/"+k.txHash} target="_blank">
                        TX
                        </a>
                      </td>
                    </tr>
            
                    </tbody>
                        )
                    })
                }                             

              </Table>
              </Col>
              </Row>
                        </div>
                    )
                     
                })}
            
            </div>: '')
        })}
        </div>
        )}
    </div>
);

function mapStateToProps(store) {
    return {
        data: store.fetchDataReducer.data,
        isFetching: store.fetchDataReducer.isFetching
    };
  }
  
export default withRouter(connect(mapStateToProps)(Trades));
  