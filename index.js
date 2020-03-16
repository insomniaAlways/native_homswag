/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import moment from 'moment';

// console.log('index load', moment().format('mm:ss, SS'))

AppRegistry.registerComponent(appName, () => App);
