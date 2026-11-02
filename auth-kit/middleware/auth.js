// const requireAuth = asyncHandler(async(req, res, next)=>{
const requireAuth = async(req, res, next)=>{
    const header = req.get('authorization')

    if(!header.startsWith(AUTH.BEARER_PREFIX)){
        // throw apiError.unauthorized('Missing or malformed Authorization header')
        console.log('Missing or malformed Authorization header')
    }

    const token = header.slice(AUTH.BEARER_PREFIX.length).trim()
    // if (!token) throw apiError.unauthorized('Missing or malformed auth header')
    if (!token) console.log('Missing or malformed Authorization header')

    const payload = verifyToken(token)

    const user = await User.findById(payload.sub)
    // if (!user) throw apiError.unauthorized('This account no longer exists')
    if (!user) console.log('This account no longer exists')
    // The user is loaded instead of trusting the payload because the account could expire or change before the token
    req.user = user
    next()
}

module.exports = {requireAuth}