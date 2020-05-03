// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

// const filePath = '/storage/emulated/0/DCIM/Camera/IMG_20200502_131539052.jpg';

const rn_bridge = require('rn-bridge');
const imghash = require('imghash');
// Echo every message received from react-native.
rn_bridge.channel.on('message', (filePath) => {
  //imghash.hash('hello')
  imghash.hash(filePath)
  .then( (phash) => {
    rn_bridge.channel.send(`${phash}`);
  })
  .catch( (err) => {
    rn_bridge.channel.send(`Err: ${err}`)
  });
  // rn_bridge.channel.send(msg);
} );

// Inform react-native node is initialized.
//rn_bridge.channel.send("Node was initialized.");