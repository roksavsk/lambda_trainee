import { Request, Response } from 'express';
import { and, eq, or } from 'drizzle-orm/expressions';

import connector from '../data/db'; 
import { cities, clinics, suburbs } from '../data/schema';

exports.cityClinics = async (req: Request, res: Response) => {
    const city = req.body.city;
    let data;
    try {
        const db = await connector.connect();
        console.log('Connected Successfully');
        data = await db.select(clinics).where(eq(clinics.city, city));
        if (!data.length) {
            res.status(400).send({
                message: 'There is no available clinics in your city.',
            });
        } else {
            res.send({
                message: `Information about clinics in city ${city}:`, 
                data: data,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.fewCities = async (req: Request, res: Response) => {
    const city = req.body.city;
    let data;
    let sql;
    switch (city.length) {
        case 1:
            sql = eq(clinics.city, city[0]);
            break;
        case 2:
            sql = or(eq(clinics.city, city[0]), eq(clinics.city, city[1]));
            break;
        case 3:
            sql = or(eq(clinics.city, city[0]), eq(clinics.city, city[1]), eq(clinics.city, city[2]));
            break;
    }
    try {
        const db = await connector.connect();
        console.log('Connected Successfully');
        data = await db.select(clinics).where(sql);
        if (!data.length) {
            res.status(400).send({
                message: 'There is no available clinics in chosen cities.',
            });
        } else {
            res.send({
                message: `Information about clinics in chosen cities ${city}:`, 
                data: data,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.suburbClinics = async (req: Request, res: Response) => {
    const suburb = req.body.suburb;
    let data;
    try {
        const db = await connector.connect();
        console.log('Connected Successfully');
        data = await db.select(clinics).where(eq(clinics.suburb, suburb));
        if (!data.length) {
            res.status(400).send({
                message: 'There is no available clinics in your suburb.',
            });
        } else {
            res.send({
                message: `Information about clinics in suburb ${suburb}:`, 
                data: data,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.fewSuburbs = async (req: Request, res: Response) => {
    const suburb = req.body.suburb;
    let data;
    let sql;
    switch (suburb.length) {
        case 1:
            sql = eq(clinics.suburb, suburb[0]);
            break;
        case 2:
            sql = or(eq(clinics.suburb, suburb[0]), eq(clinics.suburb, suburb[1]));
            break;
        case 3:
            sql = or(eq(clinics.suburb, suburb[0]), eq(clinics.suburb, suburb[1]), eq(clinics.suburb, suburb[2]));
            break;
    }
    try {
        const db = await connector.connect();
        console.log('Connected Successfully');
        data = await db.select(clinics).where(sql);
        if (!data.length) {
            res.status(400).send({
                message: 'There is no available clinics in chosen suburbs.',
            });
        } else {
            res.send({
                message: `Information about clinics in chosen suburbs ${suburb}:`, 
                data: data,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.stateClinics = async (req: Request, res: Response) => {
    const state = req.body.state;
    let data;
    try {
        const db = await connector.connect();
        console.log('Connected Successfully');
        data = await db.select(clinics).where(eq(clinics.state, state));
        if (!data.length) {
            res.status(400).send({
                message: 'There is no available clinics in your state.',
            });
        } else {
            res.send({
                message: `Information about clinics in state ${state}:`, 
                data: data,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.postcodeClinics = async (req: Request, res: Response) => {
    const postcode = req.body.postcode;
    let data;
    try {
        const db = await connector.connect();
        console.log('Connected Successfully');
        data = await db.select(clinics).where(eq(clinics.postcode, postcode));
        if (!data.length) {
            res.status(400).send({
                message: 'There is no available clinics in your postcode.',
            });
        } else {
            res.send({
                message: `Information about clinics with postcode ${postcode}:`, 
                data: data,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.nearbyClinic = async (req: Request, res: Response) => {
    const { clinic, suburb } = req.body;
    let data;
    try {
        const db = await connector.connect();
        console.log('Connected Successfully');
        data = await db.select(suburbs)
            .leftJoin(clinics, eq(clinics.link_to_clinic_suburb_page, suburbs.suburb_slug))
            .where(and(eq(clinics.clinic_name, clinic), eq(clinics.suburb, suburb)));
        if (!data.length) {
            res.status(400).send({
                message: 'There is nothing nearby around your clinic',
            });
        } else {
            res.send({
                message: `Suburbs nearby clinic ${clinic} in suburb ${suburb}:`, 
                data: data,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.cityInfo = async (req: Request, res: Response) => {
    const city = req.body.city;
    let data;
    try {
        const db = await connector.connect();
        console.log('Connected Successfully');
        data = await db.select(cities).where(eq(cities.city_name, city));
        if (!data.length) {
            res.status(400).send({
                message: 'There is no available infromation about your city.',
            });
        } else {
            res.send({
                message: `Information about city ${city}:`, 
                data: data,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.suburbInfo = async (req: Request, res: Response) => {
    const suburb = req.body.suburb;
    let data;
    try {
        const db = await connector.connect();
        console.log('Connected Successfully');
        data = await db.select(suburbs).where(eq(suburbs.suburb_name, suburb));
        if (!data.length) {
            res.status(400).send({
                message: 'There is no available infromation about your suburb.',
            });
        } else {
            res.send({
                message: `Information about suburb ${suburb}:`, 
                data: data,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

export default exports;
