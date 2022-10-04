import bcrypt from 'bcryptjs'

export const makeHash = password => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return reject(err)
      }
      return resolve(hash)
    })
  })
}


export const checkHash = async (hash, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, isValid) => {
      if (err) {
        return reject(err)
      }
      return resolve(isValid)
    })
  })
}
