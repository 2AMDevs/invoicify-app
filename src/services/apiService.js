import axios from 'axios'

const createUser = (name, email) => {
  const url = `${process.env.REACT_APP_API_URL}/users`
  return axios.post(url, { name, email })
}

export { createUser }
