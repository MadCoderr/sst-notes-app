import Stripe from "stripe";
import { APIGatewayProxyEvent } from "aws-lambda";

import { Config } from "sst/node/config";

import handler from "@notes/core/handler";
import { calculateCost } from "@notes/core/cost";

export const main = handler(async (event: APIGatewayProxyEvent) => {
  // storage ==> number of notes the user would like to store in his account
  // source ==> Stripe token for the card that we are going to charge
  const { storage, source } = JSON.parse(event.body || "{}");

  const amount = calculateCost(storage);
  const description = "Scratch charge";

  // Load our secret key
  const stripe = new Stripe(Config.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  await stripe.charges.create({
    source,
    amount,
    description,
    currency: "usd",
  });

  return JSON.stringify({ status: true });
});
