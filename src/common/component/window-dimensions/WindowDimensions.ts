import {useEffect, useState} from "react";

function getWindowWidthHeight() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function WindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowWidthHeight());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowWidthHeight());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

export default WindowDimensions;