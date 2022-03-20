import React from "react";
import {submit} from "../helpers";

export default class Upvote extends React.Component {

    constructor(props) {
        super(props);

        this.state = {count: props.count};

        this.onUpvote = this.onUpvote.bind(this);
        this.upvote = this.upvote.bind(this);
        this.update = this.update.bind(this);
    }

    upvote(event) {
        submit(`/api/comments/${this.props.commentId}/upvote`, {}, this.update);
        event.preventDefault();
    }

    onUpvote(upvote) {
        this.update(upvote.comment.upvotes_count);
    }

    update = (count) => {
        this.setState({count: count});
    }

    render() {
        return (
            <button className="upvote hover:text-gray-800 appearance-none text-xs font-semibold text-gray-600" onClick={this.upvote}>
                <small className="pr-2">▲</small> Upvote <strong className="font-semibold counter">
                    {this.state.count > 0 ? `(${this.state.count})`: ""}
                </strong>
            </button>
        );
    }
}

