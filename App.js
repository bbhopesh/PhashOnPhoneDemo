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

import PHashNative from './PHashNative';

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
  }


  nodejsListener(msg) {
    this.setState({
      phashresult : `pHash: ${msg}`,
      pickImageDisabled : false
    });
    console.log(JSON.stringify(this.state));
  }

  callComputePhash(path) {
    PHashNative.computePHash(path).then((pHashResult) => {
      console.log(`Phash: ${pHashResult.pHash}`);
      console.log(`Runtime: ${pHashResult.Runtime}`);
      this.nodejsListener(pHashResult.pHash);
    })
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
        this.setState({
          initialImageLoaded : true,
          imgsource : source,
          pickImageDisabled : true,
          phashresult : 'Computing pHash. Please wait...'
        });
        this.callComputePhash(response.path);
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
