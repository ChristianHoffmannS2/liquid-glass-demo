import React from "react";


const BasicComponent = async () => {

  const time = (new Date()).toLocaleTimeString();
  return (
    <div>
      <h2>Hello from BasicComponent!</h2>
      <p>This is a simple React component rendering some content.</p>
      <p>SSR render time: {time}</p>
    </div>
  );
}

export default BasicComponent;