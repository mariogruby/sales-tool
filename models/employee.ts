// import mongoose, { Model, Schema } from "mongoose";
// import { IEmployee } from "";

// const EmployeeSchema: Schema<IEmployee> = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     lastName: {
//         type: String,
//         required: true
//     },
//     phoneNumber: {
//         type: String,
//         required: false,
//     },
//     email: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: false,
//     },
//     accessAreasRoutes: {
//         type: [String],
//         default: [],
//         required: true,
//     },
//     restaurant: {
//         type: Schema.Types.ObjectId,
//         ref: "Restaurant",
//         required: true
//     },
//     invitationCode: {
//         type: String,
//         required: true,
//     },
//         createdAt: {
//         type: Date,
//         default: Date.now
//     },
// })

// const Employee: Model<IEmployee> = mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema);
// export default Employee;
