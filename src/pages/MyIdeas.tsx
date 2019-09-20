import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import * as api from '../utils/api';

import './MyIdeas.scss';
import { Idea, IdeaProperty, IconTypes } from '../utils/types';
import { Select, Icon } from '../components';

type Props = {
  jwt: string;
};

type State = {
  addingItem: boolean;
  editingIdeaId: string;
  ideas: Array<Idea>;
  itemToDelete: string;
  impact: number;
  ease: number;
  confidence: number;
  showModal: boolean;
  content: string;
};

class MyIdeas extends React.Component<Props, State> {
  state = {
    addingItem: false,
    editingIdeaId: '',
    ideas: [],
    itemToDelete: '',
    impact: 10,
    ease: 10,
    confidence: 10,
    showModal: false,
    content: '',
  };

  componentDidMount() {
    this.getIdeas();
  }

  getIdeas = async () => {
    try {
      const data = await api.getIdeas(this.props.jwt);
      this.setState({ ideas: data });
    } catch (error) {
      console.error(error);
    }
  };

  onAddIdea = () => this.setState({ addingItem: true });

  onCancel = () =>
    this.setState({
      impact: 10,
      ease: 10,
      confidence: 10,
      addingItem: false,
      editingIdeaId: '',
      content: '',
    });

  onConfirmDeletion = async () => {
    try {
      await api.deleteIdea(this.state.itemToDelete, this.props.jwt);
      this.setState({
        itemToDelete: '',
        showModal: false,
      });
      await this.getIdeas();
    } catch (error) {
      console.error(error);
    }
  };

  onSaveOrUpdateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    const idea = {
      impact: this.state.impact,
      ease: this.state.ease,
      confidence: this.state.confidence,
      content: this.state.content,
    };
    try {
      if (this.state.editingIdeaId) {
        await api.updateIdea(this.state.editingIdeaId, idea, this.props.jwt);
        this.setState({ editingIdeaId: '' });
      } else {
        if (!this.state.content) return;
        await api.postIdea(idea, this.props.jwt);
      }
      await this.getIdeas();
      this.onCancel();
    } catch (error) {
      console.error(error);
    }
  };

  renderHeader() {
    return (
      <div className="row my-5">
        <div className="col">
          <h2>My Ideas</h2>
        </div>
        <div className="col-1">
          <Icon icon={IconTypes.addIdea} onPress={this.onAddIdea} />
        </div>
      </div>
    );
  }

  renderIdeasHeader() {
    return (
      <div className="row mt-4 header">
        <div className="col" />
        <div className="col-1 text-center">Impact</div>
        <div className="col-1 text-center">Ease</div>
        <div className="col-1-lg text-center">Confidence</div>
        <div className="col-1 text-center">
          <strong>Avg.</strong>
        </div>
        <div className="col-1" />
      </div>
    );
  }

  openModalToConfirmDeletion = (i: string | undefined) => {
    if (!i) return;
    this.setState(() => ({
      showModal: true,
      itemToDelete: i,
    }));
  };

  toggle = () =>
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));

  renderModal() {
    return (
      <Modal isOpen={this.state.showModal} toggle={this.toggle} backdrop>
        <ModalHeader className="align-self-center border-0">Are you sure?</ModalHeader>
        <ModalBody className="text-center">This idea will be permanently deleted.</ModalBody>
        <ModalFooter className="border-0 mx-auto">
          <button type="button" className="btn btn-link-dark" onClick={this.toggle}>
            CANCEL
          </button>{' '}
          <button type="button" className="btn btn-link" onClick={this.onConfirmDeletion}>
            OK
          </button>
        </ModalFooter>
      </Modal>
    );
  }

  onSelect = (key: IdeaProperty, event: React.ChangeEvent<HTMLSelectElement>) =>
    this.setState<never>({ [key]: parseInt(event.target.value, 10) });

  handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ content: event.target.value });

  renderAddIdea() {
    const { impact, ease, confidence, content } = this.state;
    const average = Math.floor((impact + ease + confidence) / 3);
    return (
      <form className="row my-3" onSubmit={this.onSaveOrUpdateIdea}>
        <div className="col">
          <span className="oval" />
          <input
            autoFocus
            className="form-control form-control-sm"
            maxLength={255}
            onChange={this.handleTextChange}
            type="text"
            value={content}
          />
        </div>
        <div className="col-1 text-center">
          <Select title="impact" value={impact} onSelect={this.onSelect} />
        </div>
        <div className="col-1 text-center">
          <Select title="ease" value={ease} onSelect={this.onSelect} />
        </div>
        <div className="col-1-lg text-center">
          <Select title="confidence" value={confidence} onSelect={this.onSelect} />
        </div>
        <div className="col-1 text-center">{average}</div>
        <div className="col-1 d-inline-flex">
          <Icon onPress={this.onSaveOrUpdateIdea} icon={IconTypes.confirm} />
          <Icon onPress={this.onCancel} icon={IconTypes.cancel} />
        </div>
      </form>
    );
  }

  /** set an item as editing */
  onEditIdea = (i: string | undefined) => {
    if (!i) return;
    const idea: any = this.state.ideas.find((it: Idea) => it.id === i);
    this.setState<never>({ editingIdeaId: i, ...idea });
  };

  toggleModal = (id: string) =>
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      itemToDelete: id,
    }));

  renderIdeas() {
    const { ideas, editingIdeaId }: { ideas: Idea[]; editingIdeaId: string } = this.state;
    return (
      <>
        {ideas.map((idea, i) =>
          editingIdeaId === idea.id ? this.renderItemEditing(idea) : this.renderItemCompleted(idea)
        )}
      </>
    );
  }

  renderItemEditing(idea: Idea) {
    const { content, impact, ease, confidence } = this.state;
    const average = Math.floor((impact + ease + confidence) / 3);
    return (
      <form key={idea.id} className="row my-3" onSubmit={this.onSaveOrUpdateIdea}>
        <div className="col">
          <span className="oval" />
          <input
            autoFocus
            className="form-control form-control-sm"
            type="text"
            onChange={this.handleTextChange}
            maxLength={255}
            value={content}
          />
        </div>
        <div className="col-1 text-center">
          <Select title="impact" value={impact} onSelect={this.onSelect} />
        </div>
        <div className="col-1 text-center">
          <Select title="ease" value={ease} onSelect={this.onSelect} />
        </div>
        <div className="col-1-lg text-center">
          <Select title="confidence" value={confidence} onSelect={this.onSelect} />
        </div>
        <div className="col-1 text-center">{average}</div>
        <div className="col-1 buttons d-inline-flex">
          <Icon onPress={this.onSaveOrUpdateIdea} icon={IconTypes.confirm} />
          <Icon onPress={this.onCancel} icon={IconTypes.cancel} />
        </div>
      </form>
    );
  }

  renderItemCompleted(idea: Idea) {
    const average = Math.floor((idea.impact + idea.ease + idea.confidence) / 3);
    return (
      <div key={idea.id} className="row my-3 idea">
        <div className="col">
          <span className="oval" />
          <span className="value">{idea.content}</span>
        </div>
        <div className="col-1 text-center">{idea.impact}</div>
        <div className="col-1 text-center">{idea.ease}</div>
        <div className="col-1-lg text-center">{idea.confidence}</div>
        <div className="col-1 text-center">{average}</div>
        <div className="col-1 d-inline-flex">
          <Icon onPress={() => this.onEditIdea(idea.id)} icon={IconTypes.edit} />
          <Icon onPress={() => this.openModalToConfirmDeletion(idea.id)} icon={IconTypes.delete} />
        </div>
      </div>
    );
  }

  renderEmptyState() {
    return (
      <div className="row empty-state align-items-center d-flex flex-column justify-content-center">
        <img
          className="bulb mb-3"
          src={require('../images/bulb.png')}
          alt="light bulb"
          srcSet={`${require('../images/bulb@2x.png')} 2x`}
        />
        <h5 className="font-weight-normal">Got Ideas?</h5>
      </div>
    );
  }

  render() {
    const { ideas, addingItem, editingIdeaId } = this.state;

    const addingOrEditing = addingItem || editingIdeaId;
    return (
      <div className="my-ideas col container">
        {this.renderHeader()}
        <hr />
        {(ideas.length > 0 || addingOrEditing) && this.renderIdeasHeader()}
        {addingItem && this.renderAddIdea()}
        {ideas.length > 0 ? this.renderIdeas() : !addingOrEditing && this.renderEmptyState()}
        {this.renderModal()}
      </div>
    );
  }
}

export default MyIdeas;
