import React, {useState} from 'react'
import {navigate} from 'gatsby'
import {Header, Message, Form, Segment, Input, Button} from 'semantic-ui-react'
import SEO from '../components/SEO'
import Layout from '../components/Layout'
import useForm from '../components/Hooks/useForm'

const ContactPage = ({location}) => {
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState([])

  const sendMessage = () => {
    setLoading(true)
    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({values}),
    })
      .then(response => {
        console.log(response.body)
        navigate('/')
      })
      .catch(error => {
        setLoading(false)
        setApiError(error.errors || error)
      })
  }
  const handleErrors = errors => {
    if (!Array.isArray(errors) && !errors.length > 0) {
      return <Message error header="Sorry" content="Please try again." />
    }
    return errors.map(e => (
      <Message error header={e.title} content={e.detail} key={e.status} />
    ))
  }

  const validate = values => {
    const errors = {}
    if (!values.email) {
      errors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid'
    }
    if (!values.message) {
      errors.message = 'Message is required'
    }
    if (!values.name) {
      errors.name = 'Name is required'
    }
    return errors
  }
  const {values, handleSubmit, handleChange, errors} = useForm(
    sendMessage,
    validate,
  )
  return (
    <Layout location={location}>
      <SEO title="Contact" />
      <Header as="h1">Contact us</Header>
      <Form
        onSubmit={handleSubmit}
        loading={loading}
        error={apiError.length !== 0 || Object.entries(errors).length !== 0}
      >
        {apiError.length !== 0 ? handleErrors(errors) : null}
        <Segment>
          <Form.Field>
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              fluid
              name="name"
              type="name"
              autoFocus
              onChange={handleChange}
              value={values.name || ''}
            />
          </Form.Field>
          {errors.name && (
            <p data-testid="error" style={{color: 'red'}}>
              {errors.name}
            </p>
          )}
          <Form.Field>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              fluid
              name="email"
              type="email"
              autoFocus
              onChange={handleChange}
              value={values.email || ''}
            />
          </Form.Field>
          {errors.email && (
            <p data-testid="error" style={{color: 'red'}}>
              {errors.email}
            </p>
          )}
          <Form.Field>
            <label htmlFor="message">Message</label>
            <Input
              id="message"
              fluid
              name="message"
              type="textarea"
              autoFocus
              onChange={handleChange}
              value={values.message || ''}
            />
          </Form.Field>
          {errors.message && (
            <p data-testid="error" style={{color: 'red'}}>
              {errors.message}
            </p>
          )}
          <Button type="submit" color="orange">
            Send
          </Button>
        </Segment>
      </Form>
    </Layout>
  )
}
export default ContactPage
