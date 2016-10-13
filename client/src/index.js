var CommentList = React.createClass({
  render: function () {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });

    return (
      <table className="table comment-list">
        <thead>
          <tr>
            <th>Author</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {commentNodes}
        </tbody>
      </table>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function () {
    return {
      author: '',
      text: ''
    };
  },

  handleAuthorChange: function (event) {
    this.setState({
      author: event.target.value
    });
  },

  handleTextChange: function (event) {
    this.setState({
      text: event.target.value
    });
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({
      author: author,
      text: text
    });
    this.setState({
      author: '',
      text: ''
    });
  },

  render: function () {
    return (
      <form className="comment-form" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Author</label>
          <input value={this.state.author}
                 onChange={this.handleAuthorChange}
                 type="text"
                 className="form-control"
                 id="name"
                 placeholder="Your name" />
        </div>
        <div className="form-group">
          <label htmlFor="comment">Comment</label>
          <input value={this.state.text}
                 onChange={this.handleTextChange}
                 type="text"
                 className="form-control"
                 id="comment"
                 placeholder="Some comment..." />
        </div>
        <button type="submit" className="btn btn-default">Post</button>
      </form>
    );
  }
});

var Comment = React.createClass({
  render: function () {
    return (
      <tr className="comment">
        <td className="comment-author">
          {this.props.author}
        </td>
        <td>
          {this.props.children}
        </td>
      </tr>
    );
  }
});

var CommentBox = React.createClass({
  getInitialState: function () {
    return {
      data: []
    }
  },

  handleCommentSubmit: function (comment) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function (data) {
        var comments = this.state.data;
        var newComments = comments.concat(data);
        this.setState({ data: newComments });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  loadCommentsFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      contentType: 'json',
      cache: false,
      success: function (data) {
        this.setState({
          data: data
        });
      }.bind(this),
      error: function (xhr, status, error) {
        console.log(this.props.url, status, error.toString());
      }.bind(this)
    });
  },

  componentDidMount: function () {
    this.loadCommentsFromServer();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  render: function () {
    return (
      <div className="comment-box">
        <h1>Comments</h1>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <CommentList data={this.state.data} pollInterval={60000} />
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox url="http://localhost:3000/comments" />,
  document.getElementById('content')
);
