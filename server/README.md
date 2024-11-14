## Setup

### Dependencies

This Express application requires the following:

- A `.env` file for environment variables.
- A public/private key pair for secure operations.

### Environment Variables

In the root of the project, create a `.env` file with the following content:

```plaintext
DB_STRING=<your MongoDB connection string>
PORT=<Your server's port>
FRONT_END=<your front end URL>
STRIPE_PRIVATE_KEY=<Stripe private key>
WEBHOOK_SECRET=<Stripe's webhook secret>
```

### MongoDB Setup

You will need a running MongoDB instance. You can use MongoDB Atlas on a free tier or set up a local database server.

### Generate Keypair

Generate a public/private key pair using the provided script. Ensure your NodeJS version is 10.x or higher.

```bash
node generateKeypair.js
```

The private key is automatically excluded from version control by `.gitignore`.

## Quickstart

### Running the Application

1. Start the MongoDB database if using a local instance:
   ```bash
   mongod
   ```
2. Start the Express server:
   ```bash
   node app.js
   # Server runs on http://localhost:3000 by default
   ```
3. Import the JSON file containing product data from 'server/products_example' into your MongoDB database if necessary.

## Support

Should you face any issues, please contact me via email at `minehamza97@gmail.com`.
