/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import nodejs from 'nodejs-mobile-react-native'
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import Canvas, {Image as CanvasImage} from 'react-native-canvas'
import { NativeModules } from 'react-native';

const { ToastExample } = NativeModules.ToastExample;

console.log("+++++++++++++++++++++++++++++");
console.log(ToastExample);
console.log("+++++++++++++++++++++++++++++");

const staticuri = 'content://com.google.android.apps.photos.contentprovider/-1/1/content%3A%2F%2Fmedia%2Fexternal%2Fimages%2Fmedia%2F25862/ORIGINAL/NONE/image%2Fjpeg/541359684'
const staticuri1 = '/storage/emulated/0/DCIM/Camera/IMG_20200513_100012369.jpg'
const staticuri2 = './images/image-rect.png'

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialImageLoaded : false,
      imgsource : {uri : 'https://images.wagwalkingweb.com/media/articles/care/why-is-my-dog-sneezing-blood/why-is-my-dog-sneezing-blood.jpg'},
      phashresult : '',
      pickImageDisabled : false
    };
    this.pickImage = this.pickImage.bind(this);
    this.handleCanvas = this.handleCanvas.bind(this);
    nodejs.start('main.js');
    nodejs.channel.addListener(
      'message',
      this.nodejsListener,
      this
    );
  }


  nodejsListener(msg) {
   //  alert('From node: ' + msg);
    this.setState({
      phashresult : `pHash: ${msg}`,
      pickImageDisabled : false
    });
    console.log(JSON.stringify(this.state));
  }

  myfun(canvas, uri) {
    console.log(`URI: ${uri}`);
    let canvasImage = new CanvasImage(canvas);
    canvasImage.src = uri;
    canvas.width = canvasImage.width;
    canvas.height = canvasImage.height;
    let context = canvas.getContext('2d');
    context.drawImage(canvasImage, 0, 0, canvasImage.width, canvasImage.height);
    console.log ('-------------------------------------')
//     console.log(context.getImageData(0, 0, canvasImage.width, canvasImage.height).data);
    console.log(`Width: ${canvasImage.width}, Height: ${canvasImage.height}`);
    console.log ('-------------------------------------')
    
  }

  handleCanvas1 = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 0, 100, 100);
    console.log(ctx.getImageData(0, 0, 100, 100))
  }
  handleCanvasX = (uri) => {
      var canvas = <Canvas/>;
      console.log(">>>>>>>>>>>>Called again<<<<<<<<<<<<<<<<<<")
      const image = new CanvasImage(canvas);
      const ctx = canvas.getContext('2d');
      //image.src = "https://images.wagwalkingweb.com/media/articles/care/why-is-my-dog-sneezing-blood/why-is-my-dog-sneezing-blood.jpg";
      image.src = uri;
      //image.src = require(staticuri1)
      canvas.width = 100;
      canvas.height = 100;
      image.addEventListener('load', () => {
        console.log('--------------------------');
        console.log(`Width: ${image.width}, Height: ${image.height}`);
        console.log('--------------------------');
        //canvas.width = image.width;
        // canvas.height = image.height;
        // ctx.drawImage(image, 0, 0, image.width, image.width);
        ctx.drawImage(image, 0, 0, 100, 100);
        /*ctx.getImageData(0,0,canvas.width, canvas.height).then(imgData => {
          const data = Object.values(imgData.data);
          const length = Object.keys(imgData).length;
          console.log(`Length: ${length}, Data: ${(JSON.stringify(imgData.data, null, 2)).substring(0,100)}`);
        });*/
      });
  }
  handleCanvas = (canvas) => {
    console.log(">>>>>>>>>>>>Called again")
    const image = new CanvasImage(canvas);
    //const pImage = new Image();
    console.log('abc');
    console.log(require(staticuri2))
    //pImage.source = require(staticuri2)
    const ctx = canvas.getContext('2d');
    //image.src = "https://images.wagwalkingweb.com/media/articles/care/why-is-my-dog-sneezing-blood/why-is-my-dog-sneezing-blood.jpg";
    image.src = this.state.imgsource.uri;
    //image.src = require(staticuri1)
    canvas.width = 100;
    canvas.height = 100;
    image.addEventListener('load', () => {
      console.log('--------------------------');
      console.log(`Width: ${image.width}, Height: ${image.height}`);
      console.log('--------------------------');
      //canvas.width = image.width;
      // canvas.height = image.height;
      // ctx.drawImage(image, 0, 0, image.width, image.width);
      ctx.drawImage(image, 0, 0, 100, 100);
      /*ctx.getImageData(0,0,canvas.width, canvas.height).then(imgData => {
        const data = Object.values(imgData.data);
        const length = Object.keys(imgData).length;
        console.log(`Length: ${length}, Data: ${(JSON.stringify(imgData.data, null, 2)).substring(0,100)}`);
      });*/
    });
  }

  pickImage() {
    ImagePicker.launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        // console.log(`Sourcexx: ${JSON.stringify(response.path, null,2)}`)
        console.log(`Sourcexx: ${response.path}`);
        console.log(`Source: ${JSON.stringify(source)}`)
        this.setState({
          initialImageLoaded : true,
          imgsource : source,
          pickImageDisabled : true,
          phashresult : 'Computing pHash. Please wait...'
        });
        this.nodejsListener('merihash');
        NativeModules.ToastExample.show('Awesome', ToastExample.SHORT);
        //this.handleCanvasX(source.uri);
    
        
        // nodejs.channel.send(response.path);
      }
    });
  }


  render() {
    return (<View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Compute pHash on phone demo</Text>
      <Image source={
        !this.state.initialImageLoaded ? require('./images/image_placeholder.png') : this.state.imgsource
      } style={{width: '100%', height: 200,resizeMode : 'stretch' }}></Image>
      <Button title="Pick Image"
        onPress={this.pickImage} disabled={this.state.pickImageDisabled}></Button>
      <Text style={styles.sectionDescription}>{this.state.phashresult}</Text>
      <Canvas ref={this.handleCanvas}/>
    </View>);
  }
}

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

const App: () => React$Node = () => {
  return (
    <>
    <MyComponent></MyComponent>
    </>);
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  }
});

export default App;
