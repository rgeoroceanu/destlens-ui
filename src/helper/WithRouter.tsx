import React from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';

// @ts-ignore
function withRouter(Component) {
  // @ts-ignore
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} {...{location, navigate, params}} />;
  }

  return ComponentWithRouterProp;
}

export default withRouter;