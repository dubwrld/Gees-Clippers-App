import mssql, { config } from "mssql";

export const configSettings: config = {
    server: "",
    user: "",
    password: "",
    database: "",
    options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instanceName: "SQLEXPRESS"
    },
    port: 1433
};
