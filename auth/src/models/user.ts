import mongoose from "mongoose";
import { Password } from "../utilities/password";

//Interface for user model attributes
interface UserAttrs {
  email: string;
  password: string;
}

//Interface for properties of the user model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//Interface for properties of user document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPW = await Password.toHash(this.get("password"));
    this.set("password", hashedPW);
  }
  done();
});
userSchema.statics.build = (attributes: UserAttrs) => {
  return new User(attributes);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
