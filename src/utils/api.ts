import axios from 'axios';
import { User, Idea } from '../utils/types';

const root = 'https://small-project-api.herokuapp.com';

export const getUser = async (jwt: string) => {
  const { data } = await axios.get(`${root}/me`, {
    headers: { 'X-Access-Token': jwt },
  });
  return {
    name: data.name,
    avatarUrl: data.avatar_url,
  };
};

export const signUp = async (user: User) => {
  const { data } = await axios.post(`${root}/users`, user);
  return {
    jwt: data.jwt,
    refreshToken: data.refresh_token,
  };
};

export const onLogIn = async (user: User) => {
  const { data } = await axios.post(`${root}/access-tokens`, user);
  return {
    jwt: data.jwt,
    refreshToken: data.refresh_token,
  };
};

export const refreshToken = async (refreshToken: string) => {
  const body = await axios.post(`${root}/access-tokens/refresh`, {
    refresh_token: refreshToken,
  });
  return body.data.jwt;
};

export const getIdeas = async (jwt: string): Promise<Array<Idea>> => {
  const { data } = await axios.get(`${root}/ideas`, {
    headers: { 'X-Access-Token': jwt },
  });
  return data;
};

export const postIdea = async (idea: Idea, jwt: string) => {
  return axios.post(`${root}/ideas`, idea, {
    headers: { 'X-Access-Token': jwt },
  });
};

export const deleteIdea = (ideaId: string, jwt: string) => {
  return axios.delete(`${root}/ideas/${ideaId}`, {
    headers: { 'X-Access-Token': jwt },
  });
};

export const updateIdea = (ideaId: string, idea: Idea, jwt: string) => {
  return axios.put(`${root}/ideas/${ideaId}`, idea, {
    headers: { 'X-Access-Token': jwt },
  });
};
