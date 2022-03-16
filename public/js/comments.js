function createNodeFromTemplate(template, data) {
    let html = template.innerHTML.replace(/\{\s*(\w+)\s*\}/g, function(all, key) {
        let value = data[key];
        return (value === undefined) ? `{${key}}` : value;
    });
    return new DOMParser().parseFromString(html, 'text/html').body.firstChild;
}

function submit(url, data, callback) {
    fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(function (res) {
        return res.json();
    }).then(function (data) {
        callback(data);
    }).catch(function(err) {
        alert('Ooops! Something went wrong')
    });
}


class Comments {
    constructor(post, container, commentTemplate) {
        this.post = post;
        this.container = container;
        this.commentsContainer = this.container.querySelector('#comments-container');
        this.newCommentForm = this.container.querySelector('#new-comment');
        this.commentTemplate = commentTemplate;

        this.renderComments();
        this.initForm();
    }

    initForm() {
        const button = this.newCommentForm.querySelector('button');
        button.addEventListener('click', this.send.bind(this));
    }

    send(event) {
        const comment = this.newCommentForm.querySelector('textarea');
        const postId = this.newCommentForm.dataset.id;
        if(comment.value === "") {
            return;
        }
        submit(`/api/posts/${postId}/comments`, {comment: comment.value}, this.renderComment.bind(this));
        event.preventDefault();
    }

    getCommentNode(comment) {
        let data = {
            ... comment,
            user_avatar: comment.user.avatar,
            user_username: comment.user.username,
            readable_upvotes_count: comment.upvotes_count > 0 ? `(${comment.upvotes_count})` : ``,
        }
        return createNodeFromTemplate(this.commentTemplate, data);
    }

    resetForm() {
        this.newCommentForm.querySelector('textarea').value = '';
    }

    renderComment(comment) {
        this.resetForm();
        const node = this.getCommentNode(comment);
        this.commentsContainer.prepend(node);
        new Comment(node);
    }

    renderComments() {
        for (const comment of this.post.comments) {
            const node = this.getCommentNode(comment);
            this.commentsContainer.append(node);
            new Comment(node);
        }
    }
}

class Comment {
    constructor(node) {
        this.node = node;
        const button = node.querySelector('button');
        button.addEventListener('click', this.send.bind(this));
    }

    send(event) {
        const commentId = this.node.dataset.id;
        submit(`/api/comments/${commentId}/upvote`, {}, this.update.bind(this));
        event.preventDefault();
    }

    update(comment) {
        const counter = this.node.querySelector('strong.counter');
        counter.innerText = comment.upvotes_count > 0 ? `(${comment.upvotes_count})` : ``;
    }
}
