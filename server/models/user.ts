import Objection, {Model} from "objection";

class User extends  Model {
    static tableName = 'users';

    id?: number;
    maxId?: number;
}

export default User;
