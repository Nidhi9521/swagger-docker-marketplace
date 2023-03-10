import mongoose, { ObjectId } from "mongoose";
import { StateDoc } from "./state";
import { StoreDoc } from "./store";

// intetface that describe the prooerti
// that are required to cretae new user
export interface storeHolidayAttrs {
    storeId: string;
    startDate:Date;
    endDate:Date;
}

// interface for usermodel pass
interface storeHolidayModel extends mongoose.Model<storeHolidayDoc> {
    build(attrs: storeHolidayAttrs): storeHolidayDoc;
}

// interface for single user properties
export interface storeHolidayDoc extends mongoose.Document {
    startDate:Date;
    endDate:Date;
    storeId: StoreDoc;
}

const storeHolidaySchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'store'},
    startDate:{type:Date},
    endDate:{type:Date},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

storeHolidaySchema.pre('save', async function (done) {

})

storeHolidaySchema.statics.build = (attrs: storeHolidayAttrs) => {
    return new storeHoliday(attrs);
}

const storeHoliday = mongoose.model<storeHolidayDoc, storeHolidayModel>('storeHoliday', storeHolidaySchema);

export { storeHoliday };