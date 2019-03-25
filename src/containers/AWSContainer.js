import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { Switch, Route, withRouter } from 'react-router-dom';

import * as yup from 'yup';

import * as actions from '../store/actions/actions.js';
import * as events from '../../eventTypes';

import AWSComponent from '../components/AWSComponent'
import AWSLoadingComponent from '../components/AWSLoadingComponent'
import HelpInfoComponent from '../components/HelpInfoComponent';

// import SimpleReactValidator from 'simple-react-validator';


//** -------------- REDUX ----------------------------------- **//

const mapStateToProps = store => ({

});

const mapDispatchToProps = dispatch => ({
  setNewRole: (text) => {
    dispatch(actions.setRole(text))
  },
  hideCreateButton: () => {
    dispatch(actions.hideCreateButton())
  }
});

class AwsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iamRoleName: '',
      vpcStackName: '',
      clusterName: '',

      awsComponentSubmitted: false,

      iamRoleStatus: 'CREATING',
      stackStatus:'—',
      clusterStatus:'—',
      workerNodeStatus: '—',
      kubectlConfigStatus: '—',
      errorMessage: '',

      textInfo: '',
      showInfo: false,
      mouseCoords: {},

      errors: {},
      displayError: false,

    }

    // this.validator = new SimpleReactValidator({
    //   element: (message, className) => <div className="errorClass">{message}</div>
    // });

    this.handleChange = this.handleChange.bind(this);

    this.handleStatusChange = this.handleStatusChange.bind(this);

    this.handleConfigAndMakeNodes = this.handleConfigAndMakeNodes.bind(this);
    this.handleNewNodes = this.handleNewNodes.bind(this);

    this.handleError = this.handleError.bind(this);

    this.displayInfoHandler = this.displayInfoHandler.bind(this);
    this.hideInfoHandler = this.hideInfoHandler.bind(this);

    // this.testFormValidation = this.testFormValidation.bind(this);

  }


  //** -------------- COMPONENT LIFECYCLE METHODS ----------------- **//

  //Once component mounts, activate listeners, to receive data from AWS regarding the cluster creation process
  componentDidMount() {
    this.props.hideCreateButton();
    ipcRenderer.on(events.HANDLE_STATUS_CHANGE, this.handleStatusChange);
    ipcRenderer.on(events.HANDLE_ERRORS, this.handleError);
    ipcRenderer.on(events.HANDLE_NEW_NODES, this.handleNewNodes);
  }

  // On component unmount, unsubscribe to listeners
  componentWillUnmount() {
    ipcRenderer.removeListener(events.HANDLE_STATUS_CHANGE, this.handleStatusChange);
    ipcRenderer.removeListener(events.HANDLE_ERRORS, this.handleError);
    ipcRenderer.removeListener(events.HANDLE_NEW_NODES, this.handleNewNodes);
  }

  //** -------------- EVENT HANDLERS ------------------------------ **//

  //Method handling text changes for form input fields
  handleChange(e) {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  }

  // testFormValidation() {
  //   if (this.validator.allValid()) {
  //     return true;
  //   } else {
  //     this.validator.showMessages();
  //     this.forceUpdate();
  //     return false;
  //   }
  // }

  // Handlers to trigger events that will take place in the main thread

  //** --------- CONFIGURE CLUSTER + KUBECTL ------------------ **//
  //Triggered when user submits cluster data

  handleConfigAndMakeNodes() {
   // e.preventDefault();

    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    console.log('Submit Clicked!!! State:', this.state);

    const clusterData = {
        iamRoleName: this.state.iamRoleName,
        vpcStackName: this.state.vpcStackName,
        clusterName: this.state.clusterName, 
    }

    const clusterDataSchema = yup.object().strict().shape({
      iamRoleName: yup.string().required(),
      vpcStackName: yup.string().required(),
      clusterName: yup.string().required(),
    })
    clusterDataSchema.validate(clusterData, { abortEarly: false })
      .then((data) => {
        console.log("!!!!!!!!!!!!!!!!!!!!!!error didnt ocurr")

        console.log('from clusterDataSchema data:', data);
        this.setState({ ...this.state, iamRoleName: '',  vpcStackName: '', clusterName: '', errors: {}, awsComponentSubmitted: true })
        console.log("ready to send data")
        // ipcRenderer.send(events.CREATE_CLUSTER, clusterData);
      })
      .catch((err) => {
        console.log("!!!!!!!!!!!!!!!an error occurred");
        console.log('!!!!!!!!!!!!!!!!!!err', err);
        const errorObj = err.inner.reduce((acc, error) => {
          console.log("Error: ", error)
          acc[error.path] = error.message;
          return acc;
        }, {});
        this.setState({ ...this.state, errors: errorObj })
      })
  }
  // 

  //   if (this.testFormValidation()) {
  //     console.log("All form data passed validation");
  //     console.log('data to send!!', this.state);

  //     ipcRenderer.send(events.CREATE_CLUSTER, clusterData);
  //     this.setState({ ...this.state, awsComponentSubmitted: true});

  //   } else {
  //     console.log("Invalid or missing data entry");
  //   }
  // }
  
  //Activated after last step in cluster creation process is complete. If kubectl is successfully configured:
  handleNewNodes(event, data) {
    console.log('kubectl has been configured and worker nodes have been made from the main thread:', data);
    this.props.history.push('/cluster');
  }

    //** --------- CREATING CLUSTER, TRIGGERED AS AWS SENDS STATUS & ERROR DATA BACK -------- **//

    handleStatusChange(event, data) {
      this.setState({ ...this.state, [data.type]: data.status});
    }
  
    handleError(event, data) {
      console.log("state from error: ", this.state);
      console.log("data", data)
      console.log("error message: ", data.type)
      console.log("error message: ", data.status)
      console.log("error message: ", data.errorMessage)
  
      this.setState({ 
        ...this.state, 
        [data.type]: data.status,
        errorMessage: data.errorMessage,
      }),
      console.log("state after error: ", this.state);
    }

  //** --------- More Info Component -------------- **//
  displayInfoHandler(e){
    const aws_info = 'Amazon Web Services Elastic Container Service for Kubernetes (EKS) Account Setup. Your Identity and Access Management (IAM) Role for EKS is the AWS identity that will have specific permissions to create and manage your Kubernetes Cluster. For the Role Name, select something that will easily identify the role’s purpose. Example: unique-EKS-Management-Role. Your AWS VPC Stack represents a collection of resources necessary to manage and run your Kubernetes cluster. For the Stack Name, select something that will easily identify the stack’s purpose. Example: unique-EKS-Stack. An EKS Cluster consists of two primary components: The Amazon EKS control plane and Amazon EKS worker nodes that run the Kubernetes etcd and the Kubernetes API server. For the Cluster Name, select something that will easily identify the stack’s purpose. Example: unique-EKS-Cluster. Once submitted, this phase takes 10-15 minutes to complete, depending on Amazon’s processing time. Kre8 cannot proceed until your EKS Account has been set up.'

    const x = e.screenX;
    const y = e.screenY;
    const newCoords = {top: y, left: x}
    this.setState({...this.state, textInfo: aws_info, mouseCoords: newCoords, showInfo: true})
  }

  //HIDE INFO BUTTON CLICK HANDLER
  hideInfoHandler(){
    this.setState({...this.state, showInfo: false})
  }

  
  render() {
    const { 
      iamRoleName,
      vpcStackName,
      clusterName,

      iamRoleStatus,
      stackStatus,
      clusterStatus,
      workerNodeStatus,
      kubectlConfigStatus,

      textInfo,
      showInfo,
      mouseCoords, 

      displayError,
      errorMessage,
      errors,
     } = this.state;

     console.log("this.state in AWS: ", this.state);



    return (
      <div className="aws_cluster_page_container">
        {showInfo === true && (
        <HelpInfoComponent 
          textInfo={textInfo}
          hideInfoHandler={this.hideInfoHandler}
          mouseCoords={mouseCoords}
        />
        )}

        {this.state.awsComponentSubmitted === false && (
          <AWSComponent 
            handleChange={this.handleChange}

            iamRoleName={iamRoleName}
            vpcStackName={vpcStackName}
            clusterName={clusterName}
            errors={errors}
      
            handleConfigAndMakeNodes={this.handleConfigAndMakeNodes}

            textInfo={textInfo}
            hideInfoHandler={this.hideInfoHandler}
            mouseCoords={mouseCoords}
            displayInfoHandler={this.displayInfoHandler}
            grabCoords={this.grabCoords}
            /> 
          )}

        {this.state.awsComponentSubmitted === true && (
        <AWSLoadingComponent
          handleChange={this.handleChange}
          iamRoleName={iamRoleName}
          vpcStackName={vpcStackName}
          clusterName={clusterName}

          iamRoleStatus={iamRoleStatus}
          stackStatus={stackStatus}
          clusterStatus={clusterStatus}
          workerNodeStatus={workerNodeStatus}
          kubectlConfigStatus={kubectlConfigStatus}
          errorMessage={errorMessage}  
          /> 
        )}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AwsContainer));

    {/* handleCreateRole={this.handleCreateRole} 
          emitInstallAuthenticator={this.emitInstallAuthenticator}
          handleCreateTechStack={this.handleCreateTechStack}
          handleCreateCluster={this.handleCreateCluster} */}