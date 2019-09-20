import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, RouteProps } from 'react-router-dom';
import store from 'store';

import { MyIdeas, NotFound, SignUp, LogIn } from './pages';
import { Sidemenu } from './components';
import * as api from './utils/api';
import { User } from './utils/types';

type State = {
  avatarUrl: string;
  isLoading: boolean;
  jwt: string;
  name: string;
  refreshToken: string;
};

class App extends React.Component<{}, State> {
  state = {
    avatarUrl: '',
    isLoading: true,
    jwt: '',
    name: '',
    refreshToken: '',
  };

  componentDidMount() {
    this.init();
  }

  async init() {
    const refreshToken = store.get('refresh_token');
    if (refreshToken) {
      this.setState({ refreshToken });
      try {
        await this.refreshToken(refreshToken);
        await this.getUser();
      } catch (error) {
        console.error(error);
      }
    }
    this.setState({ isLoading: false });
  }

  getUser = async () => {
    const data = await api.getUser(this.state.jwt);
    // add name, avatarUrl
    this.setState(data);
  };

  refreshToken = async (refreshToken: string) => {
    const jwt = await api.refreshToken(refreshToken);
    this.setState({ jwt });
    store.set('jwt', jwt);
  };

  onSignUp = async (user: User) => {
    try {
      const data = await api.signUp(user);
      this.onAccessGranted(data);
      await this.getUser();
    } catch (error) {
      console.error(error);
      if (error.response.data.reason) alert(error.response.data.reason);
    }
  };

  onLogIn = async (user: User) => {
    try {
      const data = await api.onLogIn(user);
      this.onAccessGranted(data);
      await this.getUser();
    } catch (error) {
      console.error(error);
      if (error.response.data.reason) alert(error.response.data.reason);
      throw error;
    }
  };

  onAccessGranted = (data: { jwt: string; refreshToken: string }) => {
    this.setState(data);
    store.set('jwt', data.jwt);
    store.set('refresh_token', data.refreshToken);
  };

  onLogOut = () => {
    this.setState({ jwt: '', refreshToken: '' });
    store.clearAll();
  };

  render() {
    const { name, avatarUrl, jwt, isLoading } = this.state;

    const isAuthenticated = jwt.length > 0;

    if (isLoading) return null;

    const MainProps = {
      isAuthenticated,
      name,
      avatarUrl,
      onLogOut: this.onLogOut,
    };

    return (
      <Router>
        <Switch>
          <UnprotectedRoute
            exact
            path="/signup"
            isAuthenticated={isAuthenticated}
            component={() => (
              <Main {...MainProps}>
                <SignUp onSignUp={this.onSignUp} />
              </Main>
            )}
          />
          <UnprotectedRoute
            exact
            path="/login"
            isAuthenticated={isAuthenticated}
            component={() => (
              <Main {...MainProps}>
                <LogIn onLogIn={this.onLogIn} />
              </Main>
            )}
          />
          <ProtectedRoute
            exact
            path="/"
            isAuthenticated={isAuthenticated}
            component={() => (
              <Main {...MainProps}>
                <MyIdeas jwt={jwt} />
              </Main>
            )}
          />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

type MainProps = {
  isAuthenticated: boolean;
  avatarUrl: string;
  name: string;
  onLogOut: () => void;
};

export const Main: React.FunctionComponent<MainProps> = ({ isAuthenticated, avatarUrl, name, onLogOut, children }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-2">
          <Sidemenu isLoggedIn={isAuthenticated} name={name} avatarUrl={avatarUrl} onLogout={onLogOut} />
        </div>

        {children}
      </div>
    </div>
  );
};

export interface ProtectedRouteProps extends RouteProps {
  isAuthenticated: boolean;
}

export class ProtectedRoute extends Route<ProtectedRouteProps> {
  render() {
    if (!this.props.isAuthenticated) {
      const redirectPath: string = '/login';
      const renderComponent = () => <Redirect to={{ pathname: redirectPath }} />;
      return <Route {...this.props} component={renderComponent} render={undefined} />;
    }
    return <Route {...this.props} />;
  }
}

export class UnprotectedRoute extends Route<ProtectedRouteProps> {
  render() {
    if (this.props.isAuthenticated) {
      const redirectPath: string = '/';
      const renderComponent = () => <Redirect to={{ pathname: redirectPath }} />;
      return <Route {...this.props} component={renderComponent} render={undefined} />;
    }
    return <Route {...this.props} />;
  }
}

export default App;
