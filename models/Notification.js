import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    userTo: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    userFrom: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    notificationType: String,
    opened: {
        type: String,
        default: false
    },
    entityId: [{
        entityId: Schema.Types.ObjectId
    }]
}, {timestamps: true})

NotificationSchema.statics.insertNotification = async (userTo, userFrom, notificationType, entityId) => {
    var data = {
        userTo: userTo,
        userFrom: userFrom,
        notificationType: notificationType,
        entityId: entityId
    }
    await Notification.deleteOne(data).catch(err => console.log(err));
    return Notification.create(data).catch(err => console.log(err));
}

const Notification = mongoose.model('notification', NotificationSchema)
module.exports = Notification