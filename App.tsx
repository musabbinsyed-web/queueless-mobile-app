/**
 * QueueLess
 * @format
 */
console.log('App starting execution...');

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';

import { Provider } from 'react-redux';
import { store } from './src/store';

function App() {
  console.log('[App] Rendering Provider...');
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
