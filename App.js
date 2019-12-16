

import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';

import {
  StyleSheet,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';

console.disableYellowBox = true;

var firebase = require("firebase");

var config = {
  apiKey: " AIzaSyDE-c3HQSoyTMmPveIb-QE51jBx_nrDd-s ",
  authDomain: "reactchat-1d263.firebaseapp.com",
  databaseURL: "https://reactchat-1d263.firebaseio.com",
  storageBucket: "bucket.appspot.com"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

var database = firebase.database();

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


class FlatView extends Component{

  render() {
    return(
      <View>
        <Text></Text>
        <Text style={[this.props.userid==this.props.myid? styles.rigthView:styles.leftView]}> {this.props.itemx} </Text>
      </View>
    );
  }
}

class InputPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {text:'',data: []};
    this.lol=this.lol.bind(this);
    this.manageIncomming=this.manageIncomming.bind(this);
  }

  async componentWillMount(){
    try {
      const value = await AsyncStorage.getItem('sessionid');
      
      if (value !== null) {
        let sessionid=value
        
        this.setState({sessionid})
      }else{
        let sessionid=uuidv4()
        this.setState({sessionid})
        
        await AsyncStorage.setItem('sessionid', sessionid);
      }
    } catch (error) {
      // Error retrieving data
      let sessionid=uuidv4()
      this.setState({sessionid})
      
      await AsyncStorage.setItem('sessionid', sessionid);
    }
   }

  componentDidMount() {
    
    var messageListner = database.ref('messages/');
    messageListner.on('value',this.manageIncomming );
  }



  manageIncomming(snapshot){
    try{
      let data=[]
      for (const [key, value] of Object.entries(snapshot.val())) {
          data.unshift(value)
      }
      this.setState({data})
    }catch(error){

    }
 
  }
  
  lol(){
  
    let textx=this.state.text
    if(textx!=""){
    let userid=this.state.sessionid
    
    database.ref('messages/').push({
      textx,
      userid
      }).then((data)=>{
        
     }).catch((error)=>{
       
      })
   
    let text=""
    this.setState({text})
  }else{
    Toast.show("Message field can't be empty.");
  }
  }
  render() {
    return (
      <View style={{flex:1}}>
          <FlatList
          inverted

          data={this.state.data}
          renderItem={({item}) => <FlatView itemx={item.textx} userid={item.userid} myid={this.state.sessionid}/>}
        />
        <View style={{ justifyContent: 'flex-end', marginBottom: 0}}>

        <View style={{flexDirection: 'row',margin:5}}>
          <TextInput
              style={{height: 50,flex:1,borderColor: 'gray',padding:10,borderWidth: 2, borderRadius: 20,  margin: 5, fontSize: 18,bottom:0 }}
              placeholder="Type message here!"
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
          />
          <TouchableOpacity  onPress={this.lol}>
            <View style={{backgroundColor:"green",width:50,height:50,borderWidth: 2,borderRadius: 20,margin:5}}>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    );
  }
}

const App: () => React$Node = () => {
  return (
    <> 
      <InputPanel />
    </>
  );
};

const styles = StyleSheet.create({
  rigthView:{
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
    alignSelf:"flex-end"
  },
  leftView:{
    color: 'red',
    fontWeight: 'bold',
    fontSize: 30,
    alignSelf:"flex-start"
  }
});

export default App;
