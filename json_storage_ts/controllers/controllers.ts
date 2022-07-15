import { Request, Response } from 'express';

import User from '../models/user.model';

interface Error {
    kind: string,
    message: string 
}

exports.add = (req: Request, res: Response) => {
    console.log(req.body);
    if (!req.body.length) {
        res.status(400).send({
            message: 'Content can not be empty!',
        });
    } else {
        console.log(typeof(req.body[0]));
        if (typeof(req.body[0]) === 'undefined') {
            res.status(400).send({
                message: 'This is not JSON, only JSON data can be stored here.',
            });
        } else {
            User.findByUrl(req.params.url, (err: Error, data: []) => {
                if (err) {
                    console.log(err);
                    if (err.kind === 'Not_found') {
                        const jsonData = JSON.stringify(req.body);        
                        User.add(req.params.url, jsonData, (err: Error, data: []) => {
                            if (err)
                                res.status(500).send({
                                    message:
                                        err.message || 'Some error occurred while saving data.',
                                });
                            else res.send(data);
                        });
                    } else {
                        res.status(500).send({
                            message: `Error retrieving data by url ${req.params.url}`,
                        });
                    }
                } else if (data.length) {
                    res.status(403).send({
                        message: 'This address has been taken. Try to use another one.',
                    });
                }
            });
        }
    }
};

exports.findData = (req: Request, res: Response) => {
    User.findByUrl(req.params.url, (err: Error, data: []) => {
        if (err) {
            console.log(err);
            if (err.kind === 'Not_found') {
                res.status(404).send({
                    message: `Not found url with name ${req.params.url}.`,
                });
            } else {
                res.status(500).send({
                    message: `Error retrieving data by url ${req.params.url}`,
                });
            }
        } else {
            res.send(data);
        }
    });
};

export default exports;
