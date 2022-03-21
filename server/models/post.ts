import Objection, {Model} from "objection";
import Comment from "./comment";

class Post extends  Model {
    static tableName = 'posts';

    id?: number;
    slug?: string;

    static get relationMappings() {
        return {
            'comments': {
                relation: Model.HasManyRelation,
                modelClass: Comment,
                join: {
                    from: 'posts.id',
                    to: 'comments.post_id'
                }
            }
        }
    }
}

export default Post;
