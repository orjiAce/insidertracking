// routes
import {Provider} from "react-redux";
import {PersistGate} from 'redux-persist/integration/react'
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';

import {persistor, store} from "./app/store";

// ----------------------------------------------------------------------

export default function App() {
  return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
        </PersistGate>
      </Provider>
  );
}
