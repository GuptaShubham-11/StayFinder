import User from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { zodErrorFormater } from '../utils/zodErrorFormater';
import { signUpValidation } from '../schemas/signUp.schema';
import { signInValidation } from '../schemas/signIn.schema';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

// Cookie Option
const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshTokens = async (
  userId: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new ApiError(500, 'Failed to generate tokens');
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Token Generation Error:', error);
    throw new ApiError(
      500,
      'Server error generating access and refresh tokens.'
    );
  }
};

const signUp = asyncHandler(async (req, res) => {
  // Validate request body
  const validatedData = signUpValidation.safeParse(req.body);

  if (!validatedData.success) {
    const errorMessages = zodErrorFormater(validatedData);
    throw new ApiError(400, errorMessages || 'Invalid data!');
  }

  const { email, password, role } = validatedData.data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, 'User already exists!');
  }

  // Create new user
  const user = await User.create({ email, password, role });

  res.status(201).json(new ApiResponse(201, 'User created successfully.'));
});

const signIn = asyncHandler(async (req, res) => {
  // Validate request body
  const validatedData = signInValidation.safeParse(req.body);

  if (!validatedData.success) {
    const errorMessages = zodErrorFormater(validatedData);
    throw new ApiError(400, errorMessages || 'Invalid data!');
  }

  const { email, password } = validatedData.data;

  // Check user exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, 'User not found!');
  }

  // Check password
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid password!');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id as string
  );

  res
    .status(201)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(
      new ApiResponse(201, 'User signed in successfully.', {
        user: {
          _id: user._id,
          email: user.email,
        },
      })
    );
});

const signOut = asyncHandler(async (req: AuthenticatedRequest, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  res
    .status(201)
    .clearCookie('refreshToken', options)
    .clearCookie('accessToken', options)
    .json(new ApiResponse(201, 'User signed out successfully.'));
});

export const userController = {
  generateAccessAndRefreshTokens,
  signUp,
  signIn,
  signOut,
};
