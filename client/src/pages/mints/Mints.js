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
const Mints = (props) => (
    <div>
         {(props.isFetching) ? "Loading..." : (
             <div>
        <h1 className="page-title">Mints</h1>

        {props.data.wrappedAssetsList.map((value, index) => {
            return (
                (props.data[value.assetName]["mints"].length!=0) ? 
            <div>
            <h5>
            <span className="fw-semi-bold">&nbsp;{value.assetName}</span></h5>
            <Row>
          <Col lg={7}>
            <Table>
                <thead>
                  <tr className="fs-sm">
                    <th className="hidden-sm-down">#</th>
                    <th>Amount Minted</th>
                    <th>By</th>
                    <th>TX</th>
                  </tr>
                </thead>

                <tbody>
                  {
                  props.data[value.assetName]["mints"].map((v, index) =>
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td>
                        {web3.utils.fromWei(v.amount)}
                      </td>
                      <td>
                      <a href={"https://etherscan.io/account/"+v.to} target="_blank">
                      {v.to}
                        </a>
                      
                      </td>
                      
                      
                      <td >
                      <a href={"https://etherscan.io/tx/"+v.txHash} target="_blank">
                        TX
                        </a>
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


function mapStateToProps(store) {
    return {
        data: store.fetchDataReducer.data,
        isFetching: store.fetchDataReducer.isFetching
    };
  }
  
export default withRouter(connect(mapStateToProps)(Mints));
  