import React from 'react';
import {
  Row,
  Col,
  Progress,
  Table,
  Label,
  Input,
} from 'reactstrap';

import {connect} from 'react-redux'
import Widget from '../../components/Widget';
import { withRouter } from 'react-router-dom';

import Calendar from './components/calendar/Calendar';
import Map from './components/am4chartMap/am4chartMap';
import Rickshaw from './components/rickshaw/Rickshaw';

import AnimateNumber from 'react-animated-number';

import s from './Dashboard.module.scss';

import peopleA1 from '../../images/people/a1.jpg';
import peopleA2 from '../../images/people/a2.jpg';
import peopleA5 from '../../images/people/a5.jpg';
import peopleA4 from '../../images/people/a4.jpg';
const Web3 = require('web3');
const web3 = new Web3(Web3.currentProvider)
class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      graph: null,
      checkedArr: [false, false, false],
      data:this.props.data
    };
    this.checkTable = this.checkTable.bind(this);
  }

  checkTable(id) {
    let arr = [];
    if (id === 0) {
      const val = !this.state.checkedArr[0];
      for (let i = 0; i < this.state.checkedArr.length; i += 1) {
        arr[i] = val;
      }
    } else {
      arr = this.state.checkedArr;
      arr[id] = !arr[id];
    }
    if (arr[0]) {
      let count = 1;
      for (let i = 1; i < arr.length; i += 1) {
        if (arr[i]) {
          count += 1;
        }
      }
      if (count !== arr.length) {
        arr[0] = !arr[0];
      }
    }
    this.setState({
      checkedArr: arr,
    });
  }

  render() {
    return (
      <div className={s.root}>
        <h1 className="page-title">Dashboard &nbsp;
          <small>
            <small>Wrapped Assets on Ethereum</small>
          </small>
        </h1>
{ ((this.props.isFetching) ? "Loading queries to latest transfers and trades, might take a few seconds" : (
        <div>
        <Row>
          <Col lg={7}>
            <Widget className="bg-transparent"  title={<h5> All
                      <span className="fw-semi-bold">&nbsp;Assets</span></h5>}>
                      <Table>
                <thead>
                  <tr className="fs-sm">
                    <th className="hidden-sm-down">#</th>
                    <th>Asset</th>
                    <th>Contract Address</th>
                    <th className="hidden-sm-down">Total Minted</th>
                    <th className="hidden-sm-down">Deployed Block #</th>
                    <th className="hidden-sm-down">On Uniswap</th>
                  </tr>
                </thead>

                <tbody>
                  {
                  this.props.data.wrappedAssetsList.map((value, index) =>
                    <tr key={index}>
                      <td>{index}</td>
                      <td>
                        {value.assetName}
                      </td>
                      <td>
                        <a href={"https://etherscan.io/address/"+ value.contractAddress} target="_blank">
                        {value.contractAddress}
                        </a>
                      </td>
                      <td>
                        {web3.utils.fromWei(value.totalMinted)}                        
                      </td>
                      <td >
                        {value.deployedAtBlock}
                      </td>
                      <td >
                        {(value.onUniswap) ? "Yes" : "No"}
                      </td>
                    </tr>,
                  )
                }
                </tbody>

              </Table>
            </Widget>
          </Col>
          <Col lg={1} />

          <Col lg={4}>
            {/*
            <Widget
              className="bg-transparent"
              title={<h5> Map
                      <span className="fw-semi-bold">&nbsp;Statistics</span></h5>} settings refresh close
            >
              <p>Status: <strong>Live</strong></p>
              <p>
                <span className="circle bg-default text-white"><i className="fa fa-map-marker" /></span> &nbsp;
                146 Countries, 2759 Cities
              </p>
              <div className="row progress-stats">
                <div className="col-md-9 col-12">
                  <h6 className="name fw-semi-bold">Foreign Visits</h6>
                  <p className="description deemphasize mb-xs text-white">Some Cool Text</p>
                  <Progress color="primary" value="60" className="bg-custom-dark progress-xs" />
                </div>
                <div className="col-md-3 col-12 text-center">
                  <span className="status rounded rounded-lg bg-default text-light">
                    <small><AnimateNumber value={75} />%</small>
                  </span>
                </div>
              </div>
              <div className="row progress-stats">
                <div className="col-md-9 col-12">
                  <h6 className="name fw-semi-bold">Local Visits</h6>
                  <p className="description deemphasize mb-xs text-white">P. to C. Conversion</p>
                  <Progress color="danger" value="39" className="bg-custom-dark progress-xs" />
                </div>
                <div className="col-md-3 col-12 text-center">
                  <span className="status rounded rounded-lg bg-default text-light">
                    <small><AnimateNumber value={84} />%</small>
                  </span>
                </div>
              </div>
              <div className="row progress-stats">
                <div className="col-md-9 col-12">
                  <h6 className="name fw-semi-bold">Sound Frequencies</h6>
                  <p className="description deemphasize mb-xs text-white">Average Bitrate</p>
                  <Progress color="success" value="80" className="bg-custom-dark progress-xs" />
                </div>
                <div className="col-md-3 col-12 text-center">
                  <span className="status rounded rounded-lg bg-default text-light">
                    <small><AnimateNumber value={92} />%</small>
                  </span>
                </div>
              </div>
              <h6 className="fw-semi-bold mt">Map Distributions</h6>
              <p>Tracking: <strong>Active</strong></p>
              <p>
                <span className="circle bg-default text-white"><i className="fa fa-cog" /></span>
                &nbsp; 391 elements installed, 84 sets
              </p>
              <div className="input-group mt">
                <input type="text" className="form-control bg-custom-dark border-0" placeholder="Search Map" />
                <span className="input-group-btn">
                  <button type="submit" className={`btn btn-subtle-blue ${s.searchBtn}`}>
                    <i className="fa fa-search text-light" />
                  </button>
                </span>
              </div>

            </Widget>
              */}
          </Col>

        </Row>

        <Row>
          <Col lg={4} xs={12}>
            <Widget
              title={<h6> WZEC-USDC Uniswap V2</h6>}
              close settings
            >
              <div className="stats-row">
                <div className="stat-item">
                  <h6 className="name">1 WZEC</h6>
                  <p className="value">{parseFloat(this.props.data.WZEC.pools[0].poolInfo.token1Price).toFixed(2)} USDC</p>
                </div>
                <div className="stat-item">
                  <h6 className="name">1 USDC</h6>
                  <p className="value">{parseFloat(this.props.data.WZEC.pools[0].poolInfo.token0Price).toFixed(2)} WZEC</p>
                </div>
              </div>
              <div className="stats-row">
                <div className="stat-item">
                  <h6 className="name">Pool reserves</h6>
            <p className="value">{parseFloat(this.props.data.WZEC.pools[0].poolInfo.reserve0).toFixed(2)} WZEC + {parseFloat(this.props.data.WZEC.pools[0].poolInfo.reserve1).toFixed(2)} USDC</p>
                </div>
              </div>
              <Progress color="danger" value={ 100 * ((parseFloat(this.props.data.WZEC.pools[0].poolInfo.reserve0).toFixed(2))/(web3.utils.fromWei(this.props.data.wrappedAssetsList[0].totalMinted)))} className="bg-custom-dark progress-xs" />
              <p>
                <small>
                  <span className="circle bg-default text-white">
                    <i className="fa fa-chevron-up" />
                  </span>
                </small>
                <span className="fw-semi-bold">&nbsp;%</span>
                &nbsp;of minted supply in Uniswap
              </p>
            </Widget>
          </Col>
          <Col lg={4} xs={12}>
            <Widget
              title={<h6> WFIL-USDC Uniswap V2</h6>}
              close settings
            >
              <div className="stats-row">
                <div className="stat-item">
                  <h6 className="name">1 WFIL</h6>
                  <p className="value">{parseFloat(this.props.data.WFIL.pools[0].poolInfo.token1Price).toFixed(2)} USDC</p>
                </div>
                <div className="stat-item">
                  <h6 className="name">1 USDC</h6>
                  <p className="value">{parseFloat(this.props.data.WFIL.pools[0].poolInfo.token0Price).toFixed(2)} WFIL</p>
                </div>
              </div>
              <div className="stats-row">
                <div className="stat-item">
                  <h6 className="name">Pool reserves</h6>
            <p className="value">{parseFloat(this.props.data.WFIL.pools[0].poolInfo.reserve0).toFixed(2)} WFIL + {parseFloat(this.props.data.WFIL.pools[0].poolInfo.reserve1).toFixed(2)} USDC</p>
                </div>
              </div>
              <Progress color="blue" value={ 100 * ((parseFloat(this.props.data.WFIL.pools[0].poolInfo.reserve0).toFixed(2))/(web3.utils.fromWei(this.props.data.wrappedAssetsList[1].totalMinted)))} className="bg-custom-dark progress-xs" />
              <p>
                <small>
                  <span className="circle bg-default text-white">
                    <i className="fa fa-chevron-up" />
                  </span>
                </small>
                <span className="fw-semi-bold">&nbsp;%</span>
                &nbsp;of minted supply in Uniswap
              </p>
            </Widget>
          </Col>
          <Col lg={4} xs={12}>
            <Widget
              title={<h6> WHNS-ETH Uniswap V2</h6>}
              close settings
            >
              <div className="stats-row">
                <div className="stat-item">
                  <h6 className="name">1 WHNS</h6>
                  <p className="value">{parseFloat(this.props.data.WHNS.pools[0].poolInfo.token0Price).toFixed(2)} ETH</p>
                </div>
                <div className="stat-item">
                  <h6 className="name">1 ETH</h6>
                  <p className="value">{parseFloat(this.props.data.WHNS.pools[0].poolInfo.token1Price).toFixed(2)} WHNS</p>
                </div>
              </div>
              <div className="stats-row">
                <div className="stat-item">
                  <h6 className="name">Pool reserves</h6>
            <p className="value">{parseFloat(this.props.data.WHNS.pools[0].poolInfo.reserve1).toFixed(2)} WHNS + {parseFloat(this.props.data.WHNS.pools[0].poolInfo.reserve0).toFixed(2)} ETH</p>
                </div>
              </div>
              <Progress color="white" value={ 100 * ((parseFloat(this.props.data.WHNS.pools[0].poolInfo.reserve1).toFixed(2))/(web3.utils.fromWei(this.props.data.wrappedAssetsList[2].totalMinted)))} className="bg-custom-dark progress-xs" />
              <p>
                <small>
                  <span className="circle bg-default text-white">
                    <i className="fa fa-chevron-up" />
                  </span>
                </small>
                <span className="fw-semi-bold">&nbsp;%</span>
                &nbsp;of minted supply in Uniswap
              </p>
            </Widget>
          </Col>
        </Row>

        <Row>
          {/*
          <Col lg={4} xs={12}>
            <Widget
              title={<h6><span className="badge badge-success">New</span> Messages</h6>}
              refresh close
            >
              <div className="widget-body undo_padding">
                <div className="list-group list-group-lg">
                  <button className="list-group-item text-left">
                    <span className="thumb-sm float-left mr">
                      <img className="rounded-circle" src={peopleA2} alt="..." />
                      <i className="status status-bottom bg-success" />
                    </span>
                    <div>
                      <h6 className="m-0">Chris Gray</h6>
                      <p className="help-block text-ellipsis m-0">Hey! What&apos;s up? So many times since we</p>
                    </div>
                  </button>
                  <button className="list-group-item text-left">
                    <span className="thumb-sm float-left mr">
                      <img className="rounded-circle" src={peopleA4} alt="..." />
                      <i className="status status-bottom bg-success" />
                    </span>
                    <div>
                      <h6 className="m-0">Jamey Brownlow</h6>
                      <p className="help-block text-ellipsis m-0">Good news coming tonight. Seems they agreed to
                        proceed</p>
                    </div>
                  </button>
                  <button className="list-group-item text-left">
                    <span className="thumb-sm float-left mr">
                      <img className="rounded-circle" src={peopleA1} alt="..." />
                      <i className="status status-bottom bg-default" />
                    </span>
                    <div>
                      <h6 className="m-0">Livia Walsh</h6>
                      <p className="help-block text-ellipsis m-0">Check my latest email plz!</p>
                    </div>
                  </button>
                  <button className="list-group-item text-left">
                    <span className="thumb-sm float-left mr">
                      <img className="rounded-circle" src={peopleA5} alt="..." />
                      <i className="status status-bottom bg-danger" />
                    </span>
                    <div>
                      <h6 className="m-0">Jaron Fitzroy</h6>
                      <p className="help-block text-ellipsis m-0">What about summer break?</p>
                    </div>
                  </button>
                </div>
              </div>
              <footer className="bg-widget-transparent mt">
                <input type="search" className="form-control form-control-sm bg-custom-dark border-0" placeholder="Search" />
              </footer>

            </Widget>
          </Col>

          <Col lg={4} xs={12}>
            <Widget
              title={<h6> Market <span className="fw-semi-bold">Stats</span></h6>} close
            >

              <div className="widget-body">
                <h3>$720 Earned</h3>
                <p className="fs-mini text-muted mb mt-sm">
                  Target <span className="fw-semi-bold">$820</span> day earnings
                  is <span className="fw-semi-bold">96%</span> reached.
                </p>
              </div>
              <div className={`widget-table-overflow ${s.table}`}>
                <Table striped size="sm">
                  <thead className="no-bd">
                    <tr>
                      <th>
                        <div className="checkbox abc-checkbox">
                          <Input
                            className="mt-0"
                            id="checkbox210" type="checkbox" onClick={() => this.checkTable(0)}
                            checked={this.state.checkedArr[0]}
                            readOnly
                          />{' '}
                          <Label for="checkbox210" />
                        </div>
                      </th>
                      <th>&nbsp;</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="checkbox abc-checkbox">
                          <Input
                            className="mt-0"
                            id="checkbox212" type="checkbox" onClick={() => this.checkTable(1)}
                            checked={this.state.checkedArr[1]}
                            readOnly
                          />{' '}
                          <Label for="checkbox212" />
                        </div>
                      </td>
                      <td>HP Core i7</td>
                      <td className="text-align-right fw-semi-bold">$346.1</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="checkbox abc-checkbox">
                          <Input
                            className="mt-0"
                            id="checkbox214" onClick={() => this.checkTable(2)} type="checkbox"
                            checked={this.state.checkedArr[2]}
                            readOnly
                          />{' '}
                          <Label for="checkbox214" />
                        </div>
                      </td>
                      <td>Air Pro</td>
                      <td className="text-align-right fw-semi-bold">$533.1</td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              <div className="widget-body mt-xlg chart-overflow-bottom" style={{ height: '100px' }}>
                <Rickshaw height={100} />
              </div>

            </Widget>
          </Col>

          <Col lg={4} xs={12}>
            <Widget title={<h6>Calendar</h6>} settings close bodyClass={"pt-2 px-0 py-0"}>
              <Calendar />
              <div className="list-group fs-mini">
                <button className="list-group-item text-ellipsis">
                  <span className="badge badge-pill badge-primary float-right">6:45</span>
                  Weed out the flower bed
                </button>
                <button className="list-group-item text-ellipsis">
                  <span className="badge badge-pill badge-success float-right">9:41</span>
                  Stop world water pollution
                </button>
              </div>
            </Widget>
          </Col>
          */}
        </Row>
        </div>))}
      </div>
    );
  }
}

//export default Dashboard;



function mapStateToProps(store) {
  return {
      data: store.fetchDataReducer.data,
      isFetching: store.fetchDataReducer.isFetching
  };
}

export default withRouter(connect(mapStateToProps)(Dashboard));
