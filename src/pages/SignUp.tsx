import React from 'react';
import { Link } from 'react-router-dom';

import './SignUp.scss';
import { User } from '../utils/types';

type Props = {
  onSignUp: (data: User) => Promise<any>;
};

class SignUp extends React.Component<Props> {
  state = {
    name: '',
    email: '',
    password: '',
  };

  onSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    const { email, password, name } = this.state;
    event.preventDefault();
    try {
      await this.props.onSignUp({ email, name, password });
    } catch (error) {
      console.error(error);
    }
  };

  onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ name: event.target.value });

  onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ email: event.target.value });

  onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ password: event.target.value });

  render() {
    return (
      <div className="col d-flex flex-column justify-content-center">
        <div className="sign-up-log-in text-center mt-3">
          <h1>Sign Up</h1>
          <form className="mx-auto w-50" onSubmit={this.onSignUp}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Name"
                onChange={this.onNameChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                required
                onChange={this.onEmailChange}
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                autoComplete="new-password"
                onChange={this.onPasswordChange}
                required
                minLength={8}
              />
            </div>
            <div className="row">
              <div className="col text-left">
                <button className="btn btn-primary" type="submit">
                  SIGN UP
                </button>
              </div>
              <div className="col">
                Already have an account?{' '}
                <Link className="text-primary" to="/login">
                  Log in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default SignUp;
