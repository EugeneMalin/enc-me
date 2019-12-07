import { Model, DataTypes } from "sequelize";
import { connection } from "../sequelize";
import crypto from 'crypto';


class User extends Model {
    public id!: number;
    public username!: string;
    public hashedPassword!: string;
    public salt!: string;
    public token!: string;
    public teamToken!: string;
    public email!: string;
    public firstName!: string;
    public lastName!: string;
    public gameId!: number

    private _plainPassword: string = '';

    public encrypt(password: string): string {
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    }

    public check(password: string): boolean {
        return this.encrypt(password) === this.hashedPassword;
    }
    set password(password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('hex');
        this.hashedPassword = this.encrypt(password);
    }

    get password() {
        return this._plainPassword;
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    gameId: DataTypes.INTEGER,
    hashedPassword: DataTypes.STRING,
    token: DataTypes.STRING,
    teamToken: DataTypes.STRING,
    email: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    salt: DataTypes.STRING
}, {
    modelName: 'user', sequelize: connection
})

export default User;
