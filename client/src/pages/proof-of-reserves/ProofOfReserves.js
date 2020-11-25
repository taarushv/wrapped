import React from 'react';
import {
    Row,
    Col,
    Table
} from 'reactstrap';

import {connect} from 'react-redux'
import Widget from '../../components/Widget';
import { withRouter } from 'react-router-dom';
const ProofOfReserves = (props) => (
    <div>
        {(props.isFetching) ? "Loading..." : (
            <div>
        <h1 className="page-title">Proof Of Reserves</h1>
        {
            props.data.proofOfReserves.map((value, index)=> {
                return(
                    <div>
                    <h3>{value.asset} Reserves</h3>
                    <Row>
          <Col lg={7}>
            <Table>
                <thead>
                  <tr className="fs-sm">
                    <th>#</th>
                    <th>Address</th>
                    <th>Balance</th>
                    <th>Link</th>
                  </tr>
                </thead>

                <tbody>
                  {
                  value.reserveAddresses.map((v, i) =>
                    <tr key={i}>
                      <td>{i+1}</td>
                      <td>
                       {v.address}
                      </td>
                      <td>
                      {v.balance}  
                      </td>
                    
                      
                      <td >
                      <a href={v.source} target="_blank">
                        Source
                        </a>
                      </td>
                    </tr>,
                  )
                }
                </tbody>

              </Table>
            <p>Wrapped {value.asset}</p>
            <p>ERC20 total supply: {value.wrappedTotalSupply}</p>
            <a href={"https://etherscan.io/account/" + value.wrappedContractAddress}> Source </a>
            <br/>
            <br/>
              </Col>
              </Row>
                    </div>
                )
            })
        }
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
  
export default withRouter(connect(mapStateToProps)(ProofOfReserves));
  