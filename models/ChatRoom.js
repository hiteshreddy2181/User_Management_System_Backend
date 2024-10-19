import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);


export default ChatRoom;