# Graph2D.js

> React Library for interactive navigation of graphs of 2d functions.


## Install

```bash
npm install -f graph2d.js
```

## Example Usage

```jsx
import React, { Component } from 'react'
import {Graph2D} from 'graph2d.js'

function App() {
  return (
    <div className="App">
        <Graph2D width={400} height={400} 

        htmlStyle={{"border": "1px solid red"}} // for html
        canvasStyle={{
          function: {shadowBlur: 10, shadowColor: "red"}
        }} // for getContext("2d")
        functions={[ 
          [x => 0.5 * x * x, "red"],
          [x => x - 2, "white"]
        ]}
          />
    </div>
  )
}

export default App;
```

## License

MIT © [Greece4ever](https://github.com/Greece4ever)
