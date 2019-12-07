  
import { Model, DataTypes, UUIDV1 } from "sequelize";
import {connection} from "../sequelize";

class Message extends Model {
    public id!: number;
    public user_id!: number;
    public message!: number|string;
    public creatAt!: Date;
}

    Message.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: UUIDV1
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        message:{ 
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        modelName: 'message', sequelize: connection
    })
export default Message