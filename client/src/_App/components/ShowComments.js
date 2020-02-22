import React from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';

import {
    fetchServerTime,
    fetchComment,
    fetchAllComments,
    createComment,
    updateComment,
    deleteComment
} from '../../actions';

class ShowComments extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            contents: '',
            contentsLength: 0,
            apiInitialLoadError: false,
            apiError: false,
            submitted: false,
            comments: {},
            showCreate: false,
            showEdit: false,
            showDelete: false,
            showModal: false,
            selectedId: null,
        }

        this.handleContents = this.handleContents.bind(this);
    }

    componentDidMount = async () => {
        this._isMounted = true;

        const response = await this.props.fetchAllComments();
        if(!response){
            this.setState({ apiInitialLoadError: true });
        }
        const comments = Object.values(response);
        this.setState({ comments: comments });
    }

    handleContents(event){
        const input = event.target.value;
        this.setState({ contents: input });
        // TODO: Validation
    }

    handleSubmit = async () => {
        // TODO: Check validation

        const userName = `${this.props.userFirstName} ${this.props.userLastName}`;
        const contents = this.state.contents;
        const dateString = await this.props.fetchServerTime();
        const dateObject = new Date(Date.parse(dateString));
        const date = encodeURIComponent(this.formatDate(dateObject, true));

        if(this.state.showCreate){
            const response = await this.props.createComment(userName, contents, date);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        } else if(this.state.showEdit){
            const response = await this.props.updateComment(this.state.selectedId, userName, contents, date);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        } else if(this.state.showDelete){
            const response = await this.props.deleteComment(this.state.selectedId);
            if(!response){
                this.setState({ apiError: true });
                return null;
            }
        }

        this.setState({ submitted: true});

        setTimeout(async () => {
            const response = await this.props.fetchAllComments();
            if(!response){
                this.setState({ apiInitialLoadError: true });
            }
            const comments = Object.values(response);
            this.setState({ comments: comments, selectedId: 0, contents: '' });
            this.setState({ submitted: false, showCreate: false, showEdit: false, showDelete: false });
        }, 2000)
    }
    handleCancel = () => {
        this.setState({ showCreate: false, showEdit: false, submitted: false });
    }

    renderForm = () => {
        if(this.state.submitted && !this.state.showDelete){
            const type = this.state.showCreate ? 'created' : 'edited';
            return <h5>Comment {type} successfully!</h5>;
        }
        if(this.state.showCreate || this.state.showEdit){
            return(
                <Form>
                    <Form.Row>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                disabled
                                value={`${this.props.userFirstName} ${this.props.userLastName}`}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group controlId="contents">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={this.state.contents}
                                onChange={this.handleContents}
                            />
                        </Form.Group>
                    </Form.Row>
                    {this.renderFormAdmin()}
                </Form>
            );
        } else {
            return <Button onClick={() => this.setState({ showCreate: true })}>Add Comment</Button>;
        }
    }
    renderFormAdmin = () => {
        return(
            <>
                <Button onClick={this.handleCancel} variant="danger">Cancel</Button>
                <Button onClick={this.handleSubmit} variant="info">Submit</Button>
            </>
        );
    }

    renderComments = () => {
        if(Object.keys(this.state.comments).length === 0){
            return <h3>No comments were found :(</h3>
        } else {
            const comments = this.state.comments;
            return(
                <ul className="list-group col-10">

                {comments.map(comment => {
                    return(
                        <li className="list-group-item" key={comment.id}>
                            <div className="row">
                                <div className="col-2 font-weight-bold">{comment.name}</div>
                                <div className="col-6">{comment.contents}</div>
                                <div className="col-2 coolor-text-grey-darken-1">{this.formatDate(comment.date, false, comment.edited)}</div>
                                <div className="col-2">{this.renderAdmin(comment)}</div>
                            </div>
                        </li>
                    );
                })}
                </ul>
            );
        }
    }
    formatDate(dateString, dateOnly, edited){
        if(dateString === null){
            return null;
        }

        const date = new Date(Date.parse(dateString));

        const year = date.getFullYear().toLocaleString(undefined, { minimumIntegerDigits: 4 }).replace(',', '');
        const month = (date.getMonth() + 1).toLocaleString(undefined, { minimumIntegerDigits: 2 });
        const day = date.getDate().toLocaleString(undefined, { minimumIntegerDigits: 2 });
        if(dateOnly){
            return `${year}${month}${day}`;
        } if(edited){
            return `Edited on ${month}/${day}/${year}`;
        } else {
            return `Posted on ${month}/${day}/${year}`;
        }
    }
    renderAdmin(comment){
        if(comment.id === this.state.selectedId){
            if(this.state.showEdit){
                return <Button variant="info">Editing...</Button>
            } else if(this.state.showDelete) {
                if(this.state.submitted){
                    return <h5>Deleting comment...</h5>
                } else {
                    return <Button variant="danger" onClick={this.handleSubmit}>Confirm Delete</Button>
                }
            }
        } else if(comment.name === `${this.props.userFirstName} ${this.props.userLastName}`){
            return(
            <>
                <Button 
                    variant="info"
                    onClick={async () => {
                        this.setState({ showEdit: true, selectedId: comment.id });
                        const response = await this.props.fetchComment(comment.id);
                        if(!response){
                            this.setState({ apiError: true });
                        }
                        this.setState({ contents: response.data[0].contents });
                    }}
                >
                    Edit
                </Button>
                <Button
                    variant="danger"
                    onClick={() => this.setState({ showDelete: true, selectedId: comment.id })}
                >
                    Delete
                </Button>
            </>
            );
        } else {
            return null;
        }
    }

    renderContents = () => {
        if(this.state.apiInitialLoadError){
            return <h3>An error occurred while loading comments. Please refresh the page to try again.</h3>
        } else {
            return(
                <>
                    {this.renderForm()}
                    {this.renderComments()}
                </>
            );
        }
    }

    render = () => {
        return(
            <>
                {this.renderContents()}
            </>
        );
    }

}

const mapStateToProps = state => {
    return{
        userFirstName: state.auth.userFirstName,
        userLastName: state.auth.userLastName
    };
}

export default connect(mapStateToProps,
    {
        fetchServerTime,
        fetchComment,
        fetchAllComments,
        createComment,
        updateComment,
        deleteComment
    })(ShowComments);