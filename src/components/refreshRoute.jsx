import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const RefreshRoute = ({ component: Component, isDataAvailable:isDataAvailable}) => (
  <Route
    render={props =>
      isDataAvailable ? (
        <Component />
      ) : (
        <Redirect
          to={{
            pathname: "/"
          }}
        />
      )
    }
  />
);

const mapStateToProps = state => ({
  isDataAvailable: state.Acc
});

export default connect(mapStateToProps)(RefreshRoute);
