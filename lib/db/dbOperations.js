import { configSettings as $config } from './dbConfig.js';
import mssql from 'mssql';
export async function getData() {
    let pool = await mssql.connect($config);
    let names = pool.request().query("SELECT * FROM NAMES");
    return names;
}
export async function insertData(data) {
    try {
        let pool = await mssql.connect($config);
        const request = pool.request().query(`INSERT INTO ${data.location} VALUES ('${data.firstName}', '${data.lastName}')`);
        return request;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
//# sourceMappingURL=dbOperations.js.map