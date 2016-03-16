/**
 * Created by nm on 11/16/2015.
 */
exports.secretToken = 'aMdoeb5ed87zorRdkD6greDML81DcnrzeSD648ferFejmplx';

exports.smtpConfig = {
    host: 'smtp.mail.com',
    port: 587,
    secure: false, // use SSL
    auth: {
        user: 'APfitness@mail.com',
        pass: 'Maddog_1'
    }
};

exports.localSql = {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'maddog_1',
    database: 'ApFitness'
};