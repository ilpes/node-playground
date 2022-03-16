import Objection, {Model} from "objection";

class Upvote extends Model {
    static tableName = 'upvotes';
}

export default Upvote;
