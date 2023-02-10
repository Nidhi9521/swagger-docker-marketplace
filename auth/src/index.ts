import mongoose from 'mongoose';
import { app } from './app';
import { ExpirationCompleteListener } from './events/listener/expiration-complete-listener';
import { StoreCreatedListener } from './events/listener/store-listener';
import { StoreUpdatedListener } from './events/listener/store-updated-listener';
import { natsWrapper } from './nats-wrapper';
//MONGO_URI_AUTH=mongodb+srv://nidhi:Nidhi%400905@nasa.uvkxz6f.mongodb.net/auth?tls=true&tlsInsecure=true
// MONGO_URI_STORE=mongodb+srv://nidhi:Nidhi%400905@nasa.uvkxz6f.mongodb.net/store?tls=true&tlsInsecure=true
// MONGO_URI_ORDER=mongodb+srv://nidhi:Nidhi%400905@nasa.uvkxz6f.mongodb.net/order?tls=true&tlsInsecure=true
// MONGO_URI_PRODUCT=mongodb+srv://nidhi:Nidhi%400905@nasa.uvkxz6f.mongodb.net/product?tls=true&tlsInsecure=true
// JWT_KEY="auth_key_dev"
// NATS_CLIENT_ID_AUTH="abc"
// NATS_CLIENT_ID_ORDER="def"
// NATS_CLIENT_ID_STORE="ghi"
// NATS_CLIENT_ID_PRODUCT="jkl"
// NATS_URI="nats://nats:4222"
// NATS_CLUSTER_ID="amethyst-cluster"
//
const port = 3001;

const start = async () => {

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  console.log('process.env.MONGO_URI',process.env.MONGO_URI);
  
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  console.log('process.env.NATS_URI',process.env.NATS_URI);
  
  if (!process.env.NATS_URI) {
    throw new Error('NATS_URII must be defined');
  }

  try {
    await natsWrapper.connect(
      (process.env.NATS_CLUSTER_ID),
      (process.env.NATS_CLIENT_ID),
      (process.env.NATS_URI).trim()
    );

    natsWrapper.client.on('close', () => {
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    
    mongoose.set('strictQuery', false)
    await mongoose.connect((process.env.MONGO_URI).trim());
    
    new StoreCreatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new StoreUpdatedListener(natsWrapper.client).listen();
    
  } catch (error: any) {
    throw Error(error);
  }

  app.listen(port, () => {
    console.log('listen at', port);
  });

};

start();
