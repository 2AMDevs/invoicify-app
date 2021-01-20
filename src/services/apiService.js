/**
 * Creates a user in the db
 * @param {string} name of the company or individual
 * @param {email} email used to set/reset password with OTP
 * @returns {Promise}
 */
const createUser = (name, email) => {
  const url = `${process.env.REACT_APP_API_URL}/users`
  // return axios.post(url, { name, email })
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
  }).then((response) => response.json())
}

export { createUser }
