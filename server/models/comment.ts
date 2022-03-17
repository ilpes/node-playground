import Objection, {Model} from "objection";
import User from "./user";
import Upvote from "./upvote";
import dayjs from "dayjs";

class Comment extends  Model {

    static tableName = 'comments';

    id?: number;
    postId?: number;

    static get relationMappings() {
        return {
            'user': {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'comments.user_id',
                    to: 'users.id'
                }
            },

            'upvotes': {
                relation: Model.HasManyRelation,
                modelClass: Upvote,
                join: {
                    from: 'comments.id',
                    to: 'upvotes.comment_id'
                }
            },

            'comments': {
                relation: Model.HasManyRelation,
                modelClass: Comment,
                join: {
                    from: 'comments.id',
                    to: 'comments.comment_id'
                }
            }
        }
    }

    $formatJson(json: Objection.Pojo): Objection.Pojo {
        json = super.$formatJson(json);
        json.upvotes_count = json.upvotes.length;
        json.readable_created_at = dayjs(json.created_at).fromNow();
        delete json.upvotes;
        return json;
    }
}

export default Comment;
