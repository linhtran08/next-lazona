import React from 'react';
import {Step, StepLabel, Stepper} from "@mui/material";

const CheckoutWizard = ({activeStep = 0}) => (
	<Stepper activeStep={activeStep} alternativeLabel sx={{my: 4}}>
		{
			['Login', 'Shipping Address', 'Payment Method', 'Place Order'].map((step) =>(
				<Step key={step}>
					<StepLabel>{step}</StepLabel>
				</Step>
			))
		}
	</Stepper>
);

export default CheckoutWizard;