// import $ from 'jquery';
import _ from 'lodash';
import { useFlyOnUI } from './hooks/use-init-flyoui';
import { AppRoutes } from './routes';
import { useEffect } from 'react';
import { initializeTheme } from './hooks/use-appearance';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from './states/hooks';
import { setErrorMsg } from './states/slice/app-slice';

// window.$ = $;
// window.jQuery = $;
window._ = _;

function App() {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch()
  useFlyOnUI()

  initializeTheme();

  useEffect(() => {
    dispatch(setErrorMsg(''))
  }, [pathname]);

  return (<div>
    <AppRoutes />
  </div>
  );
}

export default App;