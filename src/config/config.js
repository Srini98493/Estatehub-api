const dotenv = require('dotenv');
const path = require('path');
const Joi = require('@hapi/joi');

// Determine the environment and load the corresponding .env file
const envFile = `.env.${process.env.NODE_ENV || 'dev'}`;
dotenv.config({ path: path.join(__dirname, '../../', envFile) });

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string()
			.valid('prod', 'dev', 'local', 'qa', 'uat')
			.required(),
		PORT: Joi.number().default(3000),

		JWT_SECRET: Joi.string().required().description('JWT secret key'),
		JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
			.default(30)
			.description('minutes after which access tokens expire'),
		JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
			.default(30)
			.description('days after which refresh tokens expire'),

		COOKIE_EXPIRATION_HOURS: Joi.number()
			.default(24)
			.description('hours after which httpOnly cookie expire'),

		SQL_USERNAME: Joi.string().description('sqldb username'),
		SQL_HOST: Joi.string().description('sqldb host'),
		SQL_DATABASE_NAME: Joi.string().description('sqldb database name'),
		SQL_PASSWORD: Joi.string().description('sqldb password'),
		SQL_DIALECT: Joi.string()
			.default('postgres')
			.description('type of sqldb'),
		SQL_MAX_POOL: Joi.number()
			.default(10)
			.min(5)
			.description('sqldb max pool connection'),
		SQL_MIN_POOL: Joi.number()
			.default(0)
			.min(0)
			.description('sqldb min pool connection'),
		SQL_IDLE: Joi.number()
			.default(10000)
			.description('sqldb max pool idle time in miliseconds'),

		SMTP_HOST: Joi.string().description('server that will send the emails'),
		SMTP_PORT: Joi.number().description(
			'port to connect to the email server'
		),
		SMTP_USERNAME: Joi.string().description('username for email server'),
		SMTP_PASSWORD: Joi.string().description('password for email server'),
		EMAIL_FROM: Joi.string().description(
			'the from field in the emails sent by the app'
		),

		POSTGRES_USER: Joi.string().description('postgres user'),
		POSTGRES_HOST: Joi.string().description('postgres host'),
		POSTGRES_DB: Joi.string().description('postgres database'),
		POSTGRES_PASSWORD: Joi.string().description('postgres password'),
		POSTGRES_PORT: Joi.number().description('postgres port'),

		WEBSITE_URL: Joi.string().description('website url'),

		ADMIN_EMAIL: Joi.string().description('admin email'),

		ESTATE_HUB_LOGO_URL: Joi.string().uri().required().description('Estate Hub logo URL'),

	})
	.unknown();

const { value: envVars, error } = envVarsSchema
	.prefs({ errors: { label: 'key' } })
	.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	pagination: {
		limit: 10,
		page: 1,
	},
	jwt: {
		secret: envVars.JWT_SECRET || 'your-secret-key',
		accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES || 3000,
		refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS || 30,
		resetPasswordExpirationMinutes: 10,
	},
	cookie: {
		cookieExpirationHours: envVars.COOKIE_EXPIRATION_HOURS,
	},
	sqlDB: {
		user: envVars.SQL_USERNAME,
		host: envVars.SQL_HOST,
		database: envVars.SQL_DATABASE_NAME,
		password: envVars.SQL_PASSWORD,
		dialect: envVars.SQL_DIALECT,
		pool: {
			max: envVars.SQL_MAX_POOL,
			min: envVars.SQL_MIN_POOL,
			idle: envVars.SQL_IDLE,
		},
		define: {
			/**
			 * All tables won't have "createdAt" and "updatedAt" Auto fields.
			 * References: https://sequelize.org/master/manual/model-basics.html#timestamps
			 */
			timestamps: false,
			// Table names won't be pluralized.
			freezeTableName: true,
			// Column names will be underscored.
			underscored: true,
		},
	},
	email: {
		smtp: {
			host: envVars.SMTP_HOST,
			port: envVars.SMTP_PORT,
			auth: {
				user: envVars.SMTP_USER,
				pass: envVars.SMTP_PASS,
			},
		},
		from: envVars.EMAIL_FROM,
	},

	postgres: {
		user: envVars.POSTGRES_USER,
		host: envVars.POSTGRES_HOST,
		database: envVars.POSTGRES_DB,
		password: envVars.POSTGRES_PASSWORD,
		port: envVars.POSTGRES_PORT,
	},

	websiteurl: envVars.WEBSITE_URL,

	adminEmail: envVars.ADMIN_EMAIL,

	websitelogourl: envVars.ESTATE_HUB_LOGO_URL,
};
