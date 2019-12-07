import { connection } from "../sequelize";
import { Model, DataTypes } from 'sequelize';

class Answer extends Model {
    public id!: number;
    public userAnswer!: number | string;
    public taskId!: number | string;
    public validAnswer!: boolean;
}


Answer.init({
    idAnswer: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userAnswer: DataTypes.TEXT,
    taskId: DataTypes.STRING,
    validAnswer: DataTypes.BOOLEAN
}, {
    modelName: 'answer', sequelize: connection
})
export default Answer