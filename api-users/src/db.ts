import { Pool } from 'pg';

const connectionString = 'postgres://kugufkwj:hjhwlqfXtChsz1IJ9CRFV4svUSdZssd5@kesavan.db.elephantsql.com/kugufkwj';
const db = new Pool({ connectionString });

export default db;
