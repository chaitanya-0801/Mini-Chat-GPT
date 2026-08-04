import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Message content cannot be empty"],
            trim: true, 
        },
        ownerType: {
            type: String,
            required: true,
            enum: {
                values: ['AI', 'user'],
                message: '{VALUE} is not a valid owner type' 
            }
        },
    
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    {
        timestamps: true, 
    }
);

const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;
