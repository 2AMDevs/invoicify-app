/**
 * Creates a user in the db
 * @param {string} name of the company or individual
 * @param {email} email used to set/reset password with OTP
 * @returns {Promise}
 */
const createUser = (name, email) => {
  const url = `${process.env.REACT_APP_API_URL}/users`
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
  }).then((response) => response.json())
}

/**
 * Verifies user email a user in the db
 * @param {email} email used to set/reset password with OTP
 * @param {otp} otp sent to the email
 * @param {sessionId} sessionId of current session
 * @returns {Promise}
 */
const verifyOtp = (email, otp, sessionId) => {
  const url = `${process.env.REACT_APP_API_URL}/users/verify`
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp, sessionId }),
  }).then((response) => response.json())
}

export {
  createUser, verifyOtp,
}
