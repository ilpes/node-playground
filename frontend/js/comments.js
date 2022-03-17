import ejs from "ejs";
ejs.delimiter = '?';

function createNodeFromTemplate(template, data) {
    let html = ejs.render(template, data);
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

function beautifyCounter(n) {
    return n > 0 ? `(${n})` : ``;
}

class Comments {
    constructor(post, container, commentTemplate) {
        this.post = post;
        this.container = container;
        this.commentsContainer = this.container.querySelector('#comments-container');
        this.newCommentForm = this.container.querySelector('#new-comment');
        this.commentTemplate = commentTemplate.innerHTML;

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
    }p

    resetForm() {
        this.newCommentForm.querySelector('textarea').value = '';
    }

    renderComment(commentData) {
        this.resetForm();
        const comment = new Comment(commentData, this.commentTemplate);
        this.commentsContainer.prepend(comment.getNode());
    }

    renderComments() {
        for (const commentData of this.post.comments) {
            const comment = new Comment(commentData, this.commentTemplate);
            this.commentsContainer.append(comment.getNode());
        }
    }
}

class Comment {
    constructor(data, template) {
        const node = this.getCommentNode(data, template)

        const upvoteButton = node.querySelector('button.upvote');
        upvoteButton.addEventListener('click', this.send.bind(this));

        const replyButton = node.querySelector('button.reply');
        replyButton.addEventListener('click', this.showReplyForm.bind(this));

        const cancelButton = node.querySelector('button.cancel');
        cancelButton.addEventListener('click', this.hideReplyForm.bind(this));

        this.node = node;
        this.replyButton = replyButton;
        this.cancelButton = cancelButton;
        this.replyForm = node.querySelector('form');
    }

    getNode() {
        return this.node;
    }

    getCommentNode(data, template) {
        let parsedData = {
            ... data,
            readable_upvotes_count: beautifyCounter(data.upvotes_count),
        }
        return createNodeFromTemplate(template, parsedData);
    }

    showReplyForm(event) {
        this.replyForm.style.display = 'flex';
        this.cancelButton.style.display = 'inline';
        this.replyButton.style.display = 'none';
    }

    hideReplyForm(event)  {
        this.replyForm.style.display = 'none';
        this.cancelButton.style.display = 'none';
        this.replyButton.style.display = 'inline';
    }

    send(event) {
        const commentId = this.node.firstElementChild.dataset.id;
        submit(`/api/comments/${commentId}/upvote`, {}, this.update.bind(this));
        event.preventDefault();
    }

    update(comment) {
        const counter = this.node.querySelector('strong.counter');
        counter.innerText = beautifyCounter(comment.upvotes_count);
    }
}

export { Comments };
