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
const Transfers = (props) => (
    <div>
         {(props.isFetching) ? "Loading..." : (
             <div>
        <h1 className="page-title">Transfers</h1>

        {props.data.wrappedAssetsList.map((value, index) => {
            return (
                (props.data[value.assetName]["transfers"].length!=0) ? 
            <div>
            <h3>
            <span className="fw-semi-bold">&nbsp;{value.assetName}</span></h3>
            <Row>
          <Col lg={7}>
            <Table>
                <thead>
                  <tr className="fs-sm">
                    <th className="hidden-sm-down">Block #</th>
                    <th>From</th>
                    <th>To</th>
                    <th>TX</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {
                  props.data[value.assetName]["transfers"].map((v, index) =>
                    <tr key={index}>
                      <td>{v.block}</td>
                      <td>
                      <a href={"https://etherscan.io/account/"+v.from} target="_blank">
                      {v.from.substring(0,7)}
                        </a>
                      </td>
                      <a href={"https://etherscan.io/account/"+v.to} target="_blank">
                      {v.to.substring(0,7)}
                        </a>
                      <td >
                      <a href={"https://etherscan.io/tx/"+v.txHash} target="_blank">
                        TX
                        </a>
                      </td>
                      <td>
                        {web3.utils.fromWei(v.amount)}
                      </td>
                    </tr>,
                  )
                }
                </tbody>

              </Table>
              </Col>
              </Row>
            </div>: '')
        })}
        </div>
        )}
    </div>
);

//export default Transfers;




function mapStateToProps(store) {
    return {
        data: store.fetchDataReducer.data,
        isFetching: store.fetchDataReducer.isFetching
    };
  }
  
  export default withRouter(connect(mapStateToProps)(Transfers));
  