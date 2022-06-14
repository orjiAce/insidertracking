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
import {QueryClientProvider, QueryClient} from 'react-query'

// ----------------------------------------------------------------------
import { enableIndexedDbPersistence } from "firebase/firestore";
import {db} from "./firebase";

enableIndexedDbPersistence(db)
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
        }
    });
export default function App() {
    const queryClient = new QueryClient()
  return (

      <Provider store={store}>
          <QueryClientProvider client={queryClient}>
        <PersistGate loading={null} persistor={persistor}>
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
        </PersistGate>
          </QueryClientProvider>
      </Provider>
  );
}
