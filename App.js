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

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialImageLoaded : false,
      imgsource : {},
      phashresult : '',
      pickImageDisabled : false
    };
    this.pickImage = this.pickImage.bind(this);
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
        nodejs.channel.send(response.path);
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
