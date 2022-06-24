import { nanoid } from 'nanoid'
import bcrypt from 'bcrypt'

export default {
    generateRandomToken() {
        const token = nanoid(64);
        return token;
    },
    createPasswordHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSalt(10), null);
    }
}