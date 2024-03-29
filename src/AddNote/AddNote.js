import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import ValidationError from '../ValidationError/ValidationError'
import './AddNote.css'

export default class AddNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NoteName: {
        value: '',
        touched: false
      }
    }
  }
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  updateNoteName(name) {
    this.setState({NoteName: {value: name, touched: true}});
  }

  validateNoteName() {
    const name = this.state.NoteName.value.trim();
    if (name.length === 0) {
      return "Name is required";
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const newNote = {
      note_name: e.target['note-name'].value,
      content: e.target['note-content'].value,
      folder_id: e.target['note-folder-id'].value,
      modified: new Date(),
    }
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(note => {
        this.context.addNote(note)
        //this.props.history.push(`/folder/${note.folder_id}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const nameError = this.validateNoteName();
    const { folders=[] } = this.context
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' name='note-name' required
            onChange={e => this.updateNoteName(e.target.value)}/>
            {this.state.NoteName.touched && (<ValidationError message={nameError} />)}
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' name='note-content' required/>
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='note-folder-id' required>
              <option value={null}></option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id} required>
                  {folder.folder_name}
                </option>
              )}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit' disabled={this.validateNoteName()} 
             onClick={() => this.props.history.goBack()}>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}