import db from '../db';
import errorHandler from '../middlewares/error-handler.middleware';
import DatabaseError from '../models/errors/database.error.model';
import User from '../models/user.model';

class UserRepository {

    /**
     * Procura todos os usuários existentes no banco de dados.
     * @returns array de usuários se existir algum, senão retorna vazio.
     */
    async findAllUsers() : Promise<User[]> {
        try {
            const query = `
                SELECT uuid, username
                FROM application_user
            `;

            const { rows } = await db.query<User>(query);
            return rows || [];
        } catch(error) {
            throw new DatabaseError('Erro na consulta', error);
        }
    }

    /**
     * Procura por uuid um usuário existente no banco de dados.
     * @param uuid recebe uuid para procurar usuário caso exista.
     * @returns o usuário se existir, senão retorna mensagem.
     */
    async findById(uuid: string) : Promise<User> {
        try{
            const query = `
                SELECT uuid, username
                FROM application_user
                WHERE uuid = $1
            `;
    
            const values = [ uuid ];
            const { rows } = await db.query<User>(query, values);
            const [ user ] = rows;
            return user;
        } catch(error) {
            throw new DatabaseError('Erro na consulta por ID', error);
        }
    }

    async findByUsernameAndPassword(username: string, password: string) : Promise<User | null> {
        try{
            const query = `
                SELECT uuid, username
                FROM application_user
                WHERE username = $1
                AND password = crypt($2, 'my_salt')
            `;
    
            const values = [ username, password ];
            const { rows } = await db.query<User>(query, values);
            const [ user ] = rows;
            return user || null;
        } catch(error) {
            throw new DatabaseError('Erro na consulta por username e password', error);
        }
    }

    /**
     * Cria um usuário novo com os parametros recebidos gerando uuid automático conforme banco de dados.
     * @param user recebe um usuário com nome (username) e senha (password).
     * @returns uuid gerado automaticamente pelo banco de dados.
     */
    async create(user: User) : Promise<string> {
        try {
            const query = `
                INSERT INTO application_user (
                    username,
                    password
                )
                VALUES ($1, crypt($2, 'my_salt'))
                RETURNING uuid
            `;

            const values = [ user.username, user.password ];
            const { rows } = await db.query<{ uuid: string }>(query, values);
            const [ newUser ] = rows;
            return newUser.uuid;
        } catch(error) {
            throw new DatabaseError('Erro ao criar usuário', error);
        }
    }

    /**
     * Modifica usuário caso exista.
     * @param user recebe um usuário com novo nome (username) e senha (password), e um uuid para procurar usuário a ser modificado caso exista.
     */
    async update(user: User) : Promise<void> {
        try {
            const query = `
                UPDATE application_user
                SET
                    username = $1,
                    password = crypt($2, 'my_salt')
                WHERE uuid = $3
            `;

            const values = [ user.username, user.password, user.uuid ];
            await db.query(query, values);
        } catch(error) {
            throw new DatabaseError('Erro ao atualizar usuário', error);
        }
    }

    /**
     * Exclui usuário caso exista.
     * @param uuid recebe um uuid para procurar usuário a ser excluído caso exista.
     */
    async delete(uuid: string) : Promise<void> {
        try {
            const query = `
                DELETE FROM application_user
                WHERE uuid = $1
            `;

            const values = [ uuid ];
            await db.query(query, values);
        } catch(error) {
            throw new DatabaseError('Erro ao deletar usuário', error);
        }
    }

}

export default new UserRepository();
