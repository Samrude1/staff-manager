import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  dateHired: {
    type: String,
    required: true,
  },
  photo: {
    type: String, // Base64 string
    required: false,
  },
  // Extended Fields
  email: { type: String, required: false },
  phone: { type: String, required: false },
  address: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  zip: { type: String, required: false },
});

// Duplicate _id to id for frontend compatibility
EmployeeSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default mongoose.model("Employee", EmployeeSchema);
