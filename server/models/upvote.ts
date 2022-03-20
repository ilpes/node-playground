import Objection, {Model} from "objection";
import Comment from "./comment";

class Upvote extends Model {
    static tableName = 'upvotes';

    comment?: Comment;

    static get relationMappings() {
        return {
            'comment': {
                relation: Model.BelongsToOneRelation,
                modelClass: Comment,
                join: {
                    from: 'upvotes.comment_id',
                    to: 'comments.id'
                }
            }
        }
    }
}

export default Upvote;
