const { version } = require('../../package.json');
const config = require('../config/config');

let serverUrl;

switch (config.env) {
  case 'prod':
    serverUrl = 'https://api-prod.estateshub.co.in/v1'; // Replace with your production URL
    break;
  case 'uat':
    serverUrl = 'https://api-dev.estateshub.co.in/v1'; // Replace with your UAT URL
    break;
  case 'dev':
    serverUrl = 'https://api-dev.estateshub.co.in/v1'; // Replace with your dev URL
    break;
  default:
    serverUrl = `http://localhost:${config.port}/v1`;
}

const swaggerDef = {
	openapi: '3.0.0',
	info: {
		title: 'Asset Management API Documentation',
		version,
		description: 'API documentation for Property and Service management',
	},
	servers: [
		{
			url: serverUrl,
			description: `${config.env.charAt(0).toUpperCase() + config.env.slice(1)} server`,
		  },
	],
	tags: [
		{
			name: 'Properties',
			description: 'Property management operations',
		},
		{
			name: 'Services',
			description: 'Service management operations',
		},
	],
	components: {
		securitySchemes: {
		  bearerAuth: {
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
		  },
		},
		schemas: {
		  CreateUser: {
			type: 'object',
			required: ['name', 'email', 'password'],
			properties: {
			  name: { type: 'string', example: 'John Doe' },
			  email: { type: 'string', format: 'email', example: 'john@example.com' },
			  password: { type: 'string', format: 'password', example: 'P@ssw0rd' },
			},
		  },
		  UpdateUser: {
			type: 'object',
			properties: {
			  name: { type: 'string', example: 'Jane Doe' },
			  email: { type: 'string', format: 'email', example: 'jane@example.com' },
			},
		  },
		},
	  },
	  security: [
		{
		  bearerAuth: [],
		},
	  ],
	};
	
	module.exports = swaggerDef;