import jwt from 'jsonwebtoken'

const secretKey = 'unbreakable'

export const checkAuth = (req, res, next) => {
  console.log('checkAuth:')
  //console.log(req.headers)

  const authorizationHeader = req.headers['authorization']
  let token

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  }

  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Failed to authenticate' })
      } else {
        console.log('Decoded Token payload: ')
        console.log(decoded)
        req.currentUserId = decoded.name
        next()
        /*
        User.query({
          where: { id: decoded.id },
          select: [ 'email', 'id', 'username' ]
        }).fetch().then(user => {
          if (!user) {
            res.status(404).json({ error: 'No such user' })
          } else {
            req.currentUser = user
            next()
          }
        })*/
      }
    })
  } else {
    res.status(403).json({
      error: 'No token provided'
    })
  }
}

export const createToken = (name) => {
  console.log('createToken')
  let jwt = require('jsonwebtoken')


  let token = jwt.sign(
    { 
      iss: 'MyServer',
      name
    }, 
    secretKey,
    {expiresIn: '1h'})

  // sign with RSA SHA256
  //var cert = fs.readFileSync('private.key');  // get private key
  //var token = jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256'})

  return token
}


export const login = (req, res, next) => {
  console.log('login')
  let {name, pwd } = req.body
  console.log('name: ' + name + ' | pwd: ' + pwd)

  // compare to the one in DB
  // bcrypt.compareSync(pwd, hashedPwdFromDb)

  if(name != 'guest'){
    res.status(401).json({ msg: 'User / Password incorrect(s)' })
  }



  let token = createToken(name)
  console.log('token: ' + token)

  req.id = 12

  res.status(200).json({ name, token })

}

export const signup = (req, res, next) => {
  console.log('signup')
  let {name, pwd } = req.body
  console.log('name: ' + name + ' | pwd: ' + pwd)

  // Encrypt password
  var hash = bcrypt.hashSync(pwd)

  // Control and create user in db

  let token = createToken(name)

  res.status(200).json({ name, token })

}
