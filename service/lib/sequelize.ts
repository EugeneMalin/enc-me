import { Sequelize } from 'sequelize';

const connection = new Sequelize({
    database: 'encounter',
    dialect: 'postgres',
    username: 'postgres',
    password: 'postgres',
    storage: ':memory:',
    logging: process.env.NODE_ENV !== 'production'
})

export interface IMobileSockets {
    socket: string,
    teamToken: string | null,
    coordinate: number[]
}



export {
    connection
};
