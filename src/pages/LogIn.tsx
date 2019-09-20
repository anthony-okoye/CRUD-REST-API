import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  onLogIn: ({ email, password }: { email: string; password: string }) => Promise<any>;
};

type State = {
  email: string;
  password: string;
};

class LogIn extends React.Component<Props, State> {
  state = {
    email: '',
    password: '',
  };

  onLogIn = async (event: React.FormEvent<HTMLFormElement>) => {
    const { email, password } = this.state;
    event.preventDefault();
    try {
      await this.props.onLogIn({ email, password });
    } catch (error) {
      console.error(error);
    }
  };

  onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ email: event.target.value });

  onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ password: event.target.value });

  render() {
    return (
      <div className="col d-flex flex-column justify-content-center">
        <div className="sign-up-log-in text-center mt-3">
          <h1>Log In</h1>
          <form className="mx-auto w-50" onSubmit={this.onLogIn}>
            <div className="form-group">
              <input
                autoComplete="email-address"
                autoFocus
                onChange={this.onEmailChange}
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group">
              <input
                autoComplete="current-password"
                type="password"
                onChange={this.onPasswordChange}
                className="form-control"
                id="password"
                placeholder="Password"
                required
              />
            </div>
            <div className="row mt-5 align-items-center">
              <div className="col-3 text-left">
                <button className="btn btn-primary" type="submit">
                  LOG IN
                </button>
              </div>
              <div className="col text-right">
                Don’t have an account? <Link to="/signup">Create an account</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default LogIn;
