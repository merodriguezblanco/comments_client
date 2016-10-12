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
  render: function () {
    return (
      <form className="comment-form">
        <div className="form-group">
          <label htmlFor="name">Author</label>
          <input type="text" className="form-control" id="name" placeholder="Your name" />
        </div>
        <div className="form-group">
          <label htmlFor="comment">Comment</label>
          <input type="text" className="form-control" id="comment" placeholder="Some comment..." />
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
        <CommentForm />
        <CommentList data={this.state.data} pollInterval={60000} />
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox url="http://localhost:3000/comments" />,
  document.getElementById('content')
);
