#!/usr/bin/env bash

# Setup minter account

curl --request POST \
  --url http://localhost:3000/v1/culture-tokens/setup \
  --header 'Content-Type: application/json'

curl --request POST \
  --url http://localhost:3000/v1/cultural-items/setup \
  --header 'Content-Type: application/json'

curl --request POST \
  --url http://localhost:3000/v1/market/setup \
  --header 'Content-Type: application/json'

# Mint Kibble and Kitty Items

curl --request POST \
  --url http://localhost:3000/v1/culture-tokens/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "'$FLOW_ADDRESS'",
    "amount": 50.0
  }'

curl --request POST \
  --url http://localhost:3000/v1/cultural-items/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "'$FLOW_ADDRESS'",
    "name": "Machel Diaper",
    "description": "The diaper that Machel Montano wore for one of his first ever performances.",
    "year": "1984",
    "country": "Trinidad and Tobago",
    "culturalSignificance": "Soca",
    "metadata": { "asset": "bafkreihxsiyfgxut6mex23kernzwkrsufvx4nh3mwx3rxkp44adrqmsp5u" }
  }'

curl --request POST \
  --url http://localhost:3000/v1/market/sell \
  --header 'Content-Type: application/json' \
  --data '{
    "itemId": 0,
    "price": 7.5
  }'
