import { Request, Response } from 'express';
import { eq } from 'drizzle-orm/expressions';
import randomstring from 'randomstring';

import db from '../db/db'; 
import { links } from '../db/schema';

exports.shortener = async (req: Request, res: Response) => {
    const link = req.body.link;
    const newLink = randomstring.generate(7);
    try {
        await db.insert(links)
            .values({
                original: link,
                shortened: newLink,
            });
    } catch (err) {
        console.log(err);
    }
    res.send({
        link: process.env.SERVER_LINK + newLink,
    });
};

exports.return = async (req: Request, res: Response) => {
    const link = req.params.url;
    let data;
    try {
        data = await db.select(links).fields({ original: links.original }).where(eq(links.shortened, link));
        if (!data.length) {
            res.status(400).send({
                message: 'There is no such short link.',
            });
        } else {
            const originalLink = data[0].original || '';
            res.redirect(originalLink);
        }
    } catch (err) {
        console.log(err);
    }
};

export default exports;
