/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image
} from 'react-native';
import ImagePicker from 'react-native-image-picker'

import ToastExample from './ToastExample';
import blockhash from './blockhashcore'

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
  }


  nodejsListener(msg) {
    this.setState({
      phashresult : `pHash: ${msg}`,
      pickImageDisabled : false
    });
    console.log(JSON.stringify(this.state));
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
        ToastExample.show('Awesome', ToastExample.SHORT);
        let startTime = Date.now();
        ToastExample.getPixels(response.path).then((image) => {
          console.log("----------------------");
          console.log(image.width);
          console.log(image.height);
          console.log(image.hasAlpha);
          console.log(`Total time writing Writeable array: ${image["Start time"]}`);
          console.log(`Total time getPixels: ${image["End time"]}`);
          console.log(Date.now() - startTime);
          // console.log(image.data);
          let hashC = blockhash.bmvbhash(image, 8);
          this.nodejsListener(hashC);
        }).catch(err => {
          console.log('***********************');
          console.log(err);
        });
        // NativeModules.ToastExample.show('Awesome', ToastExample.SHORT);
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
