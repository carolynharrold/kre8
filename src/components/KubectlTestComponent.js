import React from "react";
import '../styles.css'
import clouds from '../assets/clouds.jpeg'
import star from '../assets/Star.png'
import cube from '../assets/3d-cube.jpg'
import sphere from '../assets/Blue_sphere.png'

const KubectlTestComponent = props => {

  const pods = props.pods.map(pod => {
    return (
      <div>
        <img src={sphere} alt='Pod'/>
      </div>
    )
  });

  const deployments = props.deployments.map(deployment => {
    return (
      <div>
        <img src={cube} alt='Deployment'/>
      </div>
    )
  });

  const services = props.services.map(service => {
    return (
      <div>
        <img src={star} alt='Service'/>
      </div>
    )
  });


  return (
    <div>   
      <img src={clouds} alt="Clouds" className="image"/>;

      <br />
      <br />
      <div className="section">
        <form className="createAPod">
          <h2>Create and Deploy a Pod</h2>
            <h4>Pod name:</h4>
              <input id='pod_podName' value={props.pod_podName} onChange={props.handleChange} type="text" name="pod-name" />
              {/* <input type="text" name="Pod name" /> */}
            <h4>Container name:</h4>
            <input id='pod_containerName' value={props.pod_containerName} onChange={props.handleChange} type="text" name="Container name" />
            <h4>Image:</h4>
              <input id='pod_imageName' value={props.pod_imageName} onChange={props.handleChange} type="text" name="Image name" />
            <br />
        </form>
        <button onClick={props.handleCreatePod} className="buttons">Create a Pod</button>
      </div>

      <br />
      <br />
      <div className="section">
        <form>
          <h2>Create a Deployment</h2>
            <h4>Deployment name:</h4>
              <input id='deployment_deploymentName' value={props.deployment_deploymentName} onChange={props.handleChange} type="text" name="Deployment name" />
              <br />
            <h4>App name:</h4>
              <input id='deployment_appName' value={props.deployment_appName} onChange={props.handleChange} type="text" name="App name" />
              <br />
            <h4>Container name:</h4>
              <input id='deployment_containerName' value={props.deployment_containerName} onChange={props.handleChange} type="text" name="Container name" />
              <br />
            <h4>Image:</h4>
              <input id='deployment_image' value={props.deployment_image} onChange={props.handleChange} type="text" name="Image name" />
              <br />
            <h4>Container Port:</h4>
              <input id='deployment_containerPort' value={props.deployment_containerPort} onChange={props.handleChange} type="text" name="Container port" />
              <br />
            <h4>Number of replicas:</h4>
              <input id='deployment_replicas' value={props.deployment_replicas} onChange={props.handleChange} type="text" name="Replicas" />
              <br />
          </form>
          <br />
          <button onClick={props.handleCreateDeployment} className="buttons">
          Create a Deployment
          </button>
      </div>

      <br />
      <br />
      <div className="section">
        <form>
          <h4>Service name:</h4>
            <input id='service_name' value={props.service_name} onChange={props.handleChange} type="text" name="Service name" />
          <h4>App name:</h4>
            <input id='service_appName' value={props.service_appName} onChange={props.handleChange} type="text" name="App name" />
          <h4>Port:</h4>
            <input id='service_port' value={props.service_port} onChange={props.handleChange} type="text" name="Port" />
          <h4>Target port:</h4>
            <input id='service_targetPort' value={props.service_targetPort} onChange={props.handleChange} type="text" name="Target Port" />
          <br />
        </form>
        <br />
        <button onClick={props.handleCreateService} className="buttons">Create a Service</button>
      </div>

      
        {/* <img src={sphere} alt="pod" className="pod"/>
        {/* {props.podName}/> */}
        {/* <img src={cube} alt="deployment" className="deployment"/>; */}
        {/* {props.deploymentName} */}
        {/* <img src={star} alt="service" className="service"/>; */}

        {/* {props.serviceName} */}
    <div>
      {pods}
      {deployments}
      {services}
    </div>

    </div>
  );
};

export default KubectlTestComponent;
