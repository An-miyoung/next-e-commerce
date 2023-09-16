import mongoose, { Model, models } from "mongoose";
import { Document, ObjectId, Schema } from "mongoose";
import { hash, compare, genSalt } from "bcrypt";

interface PasswordResetTokenDocument extends Document {
  user: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

// Define the schema for the EmailVerificationToken document
const passwordResetTokenSchema = new Schema<
  PasswordResetTokenDocument,
  {},
  Methods
>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
    expires: 60 * 60 * 24,
  },
});

// Pre-save-hook
passwordResetTokenSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("token")) return next();

    const salt = await genSalt(10);
    this.token = await hash(this.token, salt);
    next();
  } catch (error: any) {
    throw new Error(error.message);
  }
});

passwordResetTokenSchema.methods.compareToken = async function (token) {
  try {
    return await compare(token, this.token);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Create the EmailVerificationToken model
const PasswordResetToken =
  models.PasswordResetToken ||
  mongoose.model("PasswordResetToken", passwordResetTokenSchema);

export default PasswordResetToken as Model<
  PasswordResetTokenDocument,
  {},
  Methods
>;
