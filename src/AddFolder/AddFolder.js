import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import ValidationError from '../ValidationError/ValidationError'
import PropTypes from 'prop-types';
import './AddFolder.css'

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FolderName: {
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

  updateName(name) {
    this.setState({FolderName: {value: name, touched: true}});
  }

  validateFolderName() {
    const name = this.state.FolderName.value.trim();
    if (name.length === 0) {
      return "Name is required";
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const folder = {
      name: e.target['folder-name'].value
    }
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(folder => {
        this.context.addFolder(folder)
        this.props.history.push(`/folder/${folder.id}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const nameError = this.validateFolderName();
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input type='text' id='folder-name-input' name='folder-name' 
            onChange={e => this.updateName(e.target.value)}/>
            {this.state.FolderName.touched && (<ValidationError message={nameError} />)}
          </div>
          <div className='buttons'>
            <button type='submit' disabled={this.validateFolderName()}>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}

AddFolder.propTypes = {
  value: PropTypes.string.isRequired
};