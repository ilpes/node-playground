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
    constructor(post, container, commentTemplate, replyTemplate) {
        this.post = post;
        this.container = container;
        this.commentsContainer = this.container.querySelector('#comments-container');
        this.newCommentForm = this.container.querySelector('#new-comment');
        this.commentTemplate = commentTemplate.innerHTML;
        this.replyTemplate = replyTemplate.innerHTML;

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
        const comment = new Comment(commentData, this.commentTemplate, this.replyTemplate);
        this.commentsContainer.prepend(comment.getNode());
    }

    renderComments() {
        for (const commentData of this.post.comments) {
            const comment = new Comment(commentData, this.commentTemplate, this.replyTemplate);
            this.commentsContainer.append(comment.getNode());
        }
    }
}

class Comment {
    constructor(data, template, replyTemplate) {
        const node = this.getCommentNode(data, template);

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
        this.repliesContainer = node.querySelector('div.replies');
        this.replyTemplate = replyTemplate;

        this.renderReplies(data.comments, replyTemplate);
        this.initForm();
    }

    initForm() {
        const button = this.replyForm.querySelector('button');
        button.addEventListener('click', this.reply.bind(this));
    }

    getNode() {
        return this.node;
    }

    showReplies() {
        this.repliesContainer.style.display = 'block';
    }

    resetForm() {
        this.replyForm.querySelector('textarea').value = '';
    }

    reply(event) {
        const reply = this.replyForm.querySelector('textarea');
        const commentId = this.replyForm.dataset.id;
        if(reply.value === "") {
            return;
        }
        submit(`/api/comments/${commentId}/reply`, {comment: reply.value}, this.renderReply.bind(this));
        event.preventDefault();
    }

    renderReply(replyData) {
        this.resetForm();
        this.showReplies();

        const reply = new Reply(replyData, this.replyTemplate);
        this.repliesContainer.prepend(reply.getNode());
    }

    renderReplies(repliesData, replyTemplate) {
        if(repliesData.length > 0) {
            this.showReplies();
        }

        for (const replyData of repliesData) {
            const reply = new Reply(replyData, this.replyTemplate);
            this.repliesContainer.append(reply.getNode());
        }
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
        const commentId = this.node.dataset.id;
        submit(`/api/comments/${commentId}/upvote`, {}, this.update.bind(this));
        event.preventDefault();
    }

    update(comment) {
        const counter = this.node.querySelector('strong.counter');
        counter.innerText = beautifyCounter(comment.upvotes_count);
    }
}

class Reply {
    constructor(data, template) {
        const node = this.getCommentNode(data, template);

        const upvoteButton = node.querySelector('button.upvote');
        upvoteButton.addEventListener('click', this.send.bind(this));

        this.node = node;
    }

    send(event) {
        const commentId = this.node.dataset.id;
        submit(`/api/comments/${commentId}/upvote`, {}, this.update.bind(this));
        event.preventDefault();
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

    update(comment) {
        const counter = this.node.querySelector('strong.counter');
        counter.innerText = beautifyCounter(comment.upvotes_count);
    }
}

export { Comments };
