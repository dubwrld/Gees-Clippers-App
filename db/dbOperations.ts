import { configSettings as $config } from './dbConfig.js';

import mssql, { config } from 'mssql';

export async function getData() {
    let pool = await mssql.connect($config);
    let names = pool.request().query("SELECT * FROM NAMES");
    return names;
}

export async function insertData(data: { firstName: string, lastName: string, location: string }) {
    try {
        let pool = await mssql.connect($config);
        const request = pool.request().query(`INSERT INTO ${data.location} VALUES ('${data.firstName}', '${data.lastName}')`);
        // console.log(request)
        return request;
        // pool.request().query("")
    } catch (error) {
        console.error(error);
        return null;
    }

}

