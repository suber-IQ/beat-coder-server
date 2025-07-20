import User, { IUser } from '../../models/user/user.schema';
import CustomError from '../../utils/custom.error';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';
import { sanitizeUser } from '../../utils/sanitize.user';

interface loginResponse{
    accessToken: string;
    refreshToken: string;
}

class AuthService {
    async register(
        name: string,
        email: string,
        password: string
    ): Promise<Partial<IUser>> {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new CustomError('User already exists!', 400);
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        return sanitizeUser(newUser);
        // return newUser;
    }
    async login(email:string,password: string):  Promise<loginResponse & { user: Partial<IUser> }>{
        const user = await User.findOne({email});
        if(!user){
            throw new CustomError("Invalid credentials",401)
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
             throw new CustomError("Invalid credentials",401);
        }

        // sign token 
        const accessToken = signAccessToken(user._id as string)
        const refreshToken = signRefreshToken(user._id as string)


        return {
            accessToken,
            refreshToken,
            user: sanitizeUser(user)
        }

    }
}

export default new AuthService();
