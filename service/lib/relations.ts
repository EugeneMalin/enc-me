import User from './model/user'
import Message from './model/message'
import Answer from './model/answer'

User.hasMany(Message);
User.hasMany(Answer);
Message.belongsTo(User);
Answer.belongsTo(User);

export {
    User,
    Message,
    Answer
}