import sql from './db';

class User {
    static add = (url: string, data: string, result: any) => {
        sql.query(
            `INSERT INTO storage (url, data) VALUES ('${url}', '${data}')`,
            (err) => {
                if (err) {
                    console.log('error: ', err);
                    result(err, null);
                    return;
                }
                console.log('Add data: ', { url: data });
                result(null, { url: data });
            },
        );
    };

    static findByUrl = (url: string, result: any) => {
        sql.query(
            `SELECT data FROM storage WHERE url = '${url}'`,
            (err: Error, res: [{ data: [] }]) => {
                if (err) {
                    console.log('error: ', err);
                    result(err, null);
                    return;
                }
                if (res.length) {
                    console.log('Found data: ', res[0].data);
                    result(null, res[0].data);
                    return;
                }
                result({ kind: 'Not_found' }, null);
            },
        );
    };
}

export default User;
