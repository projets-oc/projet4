import React from 'react'

import Cart from './Cart'
import Counter from './TicketCounter'
import FormOrder from './FormOrder'
import FormTicket from './FormTicket'
import FormPaiement from './FormPaiement'
import Breadcrumb from './Breadcrumb'
import ThankYou from './ThankYou'

import {isEmailValid} from '../helpers'
import {handleOrder, addTicket, removeTicket, fetchTickets, fetchRemainingTickets} from '../api'

import {StripeProvider} from 'react-stripe-elements'
import {Container, Row, Col} from 'reactstrap'
import {message, Button, Spin} from 'antd';


export default class FormContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
			lastName: '',
      email: '',
      date: '',
      selectedDay: undefined,
      isDisabled: false,
      tickets: [],
      reservationCode: undefined,
      isFormOrderCompleted: false,
      isFormTicketCompleted: false,
      isFormPaiementCompleted: false,
      showForm: 1, 
      loading: false,
    }
    this.setLoading = this.setLoading.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleTicketAdd = this.handleTicketAdd.bind(this);
    this.handleRemoveTicket = this.handleRemoveTicket.bind(this);

    this.handleSubmitFormTicket = this.handleSubmitFormTicket.bind(this);
    this.showForm = this.showForm.bind(this);
    this.getTickets = this.getTickets.bind(this);

    this.handleSubmitFormPaiement = this.handleSubmitFormPaiement.bind(this);
  }

  setLoading(isLoading) {
    this.setState({loading: isLoading})
  }

  async handleSubmit(event) {
    event.preventDefault();
    const order = {}
    order.firstName = this.state.firstName
    order.lastName = this.state.lastName
    order.email = this.state.email
    order.date = this.state.selectedDay
    
    // console.log(order)
    const result = await handleOrder(order)

    // console.log(result)
    if (result.errors) {
      message.error(result.errors[0]);
      this.setState({ 
        emailError: result.errors[0],
        loading: false,
      })
      return
    }
    message.success(result.message)
    this.setState({ 
      isFormOrderCompleted: true,
      loading: false,
      showForm: this.state.showForm + 1,
      reservationCode: result.reservationCode,
    })
  }

  showForm(n) {
    this.setState({
      showForm: n,
    })
  }

	handleInputChange(event) {
		const target = event.target;
		const name = target.name;
		const value = target.type === 'checkbox' ? target.checked : target.value;

		const error = this.validateInput(name, value)

		this.setState({
			[name]: value,
			[`${name}Error`]: error,
		})
  }
  
  validateInput(name, value) {
		// console.log(name.toLowerCase().includes('name'))
		if (name === 'email' && !isEmailValid(value)) return 'Adresse email invalide';
		if (name.toLowerCase().includes('name') && value.length < 2) return `Entrez un nom valide`;
		return false;
	}

  handleDayChange(selectedDay, modifiers) {
		// console.log(modifiers)
		this.setState({
			selectedDay: modifiers.disabled === true ? undefined : selectedDay,
			isDisabled: modifiers.disabled === true
		})
	}

  // FORM 2

  handleSubmitFormTicket(){
    this.setState({ 
      isFormTicketCompleted: true,
      showForm: this.state.showForm + 1,
    })
  }

  async handleTicketAdd(ticket) {
    const result = await addTicket(ticket)

    if(!result.success) {
      message.error(result.message);
    }

    this.setState({
      // tickets: [...this.state.tickets, ticket],
      tickets: result.tickets,
      totalHT: result.totalHT,
      totalTTC: result.totalTTC,
      TVA: result.TVA,
    })
    console.log(this.state.tickets)
    message.success(result.message);
  }

  async getTickets() {
    const result = await fetchTickets()
    console.log(result)
    if (!result.success) {
      message.error('impossible de récupérér les billets')
      return
    }

    this.setState({
      tickets: result.tickets,
      totalHT: result.totalHT,
      totalTTC: result.totalTTC,
      TVA: result.TVA,
    })
  }

  async handleRemoveTicket(id){
    const result = await removeTicket(id)
    if (result.success) {
      this.getTickets()
      message.success('Billet supprimé')
      return
    }
    message.error('Impossible de supprimer ce billet')
  }

    // FORM 3

    handleSubmitFormPaiement(responseMessage) {
      message.success(responseMessage)
      this.setState({
        isFormPaiementCompleted: true,
      })
    }

  render() {
    let form
    let show

    const counter = this.state.selectedDay ? <Counter date={this.state.selectedDay} /> : null;
    
    if (this.state.showForm === 1) {
      form = <FormOrder
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        handleDayChange={this.handleDayChange}
        counter={counter}
        {...this.state}
      />
      show = 1
    } else if (this.state.showForm === 2) {
      form = <FormTicket {...this.state} handleTicketAdd={this.handleTicketAdd} getTickets={this.getTickets} counter={counter}/>
      show = 2
    } else if (this.state.showForm === 3) {
      form = (
        <StripeProvider apiKey="pk_test_OFwnhpsnI4Xwml5cxOzWH6UX">
          <FormPaiement {...this.state} handleSubmit={this.handleSubmitFormPaiement} setLoading={this.setLoading}/>
        </StripeProvider>
      )
      show = 3
    } else {
      form = <ThankYou {...this.state} />
    }

    const {isFormOrderCompleted, isFormTicketCompleted, isFormPaiementCompleted} = this.state
    if (isFormOrderCompleted && isFormTicketCompleted && isFormPaiementCompleted) {
      return <ThankYou {...this.state}/>
    } else {
      return (
        <div>
          <Breadcrumb show={show} showForm={this.showForm}/>
          <Container>
            <Row >
              <Col md={{ size: 4, order: 2 }} style={ show === 2 ? animation.delayed : hide} className="mb-4" >
                <Cart 
                tickets={this.state.tickets} 
                handleRemoveTicket={this.handleRemoveTicket}
                totalHT={this.state.totalHT}
                totalTTC={this.state.totalTTC}
                TVA={this.state.TVA}
                />
                <div className="text-center">
                    <Button type="primary" disabled={this.state.tickets.length === 0} onClick={this.handleSubmitFormTicket} > Commander &#8594;</Button>
                </div>
              </Col>
            
              <Col md={{ size: 8, order: 1, offset: show === 2 ? 0 : 2 }} style={animation.classic}>
              <Spin spinning={this.state.loading}>
                {form}
              </Spin>
              </Col>
            </Row>
          </Container>
        </div>
      )
    }
  }
} 

const animation = {
  classic: {
    transition: 'all 1s linear',
  },
  delayed: {
    transition: 'all 0s linear 1s',
  },
  checkout: {
    transition: 'all 1s linear 1s',
  }
}

const hide = {
  position: 'absolute',
  opacity: '0',
}