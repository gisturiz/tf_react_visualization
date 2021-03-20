// Import dependencies
import React, { useState, useRef, useEffect, useCallback } from "react";
import "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from './utilities';
import { isMobile } from 'react-device-detect';
import switchCamImg from './icons8-switch-camera-96.png';

function App() {
  // Camera state
  const facing_user = 'user';
  const facing_env = 'environment';
  const [facingMode, setFacingMode] = useState(facing_user);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const obj = await net.detect(video);
      console.log(obj);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // Pass in argument to draw function
      drawRect(obj, ctx);
    }
  };

  const switchCamera = useCallback(() => {
    setFacingMode(
      prevState =>
        prevState === facing_user ? facing_env : facing_user
    );
  }, []);

  useEffect(() => { runCoco() });

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          videoConstraints={{ facingMode }}
          style={{
            position: 'absolute',
            textAlign: 'center',
            zindex: 9,
            width: '80vw',
            height: '80wh',
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            textAlign: 'center',
            zindex: 8,
            width: '80vw',
            // height: '80vh',
          }}
        />
        {isMobile ? (<img onClick={switchCamera} src={switchCamImg} alt="switch camera" style={{ position: 'absolute', bottom: '15px', width: '30px', cursor: 'pointer' }} />) : null}
      </header>
    </div>
  );
}

export default App;
