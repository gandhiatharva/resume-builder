import jwt from 'jsonwebtoken'
//Used to verify the JWT token sent by the client.

const protect = async (req, res, next) => {
    //req → incoming request ,res → response object ,
    //next → function to move to the next middleware/controller
    const token = req.headers.authorization;
    //frontend usually sends ->Authorization: <JWT_TOKEN></JWT_TOKEN>,
    //This above line extracts the token.
    //so from req we extract out the token used for autohorization 
    if(!token){
        return res.status(401).json({ message: 'Unauthorized' });
        //Happens when user is not logged in or token is missing
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //checks if the token is valid, not expired,and not tampered with
        // if verification fails,error is thrown 
        req.userId = decoded.userId;
        //Attach user identity to request
        //Every controller after this middleware can access:req.usedId
        //Backend knows which user made the request
        next();
        //Calling next() means “this request is allowed”.
        //Passes control to: next middleware, orthe actual controller
    } catch (error) {
        // catches invalid, expired token and wrong secret 
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export default protect;

//This middleware is the security gatekeeper of your backend.
//Its only job is to protect private routes by checking whether the request comes 
//from a logged-in user.

//It checks for a JWT token in the request, verifies it, extracts the user ID, 
//and allows the request to continue only if the token is valid.