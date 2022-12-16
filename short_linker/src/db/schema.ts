import { pgTable, serial, varchar } from 'drizzle-orm-pg';

export const links = pgTable('links', {
    id: serial('id').primaryKey(),
    original: varchar('original'),
    shortened: varchar('shortened'),
});
