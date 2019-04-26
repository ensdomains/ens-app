import ReactGA from 'react-ga';
const TrackingID = 'UA-138903307-1'

function isProduction(){
  return window.location.host === 'manager.ens.domains'  
}

export const setup = () => {
  if(isProduction()){
    ReactGA.initialize(TrackingID);
  }
}

export const pageview = () => {
  const page = window.location.pathname + window.location.search
  if(isProduction()){
    ReactGA.pageview(page);
  }
}

export default {
  setup, pageview
}
