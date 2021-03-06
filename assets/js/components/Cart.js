import React from 'react'
import { Popconfirm } from 'antd';

const Cart = ({tickets, handleRemoveTicket, totalTTC = 0, totalHT = 0, TVA = 0.2}) => {

	const ticketList = tickets.map(ticket => {
		const formula = ticket.isFullDay ? 'Journée complète' : 'Demi-journée'
		return (
			<Ticket 
				price={ticket.price / 100} 
				rateName={ticket.priceName} 
				name={`${ticket.firstName.slice(0, 1).toUpperCase()}. ${ticket.lastName}`} 
				formula={formula} 
				handleRemoveTicket={handleRemoveTicket}
				id={ticket.id}
				key={ticket.id}
			/>
		)
	})

 	return (
	<div>
		<h4 className="d-flex justify-content-between align-items-center mb-3">
			<span className="text-muted">Panier</span>
			<span className="badge badge-secondary badge-pill"> {tickets.length} </span>
		</h4>

		<ul className="list-group mb-3" >
			{ticketList}
			<li className="list-group-item d-flex justify-content-between">
				<span>Total HT (EUR)</span>
				<strong>{totalHT / 100}€</strong>
			</li>
			<li className="list-group-item d-flex justify-content-between">
				<span>TVA</span>
				<strong>{TVA * 100}%</strong>
			</li>
			<li className="list-group-item d-flex justify-content-between">
				<span>Total TTC (EUR)</span>
				<strong>{totalTTC / 100}€</strong>
			</li>
		</ul>
	</div>
	)

}

const Ticket = props => (
		<li className="list-group-item d-flex justify-content-between lh-condensed">
		<div>
			<h6 className="my-0">Billet {props.rateName} - <small>{props.name}</small>
				{/* <a href="#" className="badge badge-light">Éditer</a>  */}
			</h6>
			<small className="text-muted"> {props.formula} </small>
		</div>
		<div className="d-flex flex-column" >
			<div style={{marginTop: '-.6rem'}} className="text-right">
			<Popconfirm title="Supprimer le billet du panier ?" onConfirm={() => props.handleRemoveTicket(props.id)} placement="leftBottom" okText="Oui" cancelText="Non">
				<span 
					className="text-danger remove-ticket" 
					style={{fontSize: 20}}
				>
					&#215;
				</span>
			</Popconfirm>
			</div>
			<span className="text-muted">{props.price}€</span>
		</div>
	</li>
);
export default Cart